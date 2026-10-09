{% language-section name="ice.batchautoflushsize" %}

## Ice.CacheMessageBuffers

{% property-synopsis %}

`Ice.CacheMessageBuffers=num`

{% /property-synopsis %}

{% property-description %}

If `num` is greater than `0`, the proxies cache message buffers for future reuse. This can improve performance and
reduce the amount of garbage produced by Ice internals that the garbage collector would eventually spend time to
reclaim. However, for applications that exchange very large messages, this cache may consume excessive amounts of memory
and therefore should be disabled by setting this property to `0`.

The default value is `2`.

{% callout type="note" %}

This property only affects the caching of message buffers for invocations. The Ice runtime never caches message buffers
for dispatches.

{% /callout %}

Ice for Java allocates non-direct message buffers when this property is set to `1` and direct message buffers when set
to `2`. Use of direct message buffers minimizes copying and typically results in improved throughput.

{% /property-description %}

{% /language-section %}

{% language-section name="ice.config" %}

## Ice.Compression.Level

{% property-synopsis %}

`Ice.Compression.Level=num`

{% /property-synopsis %}

{% property-description %}

Specifies the bzip2 compression level to use when [compressing protocol messages](../../protocol/protocol-compression).
Values range from `1` to `9`, where `1` represents the fastest compression and `9` represents the best compression. Note
that higher levels cause the bzip2 algorithm to devote more resources to the compression effort, and may not result in a
significant improvement over lower levels. If not specified, the default value is `1`.

{% /property-description %}

## Ice.Config

{% property-synopsis %}

```config
Ice.Config=config_file[,config_file,...]
Ice.Config=1
```

{% /property-synopsis %}

{% property-description %}

This property must be set from the command line with one of the options `--Ice.Config`, `--Ice.Config=1`, or
`--Ice.Config=config_file`.

If the `Ice.Config` property is empty or set to `1`, or not set at all, the Ice runtime examines the contents of the
[ICE_CONFIG](../../runtime/properties-and-configuration/using-configuration-files) environment variable to retrieve the
path names of one or more configuration files. Otherwise, `Ice.Config` must be set to the path names of one or more
configuration files, separated by commas (path names can be relative or absolute). Property values are read from each of
the configuration files listed.

In Java, Ice first attempts to open a configuration file as a
[class loader resource](../../runtime/properties-and-configuration/alternate-property-stores). If that attempt fails,
Ice opens the configuration file in the local file system.

Configuration files use a simple [syntax](../../runtime/properties-and-configuration/configuration-file-syntax)
consisting of _name_=_value_ pairs with support for comments and escaping.

{% /property-description %}

{% /language-section %}

{% language-section name="ice.httpproxyport" %}

## Ice.HTTPProxyHost

{% property-synopsis %}

`Ice.HTTPProxyHost=addr`

{% /property-synopsis %}

{% property-description %}

Specifies the host name or IP address of an HTTP proxy server. If `addr` is not empty, Ice uses the designated HTTP
proxy server for all outgoing (client) connections.

{% /property-description %}

## Ice.HTTPProxyPort

{% property-synopsis %}

`Ice.HTTPProxyPort=num`

{% /property-synopsis %}

{% property-description %}

The port number of the HTTP proxy server. If not specified, the default value is `1080`.

{% /property-description %}

{% /language-section %}

{% language-section name="ice.ipv6" %}

## Ice.InitPlugins

{% property-synopsis %}

`Ice.InitPlugins=num`

{% /property-synopsis %}

{% property-description %}

If `num` is a value greater than `0`, the Ice runtime automatically initializes the plug-ins it has loaded. Ice
initializes plug-ins in construction order; `InitializationData.pluginFactories` and `Ice.PluginLoadOrder` determine
this order. An application may need to set this property to `0` in order to interact directly with a plug-in after it
has been loaded but before it is initialized. In this case, the application must invoke `initializePlugins` on the
plug-in manager to complete the initialization process. If not defined, the default value is `1`.

{% /property-description %}

## Ice.IPv4

{% property-synopsis %}

`Ice.IPv4=num`

{% /property-synopsis %}

{% property-description %}

Specifies whether Ice uses IPv4. If `num` is a value greater than `0`, IPv4 is enabled. If not specified, the default
value is `1`.

{% /property-description %}

## Ice.IPv6

{% property-synopsis %}

`Ice.IPv6=num`

{% /property-synopsis %}

{% property-description %}

Specifies whether Ice uses IPv6. If `num` is a value greater than `0`, IPv6 is enabled. If not specified, the default
value is `1` if the system supports the creation of IPv6 sockets, and `0` otherwise.

