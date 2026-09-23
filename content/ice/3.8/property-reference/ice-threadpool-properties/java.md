{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

# Ice.ThreadPool._name_.StackSize

#### Synopsis

`Ice.ThreadPool.name.StackSize=num`

#### Description

`num` is the stack size (in bytes) of threads in the `Client` or `Server` [thread pool](../the-ice-threading-model). The
default value is 0, meaning the operating system's default is used.

{% /language-section %}

{% language-section name="lang-3" %}

# Ice.ThreadPool._name_.ThreadPriority

#### Synopsis

`Ice.ThreadPool.name.ThreadPriority=value`

#### Description

`value` specifies a thread priority for the threads in the `Client` or `Server`
[thread pool](../the-ice-threading-model). Leaving this property unset causes the runtime to create threads with the
default priority specified by [Ice.ThreadPriority](../ice-properties).

This property is unset by default.

`value` can be `MIN_PRIORITY`, `NORM_PRIORITY`, `MAX_PRIORITY`, or an integer between `1` and `10`.

You can also override the default priority for a specific object adapter using
[_adapter_.ThreadPool.ThreadPriority](../object-adapter-properties).

{% /language-section %}
