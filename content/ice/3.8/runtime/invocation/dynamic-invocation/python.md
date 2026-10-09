{% language-section name="invoking-an-operation" %}

`Ice.ObjectPrx` provides a synchronous `ice_invoke` and an asynchronous `ice_invokeAsync`:

```py
class ObjectPrx:
    def ice_invoke(
        self, operation: str, mode: OperationMode, inParams: bytes, ctx: dict[str, str] | None = None
    ) -> tuple[bool, bytes]: ...

    def ice_invokeAsync(
        self, operation: str, mode: OperationMode, inParams: bytes, ctx: dict[str, str] | None = None
    ) -> Awaitable[tuple[bool, bytes]]: ...
```

{% /language-section %}

{% language-section name="encoding-the-in-parameters" %}

The Python mapping has no public stream API, so a Python application passes an encapsulation that it received already
encoded, such as the in-parameters of a request that it forwards.

```py
proxy = Ice.ObjectPrx(communicator, "greeter:tcp -h localhost -p 4061")
ok, outParams = proxy.ice_invoke("greet", Ice.OperationMode.Normal, inParams)
```

{% /language-section %}

{% language-section name="forwarding-requests" %}

A forwarding servant derives from `Ice.Blobject` and implements its `ice_invoke` method, which receives the
encapsulation of the in-parameters and returns the success flag and the encapsulation of the reply:

```py
class Forwarder(Ice.Blobject):
    def __init__(self, target: Ice.ObjectPrx):
        self._target = target

    def ice_invoke(self, inParams: bytes, current: Ice.Current) -> tuple[bool, bytes]:
        return self._target.ice_invoke(current.operation, current.mode, inParams, current.ctx)
```

{% /language-section %}
