{% language-section name="lang-1" %}

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

{% callout type="info" %}

On Windows, the server idle time takes effect only once all the server thread pool idle threads have been reaped. The
thread idle time can be configured with the [ThreadIdleTime](../ice-threadpool-properties) thread pool property.

{% /callout %}

{% /language-section %}

{% language-section name="lang-8" %}

{% /language-section %}
