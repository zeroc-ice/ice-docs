---
id: ice-properties
language: cpp
---

{% language-section name="lang-1" %}

# Ice.AcceptClassCycles

#### Synopsis

`Ice.AcceptClassCycles=num`

#### Description

If `num` is set to 0 (the default), the unmarshaling of class cycles is disallowed. A `MarshalException` is thrown when a cycle is detected during unmarshaling.

If `num` is set to a value larger than 0, class cycles are unmarshaled. You must break any cycles programmatically in your own code to prevent memory leaks.
{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}

{% language-section name="lang-3" %}

# Ice.Compression.Level

#### Synopsis

`Ice.Compression.Level=num`

#### Description

Specifies the bzip2 compression level to use when [compressing protocol messages](../protocol-compression). Legal values for `num` are `1` to `9`, where `1` represents the fastest compression and `9` represents the best compression. Note that higher levels cause the bzip2 algorithm to devote more resources to the compression effort, and may not result in a significant improvement over lower levels. If not specified, the default value is `1`.

# Ice.ConfigIce.Config

#### Synopsis

```
Ice.Config=config_file[,config_file,...]
Ice.Config=1
```

#### Description

This property must be set from the command line with one of the options `--Ice.Config`, `--Ice.Config=1`, or `--Ice.Config=config_file`.

If the `Ice.Config` property is empty or set to 1, or not set at all, the Ice runtime examines the contents of the [ICE_CONFIG](../using-configuration-files) environment variable to retrieve the path names of one or more configuration files. Otherwise, `Ice.Config` must be set to the path names of one or more configuration files, separated by commas (path names can be relative or absolute). Property values are read from each of the configuration files listed.

In Java, Ice first attempts to open a configuration file as a [class loader resource](../alternate-property-stores). If that attempt fails, Ice opens the configuration file in the local file system.

Configuration files use a simple [syntax](../configuration-file-syntax) consisting of *name*=*value* pairs with support for comments and escaping.
{% /language-section %}

{% language-section name="lang-4" %}

# Ice.EventLog.Source

#### Synopsis

`Ice.EventLog.Source=name` (Windows only)

#### Description

