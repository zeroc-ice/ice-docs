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

{% language-section name="ice.ipv4" %}

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

{% language-section name="ice.messagesizemax" %}

## Ice.Package._module_

{% property-synopsis %}

`Ice.Package.module=package`

{% /property-synopsis %}

{% property-description %}

Specifies the enclosing Java package of the top-level Slice module _module_, the same package as in the module's
`java:package` [metadata directive](../../slice/slice-metadata-directives).

When one or more of these properties are set, the communicator adds a
[ModuleToPackageSliceLoader](api:Ice/ModuleToPackageSliceLoader) to its default
[Slice loader](../../slice/user-defined-types/classes/slice-loaders). This loader maps the Slice type IDs in each
_module_ to Java class names under the specified package. For example, with `Ice.Package.Demo=com.example`, it loads
`com.example.Demo.Node` for the type ID `::Demo::Node`.

The loader finds a class or exception only when neither the type name nor an enclosing module name is remapped with
`java:identifier`.

See also: [Ice.Default.Package](../ice-default-properties)

{% /property-description %}

{% /language-section %}

{% language-section name="ice.retryintervals" %}

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

{% /language-section %}

{% language-section name="ice.stdout" %}

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

{% /language-section %}

{% language-section name="ice.syslogfacility" %}

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
