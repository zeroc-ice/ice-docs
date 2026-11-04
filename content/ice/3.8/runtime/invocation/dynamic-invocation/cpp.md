{% language-section name="invoking-an-operation" %}

`Ice::ObjectPrx` provides a synchronous [`ice_invoke`](api:Ice/ObjectPrx.ice_invoke) and asynchronous
[`ice_invokeAsync`](api:Ice/ObjectPrx.ice_invokeAsync) overloads that return a future or accept callbacks.

{% /language-section %}

{% language-section name="marshaling-the-in-parameters" %}

You marshal the in-parameters with an `Ice::OutputStream`. The following example invokes the `greet` operation of the
`Greeter` interface, which takes a `string` parameter:

```cpp
Ice::ObjectPrx greeter{communicator, "greeter:tcp -h localhost -p 4061"};

Ice::OutputStream outputStream{communicator};
outputStream.startEncapsulation();
outputStream.write("alice");
outputStream.endEncapsulation();
std::vector<std::byte> inParams;
outputStream.finished(inParams);

std::vector<std::byte> outParams;
bool ok = greeter.ice_invoke("greet", Ice::OperationMode::Normal, inParams, outParams);
```

{% /language-section %}

{% language-section name="reading-the-reply" %}

You unmarshal the reply with an `Ice::InputStream`. `throwException` unmarshals a user exception and throws it:

```cpp
Ice::InputStream inputStream{communicator, outParams};
inputStream.startEncapsulation();
if (ok)
{
    std::string greeting;
    inputStream.read(greeting);
    inputStream.endEncapsulation();
}
else
{
    try
    {
        inputStream.throwException();
    }
    catch (const Ice::UserException&)
    {
        inputStream.endEncapsulation();
        throw;
    }
}
```

With the callback overload of `ice_invokeAsync`, the Ice runtime does not call `response` for a oneway or datagram
invocation: it calls `sent` once the transport accepts the request. When it adds a request to a batch, it calls none of
the callbacks.

{% /language-section %}

{% language-section name="forwarding-requests" %}

A forwarding dispatcher derives from `Ice::Object` and overrides `dispatch`.

The [Ice forwarder demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/cpp/Ice/forwarder) provides a complete example
of a forwarding server in C++.

{% /language-section %}
