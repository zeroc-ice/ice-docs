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

{% language-section name="marshaling-the-in-parameters" %}

You marshal the in-parameters with an `OutputStream`. The following example invokes the `greet` operation of the
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

You unmarshal the reply with an `InputStream`. `throwException` unmarshals a user exception and throws it:

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
    try
    {
        inputStream.throwException();
    }
    catch (UserException)
    {
        inputStream.endEncapsulation();
        throw;
    }
}
```

{% /language-section %}

{% language-section name="forwarding-requests" %}

A forwarding dispatcher implements `Ice.Object` and its `dispatchAsync` method.

The [Ice forwarder demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/csharp/Ice/Forwarder) provides a complete
example of a forwarding server in C#.

{% /language-section %}
