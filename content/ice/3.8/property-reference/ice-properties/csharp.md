{% language-section name="ice.batchautoflushsize" %}

## Ice.CacheMessageBuffers

{% property-synopsis %}

`Ice.CacheMessageBuffers=num`

{% /property-synopsis %}

{% property-description %}

If `num` is a value greater than `0`, the proxies cache message buffers for future reuse. This can improve performance
and reduce the amount of garbage produced by Ice internals that the garbage collector would eventually spend time to
reclaim. However, for applications that exchange very large messages, this cache may consume excessive amounts of memory
and therefore should be disabled by setting this property to `0`.

The default value is `2`.

{% callout type="note" %}

This property only affects the caching of message buffers for invocations. The Ice runtime never caches message buffers
for dispatches.

{% /callout %}

{% /property-description %}

{% /language-section %}

{% language-section name="ice.eventlog.source" %}

## Ice.ConsoleListener

{% property-synopsis %}

`Ice.ConsoleListener=num`

{% /property-synopsis %}

{% property-description %}

When the communicator uses Ice's default trace logger, `1` adds Ice's console listener to
`System.Diagnostics.Trace.Listeners`. This listener writes messages to `stderr`. With `0`, the logger continues writing
through `System.Diagnostics.Trace` using the existing listeners.

Ice consults this property when no logger is supplied in `InitializationData`, `Ice.LogFile` is empty and the
[per-process logger](../../administration/logger-facility/per-process-logger) is Ice's default logger.

The default value is `1`.

{% /property-description %}

{% /language-section %}

{% language-section name="ice.preferipv6address" %}

## Ice.PreloadAssemblies

{% property-synopsis %}

`Ice.PreloadAssemblies=num`

{% /property-synopsis %}

{% property-description %}

If `num` is set to a value larger than `0`, the Ice runtime will try to load all the assemblies referenced by the
process during communicator initialization, otherwise the referenced assemblies will be initialized lazily. The default
value is `0`.

{% /property-description %}

{% /language-section %}

{% language-section name="ice.syslogfacility" %}

## Ice.ThreadPriority

{% property-synopsis %}

`Ice.ThreadPriority=value`

{% /property-synopsis %}

{% property-description %}

`value` specifies a thread priority. Threads created by the Ice runtime are created with the specified priority by
default. Leaving this property unset causes the runtime to create threads with the system default priority. This
property is unset by default.

`value` can be `Lowest`, `BelowNormal`, `Normal`, `AboveNormal`, or `Highest`.

The named values can also include the `ThreadPriority.` prefix, for example `ThreadPriority.AboveNormal`.

You can separately override the default priorities for the client and server thread pools using
[Ice.ThreadPool._name_.ThreadPriority](../ice-threadpool-properties#ice.threadpool.name.threadpriority) as well as for a
specific object adapter using [_adapter_.ThreadPool.ThreadPriority](../object-adapter-properties).

{% /property-description %}

{% /language-section %}