Java's default network stack always accepts both IPv4 and IPv6 connections regardless of the settings of `Ice.IPv6`. You
can configure the Java runtime to use only IPv4 by starting your application with the following JVM option:

```shell
java -Djava.net.preferIPv4Stack=true ...
```

{% /property-description %}

{% /language-section %}

{% language-section name="ice.printstacktraces" %}

## Ice.Package._module_

{% property-synopsis %}

`Ice.Package.module=package`

{% /property-synopsis %}

{% property-description %}

Ice for Java allows you to customize the Slice module to Java package mapping with the `java:package` and
`java:identifier` [metadata directive](../../slice/slice-metadata-directives).

When you use this feature, you need to help Ice locate your remapped classes during unmarshaling, by installing a
[Slice loader](../../slice/user-defined-types/classes/slice-loaders) in your communicator. The `Ice.Package.module`
properties tell the Ice communicator to install automatically a
[ModuleToPackageSliceLoader](api:Ice/ModuleToPackageSliceLoader) during initialization, configured using the module to
package map created by these properties.

This property is provided primarily for backwards compatibility; we recommend configuring Slice loaders programmatically
in new applications.

See also: [Ice.Default.Package](../ice-default-properties)

{% /property-description %}

## Ice.PluginLoadOrder

{% property-synopsis %}

`Ice.PluginLoadOrder=names`

{% /property-synopsis %}

{% property-description %}

Specifies the order in which Ice creates the plug-ins installed through configuration, with `Ice.Plugin.name`
properties. `names` lists plug-in names separated by commas or white space. Ice creates the plug-ins in `names` first,
in that order, and then the other plug-ins installed through configuration, in an undefined order.

This property does not affect the plug-ins installed through `InitializationData.pluginFactories`, even when an
`Ice.Plugin.name` property supplies their arguments: Ice creates these plug-ins in list order, before any plug-in
installed through configuration.

{% /property-description %}

## Ice.PreferIPv6Address

{% property-synopsis %}

`Ice.PreferIPv6Address=num`

{% /property-synopsis %}

{% property-description %}

If both IPv4 and IPv6 are enabled (the default), specifies whether Ice prefers IPv6 addresses over IPv4 addresses when
resolving hostnames. If `num` is a value greater than `0`, IPv6 addresses are preferred. If not specified, the default
value is `0`.

{% /property-description %}

## Ice.PrintAdapterReady

{% property-synopsis %}

`Ice.PrintAdapterReady=num`

{% /property-synopsis %}

{% property-description %}

If `num` is set to a value larger than `0`, an object adapter prints "_adapter_name_ ready" on standard output after
activation is complete. This is useful for scripts that need to wait until an object adapter is ready to be used.

{% /property-description %}

{% /language-section %}

{% language-section name="ice.syslogfacility" %}

## Ice.ServerIdleTime

{% property-synopsis %}

`Ice.ServerIdleTime=num`

{% /property-synopsis %}

{% property-description %}

If `num` is set to a value larger than `0`, Ice automatically calls `shutdown` on the communicator when its server
thread pool has been idle for `num` seconds. The server thread pool is not idle as long as any of its thread is
performing some task, like dispatching a request.

This call to `shutdown` shuts down the communicator's server side and causes any thread waiting on `waitForShutdown` to
return. After that, a server will typically do some clean-up work before exiting. The default value is `0`, meaning that
the server will not shut down automatically. This property is often used for servers that are automatically
[activated by IceGrid](../../services/icegrid/icegrid-server-activation).

{% /property-description %}

## Ice.SliceLoader.NotFoundCacheSize

{% property-synopsis %}

`Ice.SliceLoader.NotFoundCacheSize=num`

{% /property-synopsis %}

{% property-description %}

When `num` is set to a value larger than `0`, the communicator installs an internal “not found” cache that caches failed
Slice loader resolutions.

The default value is `100`.

See also [Ice.Warn.SliceLoader](../ice-warn-properties).

{% /property-description %}

## Ice.SOCKSProxyHost

{% property-synopsis %}

`Ice.SOCKSProxyHost=addr`

{% /property-synopsis %}

{% property-description %}

Specifies the host name or IP address of a SOCKS proxy server. If `addr` is not empty, Ice uses the designated SOCKS
proxy server for all outgoing (client) connections.

{% callout type="note" %}

Ice supports the SOCKS4 protocol, which requires IPv4. If both `Ice.SOCKSProxyHost` and `Ice.HTTPProxyHost` are set, Ice
uses the SOCKS proxy.

