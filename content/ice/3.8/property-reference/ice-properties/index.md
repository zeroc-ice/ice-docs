---
title: Ice.*
---

{% language-section name="lang-1" /%}

## Ice.BackgroundLocatorCacheUpdates

### Synopsis {% id="ice.backgroundlocatorcacheupdates-synopsis" %}

`Ice.BackgroundLocatorCacheUpdates=num`

### Description {% id="ice.backgroundlocatorcacheupdates-description" %}

If `num` is set to 0 (the default), an invocation on an indirect proxy whose endpoints are older than the configured
[locator cache](../../runtime/locators/locator-semantics-for-clients) timeout triggers a locator cache update; the run
time delays the invocation until the new endpoints are returned by the locator.

If `num` is set to a value larger than 0, an invocation on an indirect proxy with expired endpoints still triggers a
locator cache update, but the update is performed in the background, and the run time uses the expired endpoints for the
invocation. This avoids delaying the first invocation that follows expiry of a cache entry.

## Ice.BatchAutoFlushSize

### Synopsis {% id="ice.batchautoflushsize-synopsis" %}

`Ice.BatchAutoFlushSize=num` (in KiB)

### Description {% id="ice.batchautoflushsize-description" %}

This property controls how the Ice runtime deals with flushing of
[batch messages](../../runtime/invocation/invocation-mode/batched-invocations). If `num` is greater than `0`, the
runtime automatically forces a flush of the current batch when a new message is added to a batch and that message would
cause the batch to reach or exceed `num` KiB (1024 bytes per KiB). For stream transports, `0` disables automatic
flushing: the application must flush batches explicitly. If not defined, the default value is `1024`.

{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %}

For datagram proxies, Ice caps the flush threshold at [Ice.UDP.SndSize](../ice-udp-properties) bytes, or 65507 bytes
when that property is not set, including when `num` is `0`.

{% /iflang %}

{% callout type="warning" %}

When flushed, batch requests are sent as a single Ice message. The Ice runtime in the receiver limits incoming messages
to the maximum size specified by [Ice.MessageSizeMax](./), therefore the sender must periodically flush batch requests
(whether manually or automatically) to ensure they do not exceed the receiver's configured limit.

{% /callout %}

{% language-section name="lang-2" /%}

## Ice.ClassGraphDepthMax

### Synopsis {% id="ice.classgraphdepthmax-synopsis" %}

`Ice.ClassGraphDepthMax=num`

### Description {% id="ice.classgraphdepthmax-description" %}

Specifies the maximum depth for a graph of Slice class instances to unmarshal. If this maximum is reached, the Ice
runtime throws a `MarshalException`. Reading and destroying a Slice class graph are recursive operations. This property
prevents stack overflows from occurring if a sender sends a very large graph and not enough space on the stack is
available. To read larger graphs, you can increase the value of this property. If not specified, the default value
is 10.

Setting this property to 0 (or to a negative number) disables the depth limit altogether.

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

## Ice.Compression.Level

### Synopsis {% id="ice.compression.level-synopsis" %}

`Ice.Compression.Level=num`

### Description {% id="ice.compression.level-description" %}

Specifies the bzip2 compression level to use when [compressing protocol messages](../../protocol/protocol-compression).
Values range from `1` to `9`, where `1` represents the fastest compression and `9` represents the best compression. Note
that higher levels cause the bzip2 algorithm to devote more resources to the compression effort, and may not result in a
significant improvement over lower levels. If not specified, the default value is `1`.

## Ice.Config

### Synopsis {% id="ice.config-synopsis" %}

```config
Ice.Config=config_file[,config_file,...]
Ice.Config=1
```

### Description {% id="ice.config-description" %}

This property must be set from the command line with one of the options `--Ice.Config`, `--Ice.Config=1`, or
`--Ice.Config=config_file`.

If the `Ice.Config` property is empty or set to 1, or not set at all, the Ice runtime examines the contents of the
[ICE_CONFIG](../../runtime/properties-and-configuration/using-configuration-files) environment variable to retrieve the
path names of one or more configuration files. Otherwise, `Ice.Config` must be set to the path names of one or more
configuration files, separated by commas (path names can be relative or absolute). Property values are read from each of
the configuration files listed.

Configuration files use a simple [syntax](../../runtime/properties-and-configuration/configuration-file-syntax)
consisting of _name_=_value_ pairs with support for comments and escaping.

