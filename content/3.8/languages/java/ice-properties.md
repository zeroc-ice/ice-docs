---
id: ice-properties
language: java
---

{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

# Ice.CacheMessageBuffers

#### Synopsis

`Ice.CacheMessageBuffers=num`

#### Description

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

In Java, Ice first attempts to open a configuration file as a [class loader resource](../alternate-property-stores). If
that attempt fails, Ice opens the configuration file in the local file system.

Configuration files use a simple [syntax](../configuration-file-syntax) consisting of _name_=_value_ pairs with support
for comments and escaping.

{% /language-section %}

{% language-section name="lang-4" %}

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

{% /language-section %}

{% language-section name="lang-5" %}

# Ice.InitPlugins

#### Synopsis

`Ice.InitPlugins=num`

#### Description

If `num` is a value greater than zero, the Ice runtime automatically initializes the plug-ins it has loaded. The order
in which plug-ins are loaded and initialized is determined by Ice.PluginLoadOrder. An application may need to set this
property to zero in order to interact directly with a plug-in after it has been loaded but before it is initialized. In
this case, the application must invoke `initializePlugins` on the plug-in manager to complete the initialization
process. If not defined, the default value is 1.

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

Java's default network stack always accepts both IPv4 and IPv6 connections regardless of the settings of `Ice.IPv6`. You
can configure the Java runtime to use only IPv4 by starting your application with the following JVM option:

```shell
java -Djava.net.preferIPv4Stack=true ...
```

{% /language-section %}

{% language-section name="lang-6" %}

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

# Ice.Package._module_

#### Synopsis

`Ice.Package.module=package`

#### Description

Ice for Java allows you to customize the Slice module to Java package mapping with the `java:package` and
`java:identifier` [metadata directive](../slice-metadata-directives).

When you use this feature, you need to help Ice locate your remapped classes during unmarshaling, by installing a
[Slice loader](../slice-loaders) in your communicator. The `Ice.Package.module` properties tell the Ice communicator to
install automatically a [ModuleToPackageSliceLoader](https://code.zeroc.com/manual/Ice/ModuleToPackageSliceLoader)
during initialization, configured using the module to package map created by these properties.

This property is provided primarily for backwards compatibility; we recommend configuring Slice loaders programmatically
in new applications.

See also: [Ice.Default.Package](../ice-default-properties)

# Ice.PluginLoadOrder

#### Synopsis

`Ice.PluginLoadOrder=names`

#### Description

Determines the order in which [plug-ins](../plug-in-facility) are loaded (loaded is a synonym for created in this
context). The Ice runtime loads the plug-ins in the order they appear in `names`, where each plug-in name is separated
by a comma or white space. Any plug-ins not mentioned in `names` are loaded afterward, in an undefined order.

Plug-ins installed using `InitializationData::pluginFactories` are always created before all other plug-ins. They are
not affected by this property.

# Ice.PreferIPv6Address

#### Synopsis

`Ice.PreferIPv6Address=num`

#### Description

If both IPv4 and IPv6 are enabled (the default), specifies whether Ice prefers IPv6 addresses over IPv4 addresses when
resolving hostnames. If `num` is a value greater than zero, IPv6 addresses are preferred. If not specified, the default
value is 0.

# Ice.PrintAdapterReady

#### Synopsis

`Ice.PrintAdapterReady=num`

#### Description

If `num` is set to a value larger than 0, an object adapter prints "_adapter_name_ ready" on standard output after
activation is complete. This is useful for scripts that need to wait until an object adapter is ready to be used.

{% /language-section %}

{% language-section name="lang-7" %}

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

For C# applications and Windows C++ applications, the server idle time takes effect only once all the server thread pool
idle threads have been reaped (the thread idle time can be configured with the
[ThreadIdleTime](../ice-threadpool-properties) thread pool property.

{% /callout %}

# Ice.SliceLoader.NotFoundCacheSize

#### Synopsis

`Ice.SliceLoader.NotFoundCacheSize=num`

#### Description

When `num` is set to a value larger than 0, the communicator installs an internal “not found” cache that caches failed
Slice loader resolutions.

The default value is 100.

See also [Ice.Warn.SliceLoader](../ice-warn-properties).

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

`Ice.SyslogFacility=string` (Unix only)

#### Description

This property sets the syslog facility to `string`. This property has no effect if `Ice.UseSyslog` is not set. Each
communicator can use its own facility, even when several communicators in the same process log to `syslog`.

`string` can be any of syslog facilities:
`LOG_AUTH, LOG_AUTHPRIV, LOG_CRON, LOG_DAEMON, LOG_FTP, LOG_KERN, LOG_LOCAL0, LOG_LOCAL1, LOG_LOCAL2, LOG_LOCAL3, LOG_LOCAL4, LOG_LOCAL5, LOG_LOCAL6, LOG_LOCAL7, LOG_LPR, LOG_MAIL, LOG_NEWS, LOG_SYSLOG, LOG_USER, LOG_UUCP`.

The default value is `LOG_USER`.

# Ice.ThreadPriority

#### Synopsis

`Ice.ThreadPriority=value`

#### Description

`value` specifies a thread priority. Threads created by the Ice runtime are created with the specified priority by
default. Leaving this property unset causes the runtime to create threads with the system default priority. This
property is unset by default.

#### C\#

`value` can be `Lowest`, `BelowNormal`, `Normal`, `AboveNormal`, or `Highest`.

#### Java

`value` can be `MIN_PRIORITY`, `NORM_PRIORITY`, `MAX_PRIORITY`, or an integer between `1` and `10`.

You can separately override the default priorities for the client and server thread pools using
[Ice.ThreadPool._name_.ThreadPriority](../ice-threadpool-properties#ice.threadpool.name.threadpriority) as well as for a
specific object adapter using [_adapter_.ThreadPool.ThreadPriority](../object-adapter-properties).

{% /language-section %}

{% language-section name="lang-8" %}

{% /language-section %}
