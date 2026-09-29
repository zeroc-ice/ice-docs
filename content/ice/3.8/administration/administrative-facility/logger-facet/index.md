---
title: The Logger Facet
---

# The `RemoteLogger` Interface

An administrator may find it useful to view the log of a running Ice application, without going through an intermediary
file. This is especially useful for [Ice services](../services) that use a system log, such as the Windows Event Log.

The `Logger` facet allows remote applications (such as administrative clients) to attach one or more remote loggers to
the local [logger](../logger-facility) of any Ice application (provided this application enables the admin object with a
`Logger` facet). The implementation of the `Logger` facet installs its own logger, which intercepts the log messages
sent to the local logger, caches the most recent log messages, and forwards these log messages (after optional
filtering) to the attached remote loggers.

A remote logger is an Ice object that implements the `Ice::RemoteLogger` interface. Such object is typically implemented
by an administrative client.

```slice
module Ice
{
    enum LogMessageType { PrintMessage, TraceMessage, WarningMessage, ErrorMessage }
    sequence<LogMessageType> LogMessageTypeSeq;

    struct LogMessage
    {
       LogMessageType type;
       long timestamp;
       string traceCategory;
       string message;
    }
    sequence<LogMessage> LogMessageSeq;

    interface RemoteLogger
    {
        void init(string prefix, LogMessageSeq logMessages);
        void log(LogMessage message);
    }
}
```

The `LogMessage` represents log messages sent to a local logger. Its `timestamp` field is the number of microseconds
since the [Unix Epoch](https://en.wikipedia.org/wiki/Unix_time) (January 1st, 1970 at 0:00 UTC).

When a remote logger is attached to a local logger, its `init` operation is called with the local logger's prefix and a
list of recent log messages (see the `LoggerAdmin` interface below). Then, each time a log message is sent to the local
logger, the Logger facet forwards this message to the remote logger's `log` operation.

{% callout type="info" %}

The Logger facet does not guarantee that `init` will be called on a remote logger before `log` is called on this remote
logger, even though the log messages sent to `init` are always older than the log messages sent to `log`. It is indeed
common for `log` to be called several times before `init` in applications that generate many logs. An implementation of
`RemoteLogger` needs to handle this situation correctly: it can for example keep all log messages received before `init`
in a queue, and later append this queue to the log messages received through `init`.

{% /callout %}

# The `LoggerAdmin` Interface

The `Logger` facet implements the `Ice::LoggerAdmin` interface:

```slice
module Ice
{
    interface LoggerAdmin
    {
        void attachRemoteLogger(
            RemoteLogger* prx,
            LogMessageTypeSeq messageTypes,
            StringSeq traceCategories,
            int messageMax) throws RemoteLoggerAlreadyAttachedException;

        bool detachRemoteLogger(RemoteLogger* prx);

        LogMessageSeq getLog(
            LogMessageTypeSeq messageTypes,
            StringSeq traceCategories,
            int messageMax,
            out string prefix);
    }
}
```

The operation `attachRemoteLogger` attaches a remote logger (`prx`) to the local logger with the following optional
filters:

- `messageTypes` specifies the types of log messages this remote logger wants to receive. An empty sequence means no
  filtering–the `Logger` facet will forward all log message types.
- `traceCategories` is a sequence of categories for trace messages. An empty sequence means no filtering–the `Logger`
  facet will forward all trace categories.
- `messageMax` is the maximum number of log messages sent to init. If `messageMax` is negative, all available log
  messages will be sent to `init` (provided they satisfy the `messageTypes` and `traceCategories` filters). If
  messageMax is 0, no log message will be sent to `init`. If `messageMax` is greater than 0, the most recent
  `messageMax` log messages that satisfy the `messageTypes` and `traceCategories` filters will be sent to `init`.

For example, in C++, you can attach a remote logger with no filtering at all as follows:

```cpp
// my remote logger, typically an object implemented by the local application
RemoteLoggerPrx remoteLogger = ...

// get a proxy to the logger admin facet for the target application
Ice::ObjectPrx admin = ...
auto loggerAdmin = admin.ice_facet<Ice::LoggerAdminPrx>("Logger");

loggerAdmin->attachRemoteLogger(
    remoteLogger,
    Ice::LogMessageTypeSeq{},
    Ice::StringSeq{},
    -1);
```

If you are interested only in errors and trace messages for category `Network` with no more than 10 such messages sent
to init, you could write instead:

```cpp
RemoteLoggerPrx remoteLogger = ...
Ice::ObjectPrx admin = ...
auto loggerAdmin = admin.ice_facet<Ice::LoggerAdminPrx>("Logger");

Ice::LogMessageTypeSeq messageTypes{
    Ice::LogMessageType::ErrorMessage,
    Ice::LogMessageType::TraceMessage};

Ice::StringSeq traceCategories{"Network"};

loggerAdmin->attachRemoteLogger(remoteLogger, messageTypes, traceCategories, 10);
```

The operation `detachRemoteLogger` detaches a remote logger (`prx`) from the local logger. `prx` does not need to match
exactly the proxy provided to `attachRemoteLogger`: the `Logger` facet uses only the identity in this proxy.
`detachRemoteLogger` returns true if this remote logger was found (and is now detached), and false otherwise.

The Logger facet automatically detaches a remote logger when a request sent to this remote logger fails. As a result, if
an administrative client forgets to call `detachRemoteLogger` after destroying its remote logger, or crashes, this
remote logger will remain attached only as long as it's not used.

The operation `getLog` retrieves the most recent `messageMax` log messages that match the optional `messageTypes` and
`traceCategories` filters. These parameters have the same meaning as in the `attachRemoteLogger` operation described
above. For example, if you want to retrieve only the 10 most recent errors and trace messages for category `Network`,
you could write:

```cpp
RemoteLoggerPrx remoteLogger = ...
Ice::ObjectPrx admin = ...
auto loggerAdmin = admin.ice_facet<Ice::LoggerAdminPrx>("Logger");

Ice::LogMessageTypeSeq messageTypes{
    Ice::LogMessageType::ErrorMessage,
    Ice::LogMessageType::TraceMessage };

Ice::StringSeq traceCategories{"Network"};

string prefix;
auto logMessages = loggerAdmin->getLog(messageTypes, traceCategories, 10, prefix);
```

# Configuring the `Logger` Facet

The `Logger` facet caches the most recent log messages sent to application's [Logger](../logger-facility), to be able to
provide these log messages to remote loggers (in the `init` operation) and to administrative clients that call `getLog`
(see the [LoggerAdmin Interface](../logger-facet#the-loggeradmin-interface) above). You can configure how many log
messages are cached by the Logger facet with the [Ice.Admin.Logger.KeepLogs](../ice-admin-properties) and
[Ice.Admin.Logger.KeepTraces](../ice-admin-properties) properties. The default is to keep the most recent 100 log
messages other than trace messages plus the most recent 100 trace messages.

##### See Also

- [Logger Facility](../logger-facility)