{% /iflang %}

{% language-section name="lang-3" /%}

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

{% iflang langs="cpp" %}

## Ice.EventLog.Source

### Synopsis {% id="ice.eventlog.source-synopsis" %}

`Ice.EventLog.Source=name` (Windows only)

### Description {% id="ice.eventlog.source-description" %}

Specifies the name of an event log source to be used by a Windows service that subclasses
[Ice::Service](api:Ice/Service). The value of `name` represents a subkey of the `Eventlog` registry key. An application
(or administrator) typically prepares the registry key when the service is installed. If no matching registry key is
found, Windows logs events in the `Application` log. Any backslashes in `name` are silently converted to forward
slashes. If not defined, `Ice::Service` uses the service name as specified by the `--service` option.

{% /iflang %}

## Ice.HTTPProxyHost

### Synopsis {% id="ice.httpproxyhost-synopsis" %}

`Ice.HTTPProxyHost=addr`

### Description {% id="ice.httpproxyhost-description" %}

Specifies the host name or IP address of an HTTP proxy server. If `addr` is not empty, Ice uses the designated HTTP
proxy server for all outgoing (client) connections.

## Ice.HTTPProxyPort

### Synopsis {% id="ice.httpproxyport-synopsis" %}

`Ice.HTTPProxyPort=num`

### Description {% id="ice.httpproxyport-description" %}

The port number of the HTTP proxy server. If not specified, the default value is `1080`.

{% /iflang %}

{% language-section name="lang-4" /%}

## Ice.ImplicitContext

### Synopsis {% id="ice.implicitcontext-synopsis" %}

`Ice.ImplicitContext=type`

### Description {% id="ice.implicitcontext-description" %}

Specifies whether a communicator has an
[implicit request context](../../runtime/invocation/request-contexts/implicit-request-contexts) and, if so, at what
scope the context applies. Legal values for this property are `None` (equivalent to the empty string), `PerThread`, and
`Shared`. If not specified, the default value is `None`.

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

## Ice.InitPlugins

### Synopsis {% id="ice.initplugins-synopsis" %}

`Ice.InitPlugins=num`

### Description {% id="ice.initplugins-description" %}

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

## Ice.IPv4

### Synopsis {% id="ice.ipv4-synopsis" %}

`Ice.IPv4=num`

### Description {% id="ice.ipv4-description" %}

Specifies whether Ice uses IPv4. If `num` is a value greater than zero, IPv4 is enabled. If not specified, the default
value is 1.

## Ice.IPv6

### Synopsis {% id="ice.ipv6-synopsis" %}

`Ice.IPv6=num`

### Description {% id="ice.ipv6-description" %}

Specifies whether Ice uses IPv6. If `num` is a value greater than zero, IPv6 is enabled. If not specified, the default
value is 1 if the system supports the creation of IPv6 sockets, and 0 otherwise.

{% /iflang %}

{% language-section name="lang-5" /%}

## Ice.LogFile

### Synopsis {% id="ice.logfile-synopsis" %}

`Ice.LogFile=file`

### Description {% id="ice.logfile-description" %}

Selects a file-based [logger](../../administration/logger-facility/default-logger) for the communicator. The logger
appends messages to the specified file and creates the file if necessary. A logger supplied in `InitializationData`
takes precedence over this property. The [per-process logger](../../administration/logger-facility/per-process-logger)
is unchanged.

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

Among the logging backends available on the platform, Ice checks `Ice.UseSyslog`, `Ice.UseOSLog`,
`Ice.UseSystemdJournal` and `Ice.LogFile` in that order. `Ice.UseSyslog` and `Ice.LogFile` cannot be combined. An
enabled OSLog or systemd logger takes precedence over the file logger.

{% /iflang %}

{% iflang langs="java" %}

On platforms other than Windows, `Ice.UseSyslog` and `Ice.LogFile` cannot be combined.

{% /iflang %}

{% iflang langs="js" %}

Browsers do not support this property.

{% /iflang %}

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

## Ice.LogFile.SizeMax

### Synopsis {% id="ice.logfile.sizemax-synopsis" %}

`Ice.LogFile.SizeMax=num`

### Description {% id="ice.logfile.sizemax-description" %}

