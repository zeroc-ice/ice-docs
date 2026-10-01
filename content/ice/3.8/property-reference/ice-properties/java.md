{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

## Ice.CacheMessageBuffers

### Synopsis {% id="ice.cachemessagebuffers-synopsis" %}

`Ice.CacheMessageBuffers=num`

### Description {% id="ice.cachemessagebuffers-description" %}

If `num` is a value greater than 0, the proxies cache message buffers for future reuse. This can improve performance and
reduce the amount of garbage produced by Ice internals that the garbage collector would eventually spend time to
reclaim. However, for applications that exchange very large messages, this cache may consume excessive amounts of memory
and therefore should be disabled by setting this property to 0.

The default value is 2.

{% callout type="info" %}

This property only affects the caching of message buffers for invocations. The Ice runtime never caches message buffers
for dispatches.

{% /callout %}

Ice for Java allocates non-direct message buffers when this property is set to 1 and direct message buffers when set
to 2. Use of direct message buffers minimizes copying and typically results in improved throughput.

{% /language-section %}

{% language-section name="lang-3" %}

## Ice.Compression.Level

### Synopsis {% id="ice.compression.level-synopsis" %}

`Ice.Compression.Level=num`

### Description {% id="ice.compression.level-description" %}

Specifies the bzip2 compression level to use when [compressing protocol messages](../protocol-compression). Legal values
for `num` are `1` to `9`, where `1` represents the fastest compression and `9` represents the best compression. Note
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
[ICE_CONFIG](../using-configuration-files) environment variable to retrieve the path names of one or more configuration
files. Otherwise, `Ice.Config` must be set to the path names of one or more configuration files, separated by commas
(path names can be relative or absolute). Property values are read from each of the configuration files listed.

In Java, Ice first attempts to open a configuration file as a [class loader resource](../alternate-property-stores). If
that attempt fails, Ice opens the configuration file in the local file system.

Configuration files use a simple [syntax](../configuration-file-syntax) consisting of _name_=_value_ pairs with support
for comments and escaping.

{% /language-section %}

{% language-section name="lang-4" %}

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

{% /language-section %}

{% language-section name="lang-5" %}

## Ice.InitPlugins

### Synopsis {% id="ice.initplugins-synopsis" %}

`Ice.InitPlugins=num`

### Description {% id="ice.initplugins-description" %}

If `num` is a value greater than zero, the Ice runtime automatically initializes the plug-ins it has loaded. The order
in which plug-ins are loaded and initialized is determined by Ice.PluginLoadOrder. An application may need to set this
property to zero in order to interact directly with a plug-in after it has been loaded but before it is initialized. In
this case, the application must invoke `initializePlugins` on the plug-in manager to complete the initialization
process. If not defined, the default value is 1.

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

Java's default network stack always accepts both IPv4 and IPv6 connections regardless of the settings of `Ice.IPv6`. You
can configure the Java runtime to use only IPv4 by starting your application with the following JVM option:

```shell
java -Djava.net.preferIPv4Stack=true ...
```

{% /language-section %}

{% language-section name="lang-6" %}

## Ice.Package._module_

### Synopsis {% id="ice.package.module-synopsis" %}

`Ice.Package.module=package`

### Description {% id="ice.package.module-description" %}

Ice for Java allows you to customize the Slice module to Java package mapping with the `java:package` and
`java:identifier` [metadata directive](../slice-metadata-directives).

When you use this feature, you need to help Ice locate your remapped classes during unmarshaling, by installing a
[Slice loader](../slice-loaders) in your communicator. The `Ice.Package.module` properties tell the Ice communicator to
install automatically a [ModuleToPackageSliceLoader](https://code.zeroc.com/manual/Ice/ModuleToPackageSliceLoader)
during initialization, configured using the module to package map created by these properties.

This property is provided primarily for backwards compatibility; we recommend configuring Slice loaders programmatically
in new applications.

See also: [Ice.Default.Package](../ice-default-properties)

## Ice.PluginLoadOrder

### Synopsis {% id="ice.pluginloadorder-synopsis" %}

`Ice.PluginLoadOrder=names`

### Description {% id="ice.pluginloadorder-description" %}

Determines the order in which [plug-ins](../plug-in-facility) are loaded (loaded is a synonym for created in this
context). The Ice runtime loads the plug-ins in the order they appear in `names`, where each plug-in name is separated
by a comma or white space. Any plug-ins not mentioned in `names` are loaded afterward, in an undefined order.

Plug-ins installed using `InitializationData::pluginFactories` are always created before all other plug-ins. They are
not affected by this property.

## Ice.PreferIPv6Address

### Synopsis {% id="ice.preferipv6address-synopsis" %}

`Ice.PreferIPv6Address=num`

### Description {% id="ice.preferipv6address-description" %}

If both IPv4 and IPv6 are enabled (the default), specifies whether Ice prefers IPv6 addresses over IPv4 addresses when
resolving hostnames. If `num` is a value greater than zero, IPv6 addresses are preferred. If not specified, the default
value is 0.

## Ice.PrintAdapterReady

### Synopsis {% id="ice.printadapterready-synopsis" %}

`Ice.PrintAdapterReady=num`

### Description {% id="ice.printadapterready-description" %}

If `num` is set to a value larger than 0, an object adapter prints "_adapter_name_ ready" on standard output after
activation is complete. This is useful for scripts that need to wait until an object adapter is ready to be used.

{% /language-section %}

{% language-section name="lang-7" %}

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
[activated by IceGrid](../icegrid-server-activation).

## Ice.SliceLoader.NotFoundCacheSize

### Synopsis {% id="ice.sliceloader.notfoundcachesize-synopsis" %}

`Ice.SliceLoader.NotFoundCacheSize=num`

### Description {% id="ice.sliceloader.notfoundcachesize-description" %}

When `num` is set to a value larger than 0, the communicator installs an internal “not found” cache that caches failed
Slice loader resolutions.

The default value is 100.

See also [Ice.Warn.SliceLoader](../ice-warn-properties).

## Ice.SOCKSProxyHost

### Synopsis {% id="ice.socksproxyhost-synopsis" %}

`Ice.SOCKSProxyHost=addr`

### Description {% id="ice.socksproxyhost-description" %}

Specifies the host name or IP address of a SOCKS proxy server. If `addr` is not empty, Ice uses the designated SOCKS
proxy server for all outgoing (client) connections.

{% callout type="info" %}

Ice currently only supports the SOCKS4 protocol, which means only IPv4 connections are allowed.

{% /callout %}

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

`Ice.SyslogFacility=string` (Unix only)

### Description {% id="ice.syslogfacility-description" %}

This property sets the syslog facility to `string`. This property has no effect if `Ice.UseSyslog` is not set. Each
communicator can use its own facility, even when several communicators in the same process log to `syslog`.

`string` can be any of syslog facilities:
`LOG_AUTH, LOG_AUTHPRIV, LOG_CRON, LOG_DAEMON, LOG_FTP, LOG_KERN, LOG_LOCAL0, LOG_LOCAL1, LOG_LOCAL2, LOG_LOCAL3, LOG_LOCAL4, LOG_LOCAL5, LOG_LOCAL6, LOG_LOCAL7, LOG_LPR, LOG_MAIL, LOG_NEWS, LOG_SYSLOG, LOG_USER, LOG_UUCP`.

The default value is `LOG_USER`.

## Ice.SyslogHost

### Synopsis {% id="ice.sysloghost-synopsis" %}

`Ice.SyslogHost=host` (Unix only)

### Description {% id="ice.sysloghost-description" %}

Specifies the host name or IP address of the syslog daemon that receives log messages when
[Ice.UseSyslog](../ice-properties#ice.usesyslog) is enabled. The default value is `localhost`.

## Ice.SyslogPort

### Synopsis {% id="ice.syslogport-synopsis" %}

`Ice.SyslogPort=port` (Unix only)

### Description {% id="ice.syslogport-description" %}

Specifies the UDP port of the syslog daemon at [Ice.SyslogHost](../ice-properties#ice.sysloghost). The default value is
`514`. This property takes effect when [Ice.UseSyslog](../ice-properties#ice.usesyslog) is enabled.

## Ice.ThreadPriority

### Synopsis {% id="ice.threadpriority-synopsis" %}

`Ice.ThreadPriority=value`

### Description {% id="ice.threadpriority-description" %}

`value` specifies a thread priority. Threads created by the Ice runtime are created with the specified priority by
default. Leaving this property unset causes the runtime to create threads with the system default priority. This
property is unset by default.

`value` can be `MIN_PRIORITY`, `NORM_PRIORITY`, `MAX_PRIORITY`, or an integer between `1` and `10`.

The named values can also include the `java.lang.Thread.` prefix, for example `java.lang.Thread.NORM_PRIORITY`.

You can separately override the default priorities for the client and server thread pools using
[Ice.ThreadPool._name_.ThreadPriority](../ice-threadpool-properties#ice.threadpool.name.threadpriority) as well as for a
specific object adapter using [_adapter_.ThreadPool.ThreadPriority](../object-adapter-properties).

{% /language-section %}

{% language-section name="lang-8" %}

## Ice.UseSyslog

### Synopsis {% id="ice.usesyslog-synopsis" %}

`Ice.UseSyslog=num` (Unix only)

### Description {% id="ice.usesyslog-description" %}

If `num` is greater than 0, Ice for Java sends log messages as UDP datagrams to the syslog daemon configured by
[Ice.SyslogHost](../ice-properties#ice.sysloghost) and [Ice.SyslogPort](../ice-properties#ice.syslogport). The messages
use the RFC 3164 syslog format without a header and include the program name as their prefix.
[Ice.SyslogFacility](../ice-properties#ice.syslogfacility) selects the facility. The default value of `Ice.UseSyslog`
is 0. Ice ignores this property on Windows.

This property cannot be combined with [Ice.LogFile](../ice-properties#ice.logfile).

{% /language-section %}
