---
id: ice-properties
language: swift
---

{% language-section name="lang-1" %}

# Ice.AcceptClassCycles

#### Synopsis

`Ice.AcceptClassCycles=num`

#### Description

If `num` is set to 0 (the default), the unmarshaling of class cycles is disallowed. A `MarshalException` is thrown when
a cycle is detected during unmarshaling.

If `num` is set to a value larger than 0, class cycles are unmarshaled. You must break any cycles programmatically in
your own code to prevent memory leaks.

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}

{% language-section name="lang-3" %}

{% /language-section %}

{% language-section name="lang-4" %}

{% /language-section %}

{% language-section name="lang-5" %}

{% /language-section %}

{% language-section name="lang-6" %}

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

# Ice.SliceLoader.NotFoundCacheSize

#### Synopsis

`Ice.SliceLoader.NotFoundCacheSize=num`

#### Description

When `num` is set to a value larger than 0, the communicator installs an internal “not found” cache that caches failed
Slice loader resolutions.

The default value is 100.

See also [Ice.Warn.SliceLoader](../ice-warn-properties).

{% /language-section %}

{% language-section name="lang-8" %}

{% /language-section %}