When `num` is greater than 0, it sets the rotation threshold in bytes for log files configured through `Ice.LogFile`.
Before writing a message that would bring a non-empty log file to or above this threshold, the Ice file-based logger
renames the file to `basename-YYYYMMDD-HHMMSS.ext` and creates a new log file. The logger writes each message in full,
even if the message exceeds the threshold.

When `num` is 0 or negative, the logger writes to a single file with unlimited size. The default value is 0.

## Ice.LogStdErr.Convert

### Synopsis {% id="ice.logstderr.convert-synopsis" %}

`Ice.LogStdErr.Convert=num`(Windows)

### Description {% id="ice.logstderr.convert-description" %}

If `num` is set to a value larger than 0, on Windows, the communicator's
[default logger](../../administration/logger-facility/default-logger) converts log messages from the application's
narrow string encoding to the Windows console's code page. The default value for this property is 1 when Ice.StdErr is
not set, and 0 otherwise. This property is read by the first communicator created in a process; it is ignored by other
communicators.

{% /iflang %}

## Ice.MessageSizeMax

### Synopsis {% id="ice.messagesizemax-synopsis" %}

`Ice.MessageSizeMax=num` (in KiB)

### Description {% id="ice.messagesizemax-description" %}

Sets the maximum size of an incoming Ice protocol message, in KiB (1024 bytes). The limit applies to the whole message,
including the protocol header; for a compressed message, it also applies to the decompressed size. The default value is
`1024` (1 MiB).

A positive value must be at most 2,097,151 KiB (about 2 GiB). `0` selects the largest supported size, 2,147,483,647
bytes.

Ice rejects an incoming message that exceeds this limit and logs a warning when
[Ice.Warn.Connections](../ice-warn-properties) is set. Over connection-oriented transports, Ice also closes the
connection: a client receiving an oversized reply gets a `MarshalException` from its invocation, and a client whose
request is oversized gets a `ConnectionLostException`.

{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %}

See also [adapter.MessageSizeMax](../object-adapter-properties).

{% /iflang %}

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

{% iflang langs="cpp" %}

## Ice.Nohup

### Synopsis {% id="ice.nohup-synopsis" %}

`Ice.Nohup=num`

### Description {% id="ice.nohup-description" %}

If `num` is set to a value larger than 0, the `Ice::Service` C++ class ignores `SIGHUP` on Unix and `CTRL_LOGOFF_EVENT`
on Windows. As a result, a server/service that sets `Ice.Nohup` continues to run if the user that started the
server/service logs off. The default value of this property is 1.

IceGrid, IceBox (IceStorm), and Glacier2 are implemented using `Ice::Service`.

{% /iflang %}

## Ice.PluginLoadOrder

### Synopsis {% id="ice.pluginloadorder-synopsis" %}

`Ice.PluginLoadOrder=names`

### Description {% id="ice.pluginloadorder-description" %}

Determines the order in which [plug-ins](../../plugins/plug-in-facility) are loaded (loaded is a synonym for created in
this context). The Ice runtime loads the plug-ins in the order they appear in `names`, where each plug-in name is
separated by a comma or white space. Any plug-ins not mentioned in `names` are loaded afterward, in an undefined order.

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

## Ice.PreferIPv6Address

### Synopsis {% id="ice.preferipv6address-synopsis" %}

`Ice.PreferIPv6Address=num`

### Description {% id="ice.preferipv6address-description" %}

If both IPv4 and IPv6 are enabled (the default), specifies whether Ice prefers IPv6 addresses over IPv4 addresses when
resolving hostnames. If `num` is a value greater than zero, IPv6 addresses are preferred. If not specified, the default
value is 0.

{% iflang langs="cpp,python,swift" %}

## Ice.PrintAdapterReady

### Synopsis {% id="ice.printadapterready-synopsis" %}

`Ice.PrintAdapterReady=num`

### Description {% id="ice.printadapterready-description" %}

If `num` is set to a value larger than 0, an object adapter prints "_adapter_name_ ready" on standard output after
activation is complete. This is useful for scripts that need to wait until an object adapter is ready to be used.

{% /iflang %}

## Ice.PrintProcessId

### Synopsis {% id="ice.printprocessid-synopsis" %}

`Ice.PrintProcessId=num`

### Description {% id="ice.printprocessid-description" %}

If `num` is set to a value larger than 0, the process ID is printed on standard output upon startup.

## Ice.PrintStackTraces

