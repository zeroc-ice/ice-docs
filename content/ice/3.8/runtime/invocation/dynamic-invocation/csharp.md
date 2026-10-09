{% language-section name="invoking-an-operation" %}

`Ice.ObjectPrx` provides a synchronous [`ice_invoke`](api:Ice/ObjectPrx.ice_invoke) and an asynchronous
[`ice_invokeAsync`](api:Ice/ObjectPrx.ice_invokeAsync):

```csharp
namespace Ice;

public interface ObjectPrx
{
    bool ice_invoke(
        string operation,
        OperationMode mode,
        byte[] inEncaps,
        out byte[] outEncaps,
        Dictionary<string, string>? context = null);

    Task<Object_Ice_invokeResult> ice_invokeAsync(
        string operation,
        OperationMode mode,
        byte[] inEncaps,
        Dictionary<string, string>? context = null,
        IProgress<bool>? progress = null,
        CancellationToken cancel = default);
    ...
}

public record struct Object_Ice_invokeResult(bool returnValue, byte[] outEncaps);
```

{% /language-section %}

{% language-section name="encoding-the-in-parameters" %}

You encode the in-parameters with an `OutputStream`. The following example invokes the `greet` operation of the
`Greeter` interface, which takes a `string` parameter:

```csharp
ObjectPrx greeter = ObjectPrxHelper.createProxy(
    communicator,
    "greeter:tcp -h localhost -p 4061");

var outputStream = new OutputStream(communicator);
outputStream.startEncapsulation();
outputStream.writeString("alice");
outputStream.endEncapsulation();
byte[] inEncaps = outputStream.finished();

Object_Ice_invokeResult result = await greeter.ice_invokeAsync(
    "greet",
    OperationMode.Normal,
    inEncaps);
```

{% /language-section %}

{% language-section name="reading-the-reply" %}

You decode the reply with an `InputStream`. `throwException` decodes a user exception and throws it:

```csharp
var inputStream = new InputStream(communicator, result.outEncaps);
inputStream.startEncapsulation();
if (result.returnValue)
{
    string greeting = inputStream.readString();
    inputStream.endEncapsulation();
}
else
{
    inputStream.throwException();
}
```

{% /language-section %}

{% language-section name="forwarding-requests" %}

A forwarding dispatcher implements `Ice.Object` and its `dispatchAsync` method:

```csharp
internal sealed class Forwarder : Ice.Object
{
    private readonly ObjectPrx _target;

    internal Forwarder(ObjectPrx target) => _target = target;

    public async ValueTask<OutgoingResponse> dispatchAsync(IncomingRequest request)
    {
        Current current = request.current;
        byte[] inEncaps = request.inputStream.readEncapsulation(out _);
        Object_Ice_invokeResult result = await _target.ice_invokeAsync(
            current.operation,
            current.mode,
            inEncaps,
            current.ctx);
        return current.createOutgoingResponse(result.returnValue, result.outEncaps);
    }
}
```

The [Ice forwarder demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/csharp/Ice/Forwarder) provides a complete
example of a forwarding server in C#.

Ice provides the `Ice.Blobject` and `Ice.BlobjectAsync` base classes for backward compatibility: they implement
`dispatchAsync` by calling an `ice_invoke` or `ice_invokeAsync` method that you override. New code implements
`dispatchAsync` instead.

{% /language-section %}
