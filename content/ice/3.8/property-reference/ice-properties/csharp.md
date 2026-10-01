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

Configuration files use a simple [syntax](../configuration-file-syntax) consisting of _name_=_value_ pairs with support
for comments and escaping.

## Ice.ConsoleListener

### Synopsis {% id="ice.consolelistener-synopsis" %}

`Ice.ConsoleListener=num`

### Description {% id="ice.consolelistener-description" %}

If `num` is non-0, the Ice runtime installs a `ConsoleTraceListener` that writes its messages to `stderr`. If `num` is
0, logging is disabled. Note that the setting of [Ice.LogFile](../ice-properties#ice.logfile) overrides this property:
if `Ice.LogFile` is set, messages are written to the log file regardless of the setting of `Ice.ConsoleListener`.

The default value is `1`.

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

{% /language-section %}

{% language-section name="lang-6" %}

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

## Ice.PreloadAssemblies

### Synopsis {% id="ice.preloadassemblies-synopsis" %}

`Ice.PreloadAssemblies=num`

### Description {% id="ice.preloadassemblies-description" %}

If `num` is set to a value larger than 0, the Ice runtime will try to load all the assemblies referenced by the process
during communicator initialization, otherwise the referenced assemblies will be initialized lazily. The default value
is 0.

## Ice.PrintAdapterReady

### Synopsis {% id="ice.printadapterready-synopsis" %}

`Ice.PrintAdapterReady=num`

### Description {% id="ice.printadapterready-description" %}

If `num` is set to a value larger than 0, an object adapter prints "_adapter_name_ ready" on standard output after
activation is complete. This is useful for scripts that need to wait until an object adapter is ready to be used.

## Ice.PrintProcessId

### Synopsis {% id="ice.printprocessid-synopsis" %}

`Ice.PrintProcessId=num`

### Description {% id="ice.printprocessid-description" %}

If `num` is set to a value larger than 0, the process ID is printed on standard output upon startup.

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

{% callout type="info" %}

The server idle time takes effect only once all the server thread pool idle threads have been reaped. The thread idle
time can be configured with the [ThreadIdleTime](../ice-threadpool-properties) thread pool property.

{% /callout %}

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

## Ice.ThreadPriority

### Synopsis {% id="ice.threadpriority-synopsis" %}

`Ice.ThreadPriority=value`

### Description {% id="ice.threadpriority-description" %}

`value` specifies a thread priority. Threads created by the Ice runtime are created with the specified priority by
default. Leaving this property unset causes the runtime to create threads with the system default priority. This
property is unset by default.

`value` can be `Lowest`, `BelowNormal`, `Normal`, `AboveNormal`, or `Highest`.

The named values can also include the `ThreadPriority.` prefix, for example `ThreadPriority.AboveNormal`.

You can separately override the default priorities for the client and server thread pools using
[Ice.ThreadPool._name_.ThreadPriority](../ice-threadpool-properties#ice.threadpool.name.threadpriority) as well as for a
specific object adapter using [_adapter_.ThreadPool.ThreadPriority](../object-adapter-properties).

{% /language-section %}

{% language-section name="lang-8" %}

{% /language-section %}