Specifies the name of an event log source to be used by a Windows service that subclasses [Ice::Service](https://code.zeroc.com/manual/Ice/Service). The value of `name` represents a subkey of the `Eventlog` registry key. An application (or administrator) typically prepares the registry key when the service is installed. If no matching registry key is found, Windows logs events in the `Application` log. Any backslashes in `name` are silently converted to forward slashes. If not defined, `Ice::Service` uses the service name as specified by the `--service` option.

# Ice.HTTPProxyHost

#### Synopsis

`Ice.HTTPProxyHost=addr`

#### Description

Specifies the host name or IP address of an HTTP proxy server. If `addr` is not empty, Ice uses the designated HTTP proxy server for all outgoing (client) connections.

# Ice.HTTPProxyPort

#### Synopsis

`Ice.HTTPProxyPort=num`

#### Description

The port number of the HTTP proxy server. If not specified, the default value is `1080`.
{% /language-section %}

{% language-section name="lang-5" %}

# Ice.InitPlugins

#### Synopsis

`Ice.InitPlugins=num`

#### Description

If `num` is a value greater than zero, the Ice runtime automatically initializes the plug-ins it has loaded. The order in which plug-ins are loaded and initialized is determined by Ice.PluginLoadOrder. An application may need to set this property to zero in order to interact directly with a plug-in after it has been loaded but before it is initialized. In this case, the application must invoke `initializePlugins` on the plug-in manager to complete the initialization process. If not defined, the default value is 1.

# Ice.IPv4Ice.IPv4

#### Synopsis

`Ice.IPv4=num`

#### Description

Specifies whether Ice uses IPv4. If `num` is a value greater than zero, IPv4 is enabled. If not specified, the default value is 1.

# Ice.IPv6Ice.IPv6

#### Synopsis

`Ice.IPv6=num`

#### Description

Specifies whether Ice uses IPv6. If `num` is a value greater than zero, IPv6 is enabled. If not specified, the default value is 1 if the system supports the creation of IPv6 sockets, and 0 otherwise.

Java's default network stack always accepts both IPv4 and IPv6 connections regardless of the settings of `Ice.IPv6`. You can configure the Java runtime to use only IPv4 by starting your application with the following JVM option:

```shell
java -Djava.net.preferIPv4Stack=true ...
```

{% /language-section %}

{% language-section name="lang-6" %}

# Ice.LogFile.SizeMax

#### Synopsis

`Ice.LogFile.SizeMax=num`

#### Description

*num* is a positive integer that represents the maximum size of log files configured through `Ice.LogFile`, in bytes. When a log file's size reaches *num*, the Ice file-based logger renames this log file to *baselogfilename*-*datetimestamp*.*ext*and creates a new log file. The default value for *num* is 0, which means that the log file's size is unlimited. In this case, the Ice file-based logger opens and writes to a single log file.

# Ice.LogStdErr.Convert

#### Synopsis

`Ice.LogStdErr.Convert=num`(Windows)

#### Description

If `num` is set to a value larger than 0, on Windows, the communicator's [default logger](../the-default-logger) converts log messages from the application's narrow string encoding to the Windows console's code page. The default value for this property is 1 when Ice.StdErr is not set, and 0 otherwise. This property is read by the first communicator created in a process; it is ignored by other communicators.

# Ice.MessageSizeMaxIce.MessageSizeMax

#### Synopsis

`Ice.MessageSizeMax=num` (in kilobytes)

#### Description

This property controls the maximum size (in kilobytes) of an uncompressed protocol message that is accepted by a connection created by this Ice communicator. The size includes the size of the Ice protocol header. The default size is `1024` (`1` megabyte).

The only purpose of this property is to prevent a malicious or defective sender from triggering a large memory allocation in a receiver. If this is not a concern, you can set `Ice.MessageSizeMax` to 0; setting this property to 0 (or to a negative number) disables the message size limit altogether.

If the Ice connection receives an incoming message whose size exceeds the receiver's setting for `Ice.MessageSizeMax`, it throws a `MemoryLimitException` and closes the connection. For example, when a client receives an oversized reply message, the result of its invocation is a `MemoryLimitException`. When a server receives an oversized request message, the client receives a `ConnectionLostException` (because the server closed the connection) and the server logs a message if [Ice.Warn.Connections](../ice-warn-properties) is set.

See also [adapter.MessageSizeMax](../object-adapter-properties).

# Ice.Nohup

#### Synopsis

`Ice.Nohup=num`

#### Description

If `num` is set to a value larger than 0, the `Ice::Service` C++ class ignores `SIGHUP` on Unix and `CTRL_LOGOFF_EVENT` on Windows. As a result, a server/service that sets `Ice.Nohup` continues to run if the user that started the server/service logs off. The default value of this property is 1.

IceGrid, IceBox (IceStorm), and Glacier2 are implemented using `Ice::Service`.

# Ice.PluginLoadOrderIce.PluginLoadOrder

#### Synopsis

`Ice.PluginLoadOrder=names`

#### Description

Determines the order in which [plug-ins](../plug-in-facility) are loaded (loaded is a synonym for created in this context). The Ice runtime loads the plug-ins in the order they appear in `names`, where each plug-in name is separated by a comma or white space. Any plug-ins not mentioned in `names` are loaded afterward, in an undefined order.

Plug-ins installed using `InitializationData::pluginFactories` are always created before all other plug-ins. They are not affected by this property.

# Ice.PreferIPv6AddressIce.PreferIPv6Address

#### Synopsis

`Ice.PreferIPv6Address=num`

#### Description

If both IPv4 and IPv6 are enabled (the default), specifies whether Ice prefers IPv6 addresses over IPv4 addresses when resolving hostnames. If `num` is a value greater than zero, IPv6 addresses are preferred. If not specified, the default value is 0.

# Ice.PrintAdapterReady

#### Synopsis

`Ice.PrintAdapterReady=num`

#### Description

If `num` is set to a value larger than 0, an object adapter prints "*adapter_name* ready" on standard output after activation is complete. This is useful for scripts that need to wait until an object adapter is ready to be used.

# Ice.PrintProcessId

#### Synopsis

`Ice.PrintProcessId=num`

#### Description

If `num` is set to a value larger than 0, the process ID is printed on standard output upon startup.

# Ice.PrintStackTraces

#### Synopsis

`Ice.PrintStackTraces=num`

#### Description

If `num` is set to a value larger than 0, [Ice::LocalException](https://code.zeroc.com/manual/Ice/LocalException) collects the stack trace when a local exception is constructed. When set to 0, `Ice::LocalException` does not collect stack traces.

If not set, the default value depends on how the Ice C++ library is compiled: 0 for an optimized build and 1 for a debug build.

The stack trace (if collected) is included in the exception message printed by `ice_print` or `operator<<`. It’s not included in the `what` message.

On Windows, you need the Ice PDB files to obtain usable stack traces. If you build Ice from sources, the Ice build system always creates PDB files next to your DLLs and executables, and Windows will locate and use these PDB files.
{% /language-section %}

{% language-section name="lang-7" %}

# Ice.ServerIdleTime

#### Synopsis

`Ice.ServerIdleTime=num`

#### Description

If `num` is set to a value larger than 0, Ice automatically calls `shutdown` on the communicator when its server thread pool has been idle for `num` seconds. The server thread pool is not idle as long as any of its thread is performing some task, like dispatching a request.

This call to `shutdown` shuts down the communicator's server side and causes any thread waiting on `waitForShutdown` to return. After that, a server will typically do some clean-up work before exiting. The default value is 0, meaning that the server will not shut down automatically. This property is often used for servers that are automatically [activated by IceGrid](../icegrid-server-activation).

{% callout type="info" %}
For C# applications and Windows C++ applications, the server idle time takes effect only once all the server thread pool idle threads have been reaped (the thread idle time can be configured with the [ThreadIdleTime](../ice-threadpool-properties) thread pool property.
{% /callout %}

# Ice.SOCKSProxyHost

#### Synopsis

`Ice.SOCKSProxyHost=addr`

#### Description

Specifies the host name or IP address of a SOCKS proxy server. If `addr` is not empty, Ice uses the designated SOCKS proxy server for all outgoing (client) connections.

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

If `filename` is not empty, the standard error stream of this process is redirected to this file, in append mode. This property is checked only for the first communicator that is created in a process.

# Ice.StdOut

#### Synopsis

`Ice.StdOut=filename`

#### Description

If `filename` is not empty, the standard output stream of this process is redirected to this file, in append mode. This property is checked only for the first communicator created in a process.

# Ice.SyslogFacility

#### Synopsis

`Ice.SyslogFacility=string` (Unix only)

#### Description

This property sets the syslog facility to `string`. This property has no effect if `Ice.UseSyslog` is not set. Each communicator can use its own facility, even when several communicators in the same process log to `syslog`.

`string` can be any of syslog facilities: `LOG_AUTH, LOG_AUTHPRIV, LOG_CRON, LOG_DAEMON, LOG_FTP, LOG_KERN, LOG_LOCAL0, LOG_LOCAL1, LOG_LOCAL2, LOG_LOCAL3, LOG_LOCAL4, LOG_LOCAL5, LOG_LOCAL6, LOG_LOCAL7, LOG_LPR, LOG_MAIL, LOG_NEWS, LOG_SYSLOG, LOG_USER, LOG_UUCP`.

The default value is `LOG_USER`.
{% /language-section %}

{% language-section name="lang-8" %}

# Ice.UseOSLog

#### Synopsis

`Ice.UseOSLog=num` (macOS only)

#### Description

If `num` is set to a value larger than 0, a special [logger](../logger-facility) is installed that logs using [OSLog](https://developer.apple.com/documentation/os/oslog).

# Ice.UseSyslog

#### Synopsis

`Ice.UseSyslog=num` (Unix only)

#### Description

If `num` is set to a value larger than 0, a special [logger](../logger-facility) is installed that logs to the `syslog` service instead of standard error. Use [Ice.SyslogFacility](../ice-properties#ice.syslogfacility) to select a `syslog` facility.

The connection to the `syslog` service is process-global: all syslog loggers in a process share a single connection, opened when the first syslog logger is created and closed when the last one is destroyed. As a result:

- The `syslog` identifier is the `Ice.ProgramName` of the communicator that creates the first syslog logger in the process. It remains in effect until all syslog loggers in this process are destroyed.
- A syslog logger with a different program name prepends this program name to each message it logs. For example, an IceBox server configured with `Ice.UseSyslog=1` and `IceBox.InheritProperties=1` logs its own messages under the identifier `icebox`, and the messages of each of its services with the prefix `icebox-<service name>:` followed by a space.
- `Ice.SyslogFacility` remains per-communicator: each message is logged with the facility configured for the communicator that produced it.

# Ice.UseSystemdJournal

#### Synopsis

`Ice.UseSystemdJournal=num` (Linux only)

#### Description

If `num` is set to a value larger than 0, a special [logger](../logger-facility) is installed that logs to the systemd journal instead of standard error. Journal entries are tagged with the value of `Ice.ProgramName` as their syslog identifier (the `SYSLOG_IDENTIFIER` journal field), so you can filter them with `journalctl -t name`.
{% /language-section %}
