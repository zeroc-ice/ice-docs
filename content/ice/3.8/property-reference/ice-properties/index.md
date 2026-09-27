---
title: Ice.*
---

{% language-section name="lang-1" /%}

# Ice.BackgroundLocatorCacheUpdates

#### Synopsis

`Ice.BackgroundLocatorCacheUpdates=num`

#### Description

If `num` is set to 0 (the default), an invocation on an indirect proxy whose endpoints are older than the configured
[locator cache](../locator-semantics-for-clients) timeout triggers a locator cache update; the run time delays the
invocation until the new endpoints are returned by the locator.

If `num` is set to a value larger than 0, an invocation on an indirect proxy with expired endpoints still triggers a
locator cache update, but the update is performed in the background, and the run time uses the expired endpoints for the
invocation. This avoids delaying the first invocation that follows expiry of a cache entry.

# Ice.BatchAutoFlushSize

#### Synopsis

`Ice.BatchAutoFlushSize=num` (in kilobytes)

#### Description

This property controls how the Ice runtime deals with flushing of [batch messages](../batched-invocations). If `num` is
set to a value greater than 0, the runtime automatically forces a flush of the current batch when a new message is added
to a batch and that message would cause the batch to exceed `num` kilobytes. If `num` is set to 0 or a negative number,
batches must be flushed explicitly by the application. If not defined, the default value is `1024`.

{% callout type="warning" %}

When flushed, batch requests are sent as a single Ice message. The Ice runtime in the receiver limits incoming messages
to the maximum size specified by [Ice.MessageSizeMax](../ice-properties), therefore the sender must periodically flush
batch requests (whether manually or automatically) to ensure they do not exceed the receiver's configured limit.

{% /callout %}

{% language-section name="lang-2" /%}

# Ice.ClassGraphDepthMax

#### Synopsis

`Ice.ClassGraphDepthMax=num`

#### Description

Specifies the maximum depth for a graph of Slice class instances to unmarshal. If this maximum is reached, the Ice
runtime throws a `MarshalException`. Reading and destroying a Slice class graph are recursive operations. This property
prevents stack overflows from occurring if a sender sends a very large graph and not enough space on the stack is
available. To read larger graphs, you can increase the value of this property. If not specified, the default value
is 10.

Setting this property to 0 (or to a negative number) disables the depth limit altogether.

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

# Ice.Compression.Level

#### Synopsis

`Ice.Compression.Level=num`

#### Description

Specifies the bzip2 compression level to use when [compressing protocol messages](../protocol-compression). Legal values
for `num` are `1` to `9`, where `1` represents the fastest compression and `9` represents the best compression. Note
that higher levels cause the bzip2 algorithm to devote more resources to the compression effort, and may not result in a
significant improvement over lower levels. If not specified, the default value is `1`.

# Ice.Config

#### Synopsis

```
Ice.Config=config_file[,config_file,...]
Ice.Config=1
```

#### Description

This property must be set from the command line with one of the options `--Ice.Config`, `--Ice.Config=1`, or
`--Ice.Config=config_file`.

If the `Ice.Config` property is empty or set to 1, or not set at all, the Ice runtime examines the contents of the
[ICE_CONFIG](../using-configuration-files) environment variable to retrieve the path names of one or more configuration
files. Otherwise, `Ice.Config` must be set to the path names of one or more configuration files, separated by commas
(path names can be relative or absolute). Property values are read from each of the configuration files listed.

Configuration files use a simple [syntax](../configuration-file-syntax) consisting of _name_=_value_ pairs with support
for comments and escaping.

{% /iflang %}

{% language-section name="lang-3" /%}

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

{% iflang langs="cpp" %}

# Ice.EventLog.Source

#### Synopsis

`Ice.EventLog.Source=name` (Windows only)

#### Description