### Synopsis {% id="ice.printstacktraces-synopsis" %}

`Ice.PrintStackTraces=num`

### Description {% id="ice.printstacktraces-description" %}

{% iflang langs="cpp" %}

If `num` is set to a value larger than 0, [Ice::LocalException](api:Ice/LocalException) collects the stack trace when a
local exception is constructed. When set to 0, `Ice::LocalException` does not collect stack traces.

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

## Ice.ProgramName

### Synopsis {% id="ice.programname-synopsis" %}

`Ice.ProgramName=name`

### Description {% id="ice.programname-description" %}

Specifies the program name used for logging. If this property is empty, communicator initialization selects the
following default:

| Language            | Default                                                                                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C++                 | `argv[0]` when you create the communicator with `Ice::initialize(argc, argv)`; otherwise the executable's base name on Linux, macOS, and Windows, and an empty string on other platforms. |
| MATLAB              | The executable's base name.                                                                                                                                                               |
| C#                  | `AppDomain.CurrentDomain.FriendlyName`.                                                                                                                                                   |
| Java and JavaScript | An empty string.                                                                                                                                                                          |
| Python              | The base name of `sys.argv[0]`, when available.                                                                                                                                           |
| Ruby                | The base name of `$0`.                                                                                                                                                                    |
| PHP                 | The base name of `$_SERVER['SCRIPT_FILENAME']`, when available.                                                                                                                           |
| Swift               | The last path component of `CommandLine.arguments.first`, when available.                                                                                                                 |

For mappings based on the C++ runtime, an empty language-specific default falls back to the executable's base name on
Linux, macOS and Windows. Setting this property to a non-empty value overrides the default.

In C# and Java, Ice also uses this value as a prefix for runtime thread names.

## Ice.RetryIntervals

### Synopsis {% id="ice.retryintervals-synopsis" %}

`Ice.RetryIntervals=num [num ...]`

### Description {% id="ice.retryintervals-description" %}

This property defines the number of times an operation is
[automatically retried](../../runtime/invocation/automatic-retries) and the delay between each retry. For example, if
the property is set to `0 100 500`, the operation is retried 3 times: immediately after the first failure, again after
waiting 100ms after the second failure, and again after waiting 500ms after the third failure. The default value (`0`)
means Ice retries once immediately. A first value of `-1` disables retries.

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

{% iflang langs="cpp,python,swift" %}

## Ice.ServerIdleTime

### Synopsis {% id="ice.serveridletime-synopsis" %}

`Ice.ServerIdleTime=num`

### Description {% id="ice.serveridletime-description" %}

If `num` is set to a value larger than 0, Ice automatically calls `shutdown` on the communicator when its server thread
pool has been idle for `num` seconds. The server thread pool is not idle as long as any of its thread is performing some
task, like dispatching a request.

This call to `shutdown` shuts down the communicator's server side and causes any thread waiting on `waitForShutdown` to
return. After that, a server will typically do some clean-up work before exiting. The default value is 0, meaning that
the server will not shut down automatically. This property is often used for servers that are automatically
[activated by IceGrid](../../services/icegrid/icegrid-server-activation).

{% callout type="info" %}

On Windows, the server idle time takes effect only once all the server thread pool idle threads have been reaped. The
thread idle time can be configured with the [ThreadIdleTime](../ice-threadpool-properties) thread pool property.

{% /callout %}

{% /iflang %}

{% iflang langs="matlab,swift" %}

## Ice.SliceLoader.NotFoundCacheSize

### Synopsis {% id="ice.sliceloader.notfoundcachesize-synopsis" %}

`Ice.SliceLoader.NotFoundCacheSize=num`

### Description {% id="ice.sliceloader.notfoundcachesize-description" %}

When `num` is set to a value larger than 0, the communicator installs an internal “not found” cache that caches failed
Slice loader resolutions.

The default value is 100.

See also [Ice.Warn.SliceLoader](../ice-warn-properties).

{% /iflang %}

## Ice.SOCKSProxyHost

### Synopsis {% id="ice.socksproxyhost-synopsis" %}

`Ice.SOCKSProxyHost=addr`

### Description {% id="ice.socksproxyhost-description" %}

Specifies the host name or IP address of a SOCKS proxy server. If `addr` is not empty, Ice uses the designated SOCKS
proxy server for all outgoing (client) connections.

{% callout type="info" %}

