---
id: ice-properties
title: Ice.*
---

{% language-section name="lang-1" /%}

# Ice.BackgroundLocatorCacheUpdates

#### Synopsis

`Ice.BackgroundLocatorCacheUpdates=num`

#### Description

If `num` is set to 0 (the default), an invocation on an indirect proxy whose endpoints are older than the configured
[locator cache](../locator-semantics-for-clients) timeout triggers a locator cache update; the run time delays the
invocation until the new endpoints are returned by the locator.

If `num` is set to a value larger than 0, an invocation on an indirect proxy with expired endpoints still triggers a
locator cache update, but the update is performed in the background, and the run time uses the expired endpoints for the
invocation. This avoids delaying the first invocation that follows expiry of a cache entry.

# Ice.BatchAutoFlushSize

#### Synopsis

`Ice.BatchAutoFlushSize=num` (in kilobytes)

#### Description

This property controls how the Ice runtime deals with flushing of [batch messages](../batched-invocations). If `num` is
set to a value greater than 0, the runtime automatically forces a flush of the current batch when a new message is added
to a batch and that message would cause the batch to exceed `num` kilobytes. If `num` is set to 0 or a negative number,
batches must be flushed explicitly by the application. If not defined, the default value is `1024`.

{% callout type="warning" %}

When flushed, batch requests are sent as a single Ice message. The Ice runtime in the receiver limits incoming messages
to the maximum size specified by [Ice.MessageSizeMax](../ice-properties), therefore the sender must periodically flush
batch requests (whether manually or automatically) to ensure they do not exceed the receiver's configured limit.

{% /callout %}

{% language-section name="lang-2" /%}

# Ice.ClassGraphDepthMax

#### Synopsis

`Ice.ClassGraphDepthMax=num`

#### Description

Specifies the maximum depth for a graph of Slice class instances to unmarshal. If this maximum is reached, the Ice
runtime throws a `MarshalException`. Reading and destroying a Slice class graph are recursive operations. This property
prevents stack overflows from occurring if a sender sends a very large graph and not enough space on the stack is
available. To read larger graphs, you can increase the value of this property. If not specified, the default value
is 10.

Setting this property to 0 (or to a negative number) disables the depth limit altogether.

{% language-section name="lang-3" /%}

{% language-section name="lang-4" /%}

# Ice.ImplicitContext

#### Synopsis

`Ice.ImplicitContext=type`

#### Description

Specifies whether a communicator has an [implicit request context](../implicit-request-contexts) and, if so, at what
scope the context applies. Legal values for this property are `None` (equivalent to the empty string), `PerThread`, and
`Shared`. If not specified, the default value is `None`.

{% language-section name="lang-5" /%}

# Ice.LogFile

#### Synopsis

`Ice.LogFile=file`

#### Description

Replaces the communicator's [default logger](../the-default-logger) with a simple file-based logger implementation. This
property does not affect the [per-process logger](../the-per-process-logger). The logger creates the specified file if
necessary, otherwise it appends to the file. If the logger is unable to open the file, the application receives an
`InitializationException` during [communicator initialization](../communicator-initialization-and-destruction). If a
logger object is supplied in the `InitializationData` argument during communicator initialization, it takes precedence
over this property.

{% language-section name="lang-6" /%}

# Ice.ProgramName

#### Synopsis

`Ice.ProgramName=name`

#### Description

`name` is the program name, which is used for logging. This name is
[set automatically](../command-line-parsing-and-initialization) from `argv[0]` (C++) and from
`AppDomain.CurrentDomain.FriendlyName` (C#) during initialization. For Java, `Ice.ProgramName` is initialized to the
empty string. The default name can be overridden by setting this property.

# Ice.RetryIntervals

#### Synopsis

`Ice.RetryIntervals=num [num ...]`

#### Description

This property defines the number of times an operation is [automatically retried](../automatic-retries) and the delay
between each retry. For example, if the property is set to `0 100 500`, the operation is retried 3 times: immediately
after the first failure, again after waiting 100ms after the second failure, and again after waiting 500ms after the
third failure. The default value (`0`) means Ice retries once immediately. If set to `-1`, no retry occurs.

{% language-section name="lang-7" /%}

# Ice.ToStringMode

#### Synopsis

`Ice.ToStringMode=string`

#### Description

`string` must be one of the following: `Unicode`, `ASCII`, `Compat`.

This property maps to an enumerator of [ToStringMode](https://code.zeroc.com/manual/Ice/ToStringMode) and controls how
`identityToString` and `proxyToString` on the communicator escape non-printable ASCII characters and non-ASCII
characters.

The default value is `Unicode`.

{% language-section name="lang-8" /%}