Specifies the name of an event log source to be used by a Windows service that subclasses
[Ice::Service](https://code.zeroc.com/manual/Ice/Service). The value of `name` represents a subkey of the `Eventlog`
registry key. An application (or administrator) typically prepares the registry key when the service is installed. If no
matching registry key is found, Windows logs events in the `Application` log. Any backslashes in `name` are silently
converted to forward slashes. If not defined, `Ice::Service` uses the service name as specified by the `--service`
option.

{% /iflang %}

# Ice.HTTPProxyHost

#### Synopsis

`Ice.HTTPProxyHost=addr`

#### Description

Specifies the host name or IP address of an HTTP proxy server. If `addr` is not empty, Ice uses the designated HTTP
proxy server for all outgoing (client) connections.

# Ice.HTTPProxyPort

#### Synopsis

`Ice.HTTPProxyPort=num`

#### Description

The port number of the HTTP proxy server. If not specified, the default value is `1080`.

{% /iflang %}

{% language-section name="lang-4" /%}

# Ice.ImplicitContext

#### Synopsis

`Ice.ImplicitContext=type`

#### Description

Specifies whether a communicator has an [implicit request context](../implicit-request-contexts) and, if so, at what
scope the context applies. Legal values for this property are `None` (equivalent to the empty string), `PerThread`, and
`Shared`. If not specified, the default value is `None`.

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

# Ice.InitPlugins

#### Synopsis

`Ice.InitPlugins=num`

#### Description

{% iflang langs="cpp" %}

If `num` is a value greater than zero, the Ice runtime automatically initializes the plug-ins it has loaded. The order
in which plug-ins are loaded and initialized is determined by Ice.PluginLoadOrder. An application may need to set this
property to zero in order to interact directly with a plug-in after it has been loaded but before it is initialized. In
this case, the application must invoke `initializePlugins` on the plug-in manager to complete the initialization
process. If not defined, the default value is 1.

{% /iflang %}

{% iflang langs="python,ruby,php,matlab,swift" %}

If `num` is greater than zero, Ice initializes the plug-ins it loads during communicator initialization. The default
value is 1. Setting this property to 0 leaves the plug-ins loaded but uninitialized.

{% iflang langs="swift" %}

After setting this property to 0, call `Communicator.initializePlugins()` to initialize the loaded plug-ins.

{% /iflang %}

{% /iflang %}

# Ice.IPv4

#### Synopsis

`Ice.IPv4=num`

#### Description

Specifies whether Ice uses IPv4. If `num` is a value greater than zero, IPv4 is enabled. If not specified, the default
value is 1.

# Ice.IPv6

#### Synopsis

`Ice.IPv6=num`

#### Description

Specifies whether Ice uses IPv6. If `num` is a value greater than zero, IPv6 is enabled. If not specified, the default
value is 1 if the system supports the creation of IPv6 sockets, and 0 otherwise.

{% /iflang %}

{% language-section name="lang-5" /%}

# Ice.LogFile

#### Synopsis

`Ice.LogFile=file`

#### Description

Replaces the communicator's [default logger](../the-default-logger) with a simple file-based logger implementation. This
property does not affect the [per-process logger](../the-per-process-logger). The logger creates the specified file if
necessary, otherwise it appends to the file. If the logger is unable to open the file, the application receives an
`InitializationException` during [communicator initialization](../communicator-initialization-and-destruction). If a
logger object is supplied in the `InitializationData` argument during communicator initialization, it takes precedence
over this property.

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

# Ice.LogFile.SizeMax

#### Synopsis

`Ice.LogFile.SizeMax=num`

#### Description

When `num` is greater than 0, it sets the rotation threshold in bytes for log files configured through `Ice.LogFile`.
Before writing a message that would bring a non-empty log file to or above this threshold, the Ice file-based logger
renames the file to _baselogfilename_-_datetimestamp_._ext_ and creates a new log file. The logger writes each message
in full, even if the message exceeds the threshold.

When `num` is 0 or negative, the logger writes to a single file with unlimited size. The default value is 0.

# Ice.LogStdErr.Convert

#### Synopsis

`Ice.LogStdErr.Convert=num`(Windows)

#### Description

If `num` is set to a value larger than 0, on Windows, the communicator's [default logger](../the-default-logger)
converts log messages from the application's narrow string encoding to the Windows console's code page. The default
value for this property is 1 when Ice.StdErr is not set, and 0 otherwise. This property is read by the first
communicator created in a process; it is ignored by other communicators.

# Ice.MessageSizeMax

#### Synopsis

`Ice.MessageSizeMax=num` (in kilobytes)

#### Description

This property controls the maximum size (in kilobytes) of an uncompressed protocol message that is accepted by a
connection created by this Ice communicator. The size includes the size of the Ice protocol header. The default size is
`1024` (`1` megabyte).

The only purpose of this property is to prevent a malicious or defective sender from triggering a large memory
allocation in a receiver. If this is not a concern, you can set `Ice.MessageSizeMax` to 0; setting this property to 0
(or to a negative number) disables the message size limit altogether.

If the Ice connection receives an incoming message whose size exceeds the receiver's setting for `Ice.MessageSizeMax`,
it throws a `MemoryLimitException` and closes the connection. For example, when a client receives an oversized reply
message, the result of its invocation is a `MemoryLimitException`. When a server receives an oversized request message,
the client receives a `ConnectionLostException` (because the server closed the connection) and the server logs a message
if [Ice.Warn.Connections](../ice-warn-properties) is set.

See also [adapter.MessageSizeMax](../object-adapter-properties).

{% iflang langs="cpp" %}

# Ice.Nohup

#### Synopsis

`Ice.Nohup=num`

#### Description

If `num` is set to a value larger than 0, the `Ice::Service` C++ class ignores `SIGHUP` on Unix and `CTRL_LOGOFF_EVENT`
on Windows. As a result, a server/service that sets `Ice.Nohup` continues to run if the user that started the
server/service logs off. The default value of this property is 1.

IceGrid, IceBox (IceStorm), and Glacier2 are implemented using `Ice::Service`.

{% /iflang %}

# Ice.PluginLoadOrder

#### Synopsis

`Ice.PluginLoadOrder=names`

#### Description

Determines the order in which [plug-ins](../plug-in-facility) are loaded (loaded is a synonym for created in this
context). The Ice runtime loads the plug-ins in the order they appear in `names`, where each plug-in name is separated
by a comma or white space. Any plug-ins not mentioned in `names` are loaded afterward, in an undefined order.

{% iflang langs="cpp" %}

Ice creates plug-ins installed through `InitializationData::pluginFactories` before dynamically loaded plug-ins, in
factory-list order. If `names` includes one of these plug-ins, communicator initialization fails with a
`PluginInitializationException`.

{% /iflang %}

{% iflang langs="python,ruby,php,matlab,swift" %}

The built-in IceDiscovery and IceLocatorDiscovery plug-ins are created before dynamically loaded plug-ins when enabled
through [Ice.Plugin._name_](../ice-plugin-properties). If `names` includes one of these enabled plug-ins, communicator
initialization fails with a `PluginInitializationException`.

{% /iflang %}

# Ice.PreferIPv6Address

#### Synopsis

`Ice.PreferIPv6Address=num`

#### Description

If both IPv4 and IPv6 are enabled (the default), specifies whether Ice prefers IPv6 addresses over IPv4 addresses when
resolving hostnames. If `num` is a value greater than zero, IPv6 addresses are preferred. If not specified, the default
value is 0.

{% iflang langs="cpp,python,swift" %}

# Ice.PrintAdapterReady

#### Synopsis

`Ice.PrintAdapterReady=num`

#### Description

If `num` is set to a value larger than 0, an object adapter prints "_adapter_name_ ready" on standard output after
activation is complete. This is useful for scripts that need to wait until an object adapter is ready to be used.

{% /iflang %}

# Ice.PrintProcessId

#### Synopsis

`Ice.PrintProcessId=num`

#### Description

If `num` is set to a value larger than 0, the process ID is printed on standard output upon startup.

# Ice.PrintStackTraces

#### Synopsis

`Ice.PrintStackTraces=num`

#### Description

{% iflang langs="cpp" %}

If `num` is set to a value larger than 0, [Ice::LocalException](https://code.zeroc.com/manual/Ice/LocalException)
collects the stack trace when a local exception is constructed. When set to 0, `Ice::LocalException` does not collect
stack traces.

If not set, the default value depends on how the Ice C++ library is compiled: 0 for an optimized build and 1 for a debug
build.

The stack trace (if collected) is included in the exception message printed by `ice_print` or `operator<<`. It’s not
included in the `what` message.

On Windows, you need the Ice PDB files to obtain usable stack traces. If you build Ice from sources, the Ice build
system always creates PDB files next to your DLLs and executables, and Windows will locate and use these PDB files.

{% /iflang %}

{% iflang langs="python,ruby,php,matlab,swift" %}

If `num` is greater than 0, Ice enables native stack-trace collection for local exceptions in the C++ runtime. These are
native stack traces, rather than stack traces in the application's language.

The default value is 0 for an optimized C++ runtime and 1 for a debug runtime. On Windows, usable native stack traces
require the Ice PDB files.

{% /iflang %}

{% /iflang %}

{% language-section name="lang-6" /%}

# Ice.ProgramName

#### Synopsis

`Ice.ProgramName=name`

#### Description

`name` is the program name, which is used for logging. This name is
[set automatically](../command-line-parsing-and-initialization) from `argv[0]` (C++) and from
`AppDomain.CurrentDomain.FriendlyName` (C#) during initialization. For Java, `Ice.ProgramName` is initialized to the
empty string. The default name can be overridden by setting this property.

# Ice.RetryIntervals

#### Synopsis

`Ice.RetryIntervals=num [num ...]`

#### Description

This property defines the number of times an operation is [automatically retried](../automatic-retries) and the delay
between each retry. For example, if the property is set to `0 100 500`, the operation is retried 3 times: immediately
after the first failure, again after waiting 100ms after the second failure, and again after waiting 500ms after the
third failure. The default value (`0`) means Ice retries once immediately. If set to `-1`, no retry occurs.

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

{% iflang langs="cpp,python,swift" %}

# Ice.ServerIdleTime

#### Synopsis

`Ice.ServerIdleTime=num`

#### Description

If `num` is set to a value larger than 0, Ice automatically calls `shutdown` on the communicator when its server thread
pool has been idle for `num` seconds. The server thread pool is not idle as long as any of its thread is performing some
task, like dispatching a request.

This call to `shutdown` shuts down the communicator's server side and causes any thread waiting on `waitForShutdown` to
return. After that, a server will typically do some clean-up work before exiting. The default value is 0, meaning that
the server will not shut down automatically. This property is often used for servers that are automatically
[activated by IceGrid](../icegrid-server-activation).

{% callout type="info" %}

On Windows, the server idle time takes effect only once all the server thread pool idle threads have been reaped. The
thread idle time can be configured with the [ThreadIdleTime](../ice-threadpool-properties) thread pool property.

{% /callout %}

{% /iflang %}

{% iflang langs="matlab,swift" %}

# Ice.SliceLoader.NotFoundCacheSize

#### Synopsis

`Ice.SliceLoader.NotFoundCacheSize=num`

#### Description

When `num` is set to a value larger than 0, the communicator installs an internal “not found” cache that caches failed
Slice loader resolutions.

The default value is 100.

See also [Ice.Warn.SliceLoader](../ice-warn-properties).

{% /iflang %}

# Ice.SOCKSProxyHost

#### Synopsis

`Ice.SOCKSProxyHost=addr`

#### Description

Specifies the host name or IP address of a SOCKS proxy server. If `addr` is not empty, Ice uses the designated SOCKS
proxy server for all outgoing (client) connections.

{% callout type="info" %}

Ice currently only supports the SOCKS4 protocol, which means only IPv4 connections are allowed.

{% /callout %}

# Ice.SOCKSProxyPort

#### Synopsis

`Ice.SOCKSProxyPort=num`

#### Description

The port number of the SOCKS proxy server. If not specified, the default value is `1080`.

# Ice.StdErr

#### Synopsis

`Ice.StdErr=filename`

#### Description

If `filename` is not empty, the standard error stream of this process is redirected to this file, in append mode. This
property is checked only for the first communicator that is created in a process.

# Ice.StdOut

#### Synopsis

`Ice.StdOut=filename`

#### Description

If `filename` is not empty, the standard output stream of this process is redirected to this file, in append mode. This
property is checked only for the first communicator created in a process.

# Ice.SyslogFacility

#### Synopsis

`Ice.SyslogFacility=string` (Unix only, except iOS)

#### Description

This property sets the syslog facility to `string`. This property has no effect if `Ice.UseSyslog` is not set. Each
communicator can use its own facility, even when several communicators in the same process log to `syslog`.

`string` can be any of syslog facilities:
`LOG_AUTH, LOG_AUTHPRIV, LOG_CRON, LOG_DAEMON, LOG_FTP, LOG_KERN, LOG_LOCAL0, LOG_LOCAL1, LOG_LOCAL2, LOG_LOCAL3, LOG_LOCAL4, LOG_LOCAL5, LOG_LOCAL6, LOG_LOCAL7, LOG_LPR, LOG_MAIL, LOG_NEWS, LOG_SYSLOG, LOG_USER, LOG_UUCP`.

The default value is `LOG_USER`.

{% /iflang %}

{% language-section name="lang-7" /%}

# Ice.ToStringMode

#### Synopsis

`Ice.ToStringMode=string`

#### Description

`string` must be one of the following: `Unicode`, `ASCII`, `Compat`.

This property maps to an enumerator of [ToStringMode](https://code.zeroc.com/manual/Ice/ToStringMode) and controls how
`identityToString` and `proxyToString` on the communicator escape non-printable ASCII characters and non-ASCII
characters.

The default value is `Unicode`.

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

# Ice.UseOSLog

#### Synopsis

`Ice.UseOSLog=num` (macOS and iOS)

#### Description

If `num` is set to a value larger than 0, a special [logger](../logger-facility) is installed that logs using
[OSLog](https://developer.apple.com/documentation/os/oslog).

# Ice.UseSyslog

#### Synopsis

`Ice.UseSyslog=num` (Unix only, except iOS)

#### Description

If `num` is set to a value larger than 0, a special [logger](../logger-facility) is installed that logs to the `syslog`
service instead of standard error. Use [Ice.SyslogFacility](../ice-properties#ice.syslogfacility) to select a `syslog`
facility.

The connection to the `syslog` service is process-global: all syslog loggers in a process share a single connection,
opened when the first syslog logger is created and closed when the last one is destroyed. As a result:

- The `syslog` identifier is the `Ice.ProgramName` of the communicator that creates the first syslog logger in the
  process. It remains in effect until all syslog loggers in this process are destroyed.
- A syslog logger with a different program name prepends this program name to each message it logs. For example, an
  IceBox server configured with `Ice.UseSyslog=1` and `IceBox.InheritProperties=1` logs its own messages under the
  identifier `icebox`, and the messages of each of its services with the prefix `icebox-<service name>:` followed by a
  space.
- `Ice.SyslogFacility` remains per-communicator: each message is logged with the facility configured for the
  communicator that produced it.

# Ice.UseSystemdJournal

#### Synopsis

`Ice.UseSystemdJournal=num` (Linux only)

#### Description

If `num` is set to a value larger than 0, a special [logger](../logger-facility) is installed that logs to the systemd
journal instead of standard error. Journal entries are tagged with the value of `Ice.ProgramName` as their syslog
identifier (the `SYSLOG_IDENTIFIER` journal field), so you can filter them with `journalctl -t name`.

{% /iflang %}

{% language-section name="lang-8" /%}
