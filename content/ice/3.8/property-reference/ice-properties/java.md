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

{% language-section name="ice.syslogfacility" %}

## Ice.SyslogHost

{% property-synopsis %}

`Ice.SyslogHost=host` (not available on Windows)

{% /property-synopsis %}

{% property-description %}

Specifies the host name or IP address of the syslog daemon that receives log messages when
[Ice.UseSyslog](#ice.usesyslog) is enabled. The default value is `localhost`.

{% /property-description %}

## Ice.SyslogPort

{% property-synopsis %}

`Ice.SyslogPort=port` (not available on Windows)

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

`Ice.UseSyslog=num` (not available on Windows)

{% /property-synopsis %}

{% property-description %}

If `num` is greater than `0`, Ice for Java sends log messages as UDP datagrams to the syslog daemon configured by
[Ice.SyslogHost](#ice.sysloghost) and [Ice.SyslogPort](#ice.syslogport). The messages use the RFC 3164 syslog format
without a header and include the program name as their prefix. [Ice.SyslogFacility](#ice.syslogfacility) selects the
facility. The default value of `Ice.UseSyslog` is `0`. Ice ignores this property on Windows.

On other platforms, this property cannot be combined with [Ice.LogFile](#ice.logfile).

{% /property-description %}

{% /language-section %}
