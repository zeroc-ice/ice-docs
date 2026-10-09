{% language-section name="invoking-an-operation" %}

`ObjectPrx` provides a synchronous [`ice_invoke`](api:Ice/ObjectPrx.ice_invoke) and an asynchronous
[`ice_invokeAsync`](api:Ice/ObjectPrx.ice_invokeAsync), each with an overload that accepts a request context:

```java
package com.zeroc.Ice;

public interface ObjectPrx {
    Object.Ice_invokeResult ice_invoke(String operation, OperationMode mode, byte[] inParams);

    Object.Ice_invokeResult ice_invoke(
            String operation,
            OperationMode mode,
            byte[] inParams,
            Map<String, String> context);

    CompletableFuture<Object.Ice_invokeResult> ice_invokeAsync(
            String operation,
            OperationMode mode,
            byte[] inParams);

    CompletableFuture<Object.Ice_invokeResult> ice_invokeAsync(
            String operation,
            OperationMode mode,
            byte[] inParams,
            Map<String, String> context);
    ...
}
```

The result holds the success flag in its `returnValue` field and the encapsulation in its `outParams` field.

{% /language-section %}

{% language-section name="encoding-the-in-parameters" %}

You encode the in-parameters with an `OutputStream`. The following example invokes the `greet` operation of the
`Greeter` interface, which takes a `string` parameter:

```java
ObjectPrx greeter = ObjectPrx.createProxy(communicator, "greeter:tcp -h localhost -p 4061");

var outputStream = new OutputStream(communicator);
outputStream.startEncapsulation();
outputStream.writeString("alice");
outputStream.endEncapsulation();
byte[] inParams = outputStream.finished();

com.zeroc.Ice.Object.Ice_invokeResult result =
    greeter.ice_invoke("greet", OperationMode.Normal, inParams);
```

{% /language-section %}

{% language-section name="reading-the-reply" %}

You decode the reply with an `InputStream`. `throwException` decodes a user exception and throws it:

```java
var inputStream = new InputStream(communicator, result.outParams);
inputStream.startEncapsulation();
if (result.returnValue) {
    String greeting = inputStream.readString();
    inputStream.endEncapsulation();
} else {
    inputStream.throwException();
}
```

{% /language-section %}

{% language-section name="forwarding-requests" %}

A forwarding dispatcher implements `com.zeroc.Ice.Object` and its `dispatch` method:

```java
final class Forwarder implements com.zeroc.Ice.Object {
    private final ObjectPrx _target;

    Forwarder(ObjectPrx target) {
        _target = target;
    }

    @Override
    public CompletionStage<OutgoingResponse> dispatch(IncomingRequest request) {
        Current current = request.current;
        byte[] inParams = request.inputStream.readEncapsulation(null);
        return _target
            .ice_invokeAsync(current.operation, current.mode, inParams, current.ctx)
            .thenApply(result -> current.createOutgoingResponse(result.returnValue, result.outParams));
    }
}
```

The [Ice forwarder demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/java/Ice/forwarder) provides a complete example
of a forwarding server in Java.

Ice provides the `Blobject` and `BlobjectAsync` interfaces for backward compatibility: they implement `dispatch` by
calling an `ice_invoke` or `ice_invokeAsync` method that you implement. New code implements `dispatch` instead.

{% /language-section %}
