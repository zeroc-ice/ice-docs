{% language-section name="ice.threadpool.name.sizewarn" %}

## Ice.ThreadPool._name_.StackSize

### Synopsis {% id="ice.threadpool.name.stacksize-synopsis" %}

`Ice.ThreadPool.name.StackSize=num`

### Description {% id="ice.threadpool.name.stacksize-description" %}

`num` is the stack size (in bytes) of threads in the `Client` or `Server` [thread pool](../../runtime/threading-model).
The default value is 0, meaning the operating system's default is used.

{% /language-section %}

{% language-section name="ice.threadpool.name.threadidletime" %}

## Ice.ThreadPool._name_.ThreadPriority

### Synopsis {% id="ice.threadpool.name.threadpriority-synopsis" %}

`Ice.ThreadPool.name.ThreadPriority=value`

### Description {% id="ice.threadpool.name.threadpriority-description" %}

`value` specifies a thread priority for the threads in the `Client` or `Server`
[thread pool](../../runtime/threading-model). Leaving this property unset causes the runtime to create threads with the
default priority specified by [Ice.ThreadPriority](../ice-properties).

This property is unset by default.

`value` can be `Lowest`, `BelowNormal`, `Normal`, `AboveNormal`, or `Highest`.

The named values can also include the `ThreadPriority.` prefix, for example `ThreadPriority.AboveNormal`.

You can also override the default priority for a specific object adapter using
[_adapter_.ThreadPool.ThreadPriority](../object-adapter-properties).

{% /language-section %}
