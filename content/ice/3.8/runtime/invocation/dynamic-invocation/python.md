{% language-section name="invoking-an-operation" %}

`Ice.ObjectPrx` provides a synchronous [`ice_invoke`](api:Ice/ObjectPrx.ice_invoke) and an asynchronous
[`ice_invokeAsync`](api:Ice/ObjectPrx.ice_invokeAsync):

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

{% language-section name="marshaling-the-in-parameters" %}

The Python mapping has no public stream API, so a Python application passes an encapsulation that it received already
marshaled, such as the in-parameters of a request that it forwards.

```py
proxy = Ice.ObjectPrx(communicator, "greeter:tcp -h localhost -p 4061")
ok, outParams = await proxy.ice_invokeAsync("greet", Ice.OperationMode.Normal, inParams)
```

{% /language-section %}

{% language-section name="forwarding-requests" %}

A forwarding servant derives from `Ice.Blobject` and implements its `ice_invoke` method, which receives the
encapsulation of the in-parameters and returns the success flag and the encapsulation of the reply, or an awaitable for
them, such as the one that `ice_invokeAsync` returns.

{% /language-section %}