{% /callout %}

{% /property-description %}

## Ice.SOCKSProxyPort

{% property-synopsis %}

`Ice.SOCKSProxyPort=num`

{% /property-synopsis %}

{% property-description %}

The port number of the SOCKS proxy server. If not specified, the default value is `1080`.

{% /property-description %}

## Ice.StdErr

{% property-synopsis %}

`Ice.StdErr=filename`

{% /property-synopsis %}

{% property-description %}

If `filename` is not empty, the standard error stream of this process is redirected to this file, in append mode. This
property is checked only for the first communicator that is created in a process.

`Ice.StdErr` and `Ice.StdOut` can name the same file.

{% /property-description %}

## Ice.StdOut

{% property-synopsis %}

`Ice.StdOut=filename`

{% /property-synopsis %}

{% property-description %}

If `filename` is not empty, the standard output stream of this process is redirected to this file, in append mode. This
property is checked only for the first communicator created in a process.

`Ice.StdErr` and `Ice.StdOut` can name the same file.

{% /property-description %}

## Ice.SyslogFacility

{% property-synopsis %}

`Ice.SyslogFacility=string` (Unix only)

{% /property-synopsis %}

{% property-description %}

This property sets the syslog facility to `string`. This property has no effect if `Ice.UseSyslog` is not set. Each
communicator can use its own facility, even when several communicators in the same process log to `syslog`.

`string` can be any of syslog facilities:
`LOG_AUTH, LOG_AUTHPRIV, LOG_CRON, LOG_DAEMON, LOG_FTP, LOG_KERN, LOG_LOCAL0, LOG_LOCAL1, LOG_LOCAL2, LOG_LOCAL3, LOG_LOCAL4, LOG_LOCAL5, LOG_LOCAL6, LOG_LOCAL7, LOG_LPR, LOG_MAIL, LOG_NEWS, LOG_SYSLOG, LOG_USER, LOG_UUCP`.

The default value is `LOG_USER`.

{% /property-description %}

## Ice.SyslogHost

{% property-synopsis %}

`Ice.SyslogHost=host` (Unix only)

{% /property-synopsis %}

{% property-description %}

Specifies the host name or IP address of the syslog daemon that receives log messages when
[Ice.UseSyslog](#ice.usesyslog) is enabled. The default value is `localhost`.

{% /property-description %}

## Ice.SyslogPort

{% property-synopsis %}

`Ice.SyslogPort=port` (Unix only)

{% /property-synopsis %}

{% property-description %}

Specifies the UDP port of the syslog daemon at [Ice.SyslogHost](#ice.sysloghost). The default value is `514`. This
property takes effect when [Ice.UseSyslog](#ice.usesyslog) is enabled.

{% /property-description %}

## Ice.ThreadPriority

{% property-synopsis %}

`Ice.ThreadPriority=value`

{% /property-synopsis %}

{% property-description %}

`value` specifies a thread priority. Threads created by the Ice runtime are created with the specified priority by
default. Leaving this property unset causes the runtime to create threads with the system default priority. This
property is unset by default.

`value` can be `MIN_PRIORITY`, `NORM_PRIORITY`, `MAX_PRIORITY`, or an integer between `1` and `10`.

The named values can also include the `java.lang.Thread.` prefix, for example `java.lang.Thread.NORM_PRIORITY`.

You can separately override the default priorities for the client and server thread pools using
[Ice.ThreadPool._name_.ThreadPriority](../ice-threadpool-properties#ice.threadpool.name.threadpriority) as well as for a
specific object adapter using [_adapter_.ThreadPool.ThreadPriority](../object-adapter-properties).

{% /property-description %}

{% /language-section %}

{% language-section name="ice.usesystemdjournal" %}

## Ice.UseSyslog

{% property-synopsis %}

`Ice.UseSyslog=num` (Unix only)

{% /property-synopsis %}

{% property-description %}

If `num` is greater than `0`, Ice for Java sends log messages as UDP datagrams to the syslog daemon configured by
[Ice.SyslogHost](#ice.sysloghost) and [Ice.SyslogPort](#ice.syslogport). The messages use the RFC 3164 syslog format
without a header and include the program name as their prefix. [Ice.SyslogFacility](#ice.syslogfacility) selects the
facility. The default value of `Ice.UseSyslog` is `0`. Ice ignores this property on Windows.

On other platforms, this property cannot be combined with [Ice.LogFile](#ice.logfile).

{% /property-description %}

{% /language-section %}
