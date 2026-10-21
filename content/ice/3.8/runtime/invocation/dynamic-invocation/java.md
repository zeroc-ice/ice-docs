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

{% language-section name="marshaling-the-in-parameters" %}

You marshal the in-parameters with an `OutputStream`. The following example invokes the `greet` operation of the
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

You unmarshal the reply with an `InputStream`. `throwException` unmarshals a user exception and throws it:

```java
var inputStream = new InputStream(communicator, result.outParams);
inputStream.startEncapsulation();
if (result.returnValue) {
    String greeting = inputStream.readString();
    inputStream.endEncapsulation();
} else {
    try {
        inputStream.throwException();
    } catch (UserException ex) {
        inputStream.endEncapsulation();
        throw ex;
    }
}
```

{% /language-section %}

{% language-section name="forwarding-requests" %}

A forwarding dispatcher implements `com.zeroc.Ice.Object` and its `dispatch` method.

The [Ice forwarder demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/java/Ice/forwarder) provides a complete example
of a forwarding server in Java.

{% /language-section %}
