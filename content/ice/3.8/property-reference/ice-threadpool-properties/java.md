{% language-section name="ice.threadpool.name.sizewarn" %}

## Ice.ThreadPool._name_.StackSize

{% property-synopsis %}

`Ice.ThreadPool.name.StackSize=num`

{% /property-synopsis %}

{% property-description %}

`num` is the stack size (in bytes) of threads in the `Client` or `Server` [thread pool](../../runtime/threading-model).
The default value is 0, meaning the operating system's default is used.

{% /property-description %}

{% /language-section %}

{% language-section name="ice.threadpool.name.threadidletime" %}

## Ice.ThreadPool._name_.ThreadPriority

{% property-synopsis %}

`Ice.ThreadPool.name.ThreadPriority=value`

{% /property-synopsis %}

{% property-description %}

`value` specifies a thread priority for the threads in the `Client` or `Server`
[thread pool](../../runtime/threading-model). Leaving this property unset causes the runtime to create threads with the
default priority specified by [Ice.ThreadPriority](../ice-properties).

This property is unset by default.

`value` can be `MIN_PRIORITY`, `NORM_PRIORITY`, `MAX_PRIORITY`, or an integer between `1` and `10`.

The named values can also include the `java.lang.Thread.` prefix, for example `java.lang.Thread.NORM_PRIORITY`.

You can also override the default priority for a specific object adapter using
[_adapter_.ThreadPool.ThreadPriority](../object-adapter-properties).

{% /property-description %}

{% /language-section %}
