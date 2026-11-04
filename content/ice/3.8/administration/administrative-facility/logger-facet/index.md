---
title: The Logger Facet
sidebarLabel: Logger Facet
---

The `Logger` facet lets an administrative client read the log of a running program: it retrieves the recent log
messages, or it attaches a remote logger that receives each new message. The facet intercepts the messages sent to the
program's [logger](../../logger-facility), caches the most recent ones, and forwards each new message to the attached
remote loggers.

Each message is an `Ice::LogMessage` with a type (print, trace, warning, or error), a timestamp in microseconds since
the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time), a trace category, and the message text.

## Filtering Log Messages

The `Logger` facet implements the `Ice::LoggerAdmin` interface. Its `getLog` and `attachRemoteLogger` operations take
the same three filters:

- `messageTypes` selects the types of messages; an empty sequence selects all types.
- `traceCategories` selects the categories of trace messages; an empty sequence selects all categories. Other message
  types pass this filter.
- `messageMax` limits the number of cached messages, keeping the most recent ones; a negative value selects all the
  cached messages that match the other filters, and `0` selects none.

## Retrieving Recent Log Messages

`getLog` returns the cached messages that match the filters, and the prefix of the program's logger. For example, the
following C++ code retrieves the 10 most recent errors and `Network` trace messages:

```cpp
Ice::ObjectPrx admin = ...
auto loggerAdmin = admin.ice_facet<Ice::LoggerAdminPrx>("Logger");

Ice::LogMessageTypeSeq messageTypes{Ice::LogMessageType::ErrorMessage, Ice::LogMessageType::TraceMessage};
Ice::StringSeq traceCategories{"Network"};

string prefix;
auto logMessages = loggerAdmin->getLog(messageTypes, traceCategories, 10, prefix);
```

## Attaching a Remote Logger

A remote logger is an Ice object, typically implemented by the administrative client, that implements the
`Ice::RemoteLogger` interface. Its `init` operation receives the prefix of the program's logger and the cached messages
that match the filters, and its `log` operation receives each new message that matches the
filters.{% iflang langs="swift" %} Swift maps the `init` operation to `initialize`.{% /iflang %}

`attachRemoteLogger` attaches a remote logger with its filters. `messageMax` limits only the messages that the facet
passes to `init`, not the new messages that it sends to `log`. For example, the following C++ code attaches a remote
logger that receives every message, with the 10 most recent cached messages passed to `init`:

```cpp
Ice::RemoteLoggerPrx remoteLogger = ...
loggerAdmin->attachRemoteLogger(remoteLogger, Ice::LogMessageTypeSeq{}, Ice::StringSeq{}, 10);
```

{% callout type="note" %}

The `Logger` facet can call `log` on a remote logger before it calls `init`, even though the messages passed to `init`
are older. This is common in programs that log many messages. A remote logger must handle this order: for example, it
can queue the messages it receives before `init` and append them to the messages that `init` delivers.

{% /callout %}

The `Logger` facet identifies a remote logger by the identity in its proxy: a remote logger can be attached only once,
and `detachRemoteLogger` detaches the remote logger with the identity of the proxy it receives. The facet also detaches
a remote logger when a call to this remote logger fails.

{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}

## Configuring the `Logger` Facet

[Ice.Admin.Logger.KeepLogs](../../../property-reference/ice-admin-properties#ice.admin.logger.keeplogs) and
[Ice.Admin.Logger.KeepTraces](../../../property-reference/ice-admin-properties#ice.admin.logger.keeptraces) set how many
messages other than trace messages, and how many trace messages, the `Logger` facet caches. Both default to `100`.

The `Logger` facet sends messages to remote loggers with a communicator of its own, which you configure with
[Ice.Admin.Logger.Properties](../../../property-reference/ice-admin-properties#ice.admin.logger.properties), and not
over the connection that delivered the `attachRemoteLogger` request. The remote logger must therefore be reachable from
the monitored program. Set
[Ice.Trace.Admin.Logger](../../../property-reference/ice-trace-properties#ice.trace.admin.logger) to trace the
attachment and detachment of remote loggers and the sending of messages to them.

{% /iflang %}

{% iflang langs="python" %}

Ice for Python does not expose the built-in `Logger` facet as a local object: `communicator.findAdminFacet("Logger")`
returns `None`. To interact with the `Logger` facet of your own communicator, use a proxy, as
[shown for a remote facet](../using-the-admin-object).

{% /iflang %}

{% iflang langs="swift" %}

Ice for Swift does not expose the built-in `Logger` facet as a local `LoggerAdmin` object. To interact with the `Logger`
facet of your own communicator, use a proxy, as [shown for a remote facet](../using-the-admin-object).

{% /iflang %}

## See Also

- [Logger Facility](../../logger-facility)
- [Using the admin Object](../using-the-admin-object)