Ice supports the SOCKS4 protocol, which requires IPv4. If both `Ice.SOCKSProxyHost` and `Ice.HTTPProxyHost` are set, Ice
uses the SOCKS proxy.

{% /callout %}

SOCKS proxies are not supported on the iOS simulator.

## Ice.SOCKSProxyPort

### Synopsis {% id="ice.socksproxyport-synopsis" %}

`Ice.SOCKSProxyPort=num`

### Description {% id="ice.socksproxyport-description" %}

The port number of the SOCKS proxy server. If not specified, the default value is `1080`.

## Ice.StdErr

### Synopsis {% id="ice.stderr-synopsis" %}

`Ice.StdErr=filename`

### Description {% id="ice.stderr-description" %}

If `filename` is not empty, the standard error stream of this process is redirected to this file, in append mode. This
property is checked only for the first communicator that is created in a process.

## Ice.StdOut

### Synopsis {% id="ice.stdout-synopsis" %}

`Ice.StdOut=filename`

### Description {% id="ice.stdout-description" %}

If `filename` is not empty, the standard output stream of this process is redirected to this file, in append mode. This
property is checked only for the first communicator created in a process.

## Ice.SyslogFacility

### Synopsis {% id="ice.syslogfacility-synopsis" %}

`Ice.SyslogFacility=string` (Unix only, except iOS)

### Description {% id="ice.syslogfacility-description" %}

This property sets the syslog facility to `string`. This property has no effect if `Ice.UseSyslog` is not set. Each
communicator can use its own facility, even when several communicators in the same process log to `syslog`.

`string` can be any of syslog facilities:
`LOG_AUTH, LOG_AUTHPRIV, LOG_CRON, LOG_DAEMON, LOG_FTP, LOG_KERN, LOG_LOCAL0, LOG_LOCAL1, LOG_LOCAL2, LOG_LOCAL3, LOG_LOCAL4, LOG_LOCAL5, LOG_LOCAL6, LOG_LOCAL7, LOG_LPR, LOG_MAIL, LOG_NEWS, LOG_SYSLOG, LOG_USER, LOG_UUCP`.

The default value is `LOG_USER`.

{% /iflang %}

{% language-section name="lang-7" /%}

## Ice.ToStringMode

### Synopsis {% id="ice.tostringmode-synopsis" %}

`Ice.ToStringMode=string`

### Description {% id="ice.tostringmode-description" %}

`string` must be one of the following: `Unicode`, `ASCII`, `Compat`.

This property maps to an enumerator of [ToStringMode](api:Ice/ToStringMode) and controls how `identityToString` and
`proxyToString` on the communicator escape non-printable ASCII characters and non-ASCII characters.

The default value is `Unicode`.

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

## Ice.UseOSLog

### Synopsis {% id="ice.useoslog-synopsis" %}

`Ice.UseOSLog=num` (Apple platforms)

### Description {% id="ice.useoslog-description" %}

If `num` is set to a value larger than 0, a special [logger](../../administration/logger-facility) is installed that
logs using [OSLog](https://developer.apple.com/documentation/os/oslog). The subsystem is `com.zeroc.ice` when
`Ice.ProgramName` is empty, or `com.zeroc.ice.<ProgramName>` otherwise.

## Ice.UseSyslog

### Synopsis {% id="ice.usesyslog-synopsis" %}

`Ice.UseSyslog=num` (Unix only, except iOS)

### Description {% id="ice.usesyslog-description" %}

If `num` is set to a value larger than 0, a special [logger](../../administration/logger-facility) is installed that
logs to the `syslog` service instead of standard error. Use [Ice.SyslogFacility](#ice.syslogfacility) to select a
`syslog` facility.

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

## Ice.UseSystemdJournal

### Synopsis {% id="ice.usesystemdjournal-synopsis" %}

`Ice.UseSystemdJournal=num` (Linux only)

### Description {% id="ice.usesystemdjournal-description" %}

If `num` is set to a value larger than 0, a special [logger](../../administration/logger-facility) is installed that
logs to the systemd journal instead of standard error. Journal entries are tagged with the value of `Ice.ProgramName` as
their syslog identifier (the `SYSLOG_IDENTIFIER` journal field), so you can filter them with `journalctl -t name`.

This property takes effect only when Ice was built with systemd support.

{% /iflang %}

{% language-section name="lang-8" /%}
