{% language-section name="invoking-an-operation" %}

`Ice::ObjectPrx` provides a synchronous `ice_invoke` and two asynchronous `ice_invokeAsync` overloads, one returning a
future and one accepting callbacks:

```cpp
namespace Ice
{
    class ObjectPrx
    {
    public:
        bool ice_invoke(
            std::string_view operation,
            OperationMode mode,
            const std::vector<std::byte>& inParams,
            std::vector<std::byte>& outParams,
            const Context& context = noExplicitContext) const;

        std::future<std::tuple<bool, std::vector<std::byte>>> ice_invokeAsync(
            std::string_view operation,
            OperationMode mode,
            const std::vector<std::byte>& inParams,
            const Context& context = noExplicitContext) const;

        std::function<void()> ice_invokeAsync(
            std::string_view operation,
            OperationMode mode,
            const std::vector<std::byte>& inParams,
            std::function<void(bool, std::vector<std::byte>)> response,
            std::function<void(std::exception_ptr)> ex = nullptr,
            std::function<void(bool)> sent = nullptr,
            const Context& context = noExplicitContext) const;
        ...
    };
}
```

Each of these functions has an overload that accepts the in-parameters as a
`std::pair<const std::byte*, const std::byte*>` instead of a vector. The callback overload in this form passes the reply
to `response` as a pair of pointers into a buffer that the Ice runtime owns; copy the bytes if you need them after
`response` returns.

{% /language-section %}

{% language-section name="encoding-the-in-parameters" %}

You encode the in-parameters with an `Ice::OutputStream`. The following example invokes the `greet` operation of the
`Greeter` interface, which takes a `string` parameter:

```cpp
Ice::ObjectPrx greeter{communicator, "greeter:tcp -h localhost -p 4061"};

Ice::OutputStream outputStream{communicator};
outputStream.startEncapsulation();
outputStream.write(std::string{"alice"});
outputStream.endEncapsulation();
std::vector<std::byte> inParams;
outputStream.finished(inParams);

std::vector<std::byte> outParams;
bool ok = greeter.ice_invoke("greet", Ice::OperationMode::Normal, inParams, outParams);
```

{% /language-section %}

{% language-section name="reading-the-reply" %}

You decode the reply with an `Ice::InputStream`. `throwException` decodes a user exception and throws it:

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
    inputStream.throwException();
}
```

With the callback overload of `ice_invokeAsync`, the Ice runtime does not call `response` for a oneway or datagram
invocation: it calls `sent` once the transport accepts the request. When it adds a request to a batch, it calls none of
the callbacks.

{% /language-section %}

{% language-section name="forwarding-requests" %}

A forwarding dispatcher derives from `Ice::Object` and overrides `dispatch`:

```cpp
class Forwarder final : public Ice::Object
{
public:
    explicit Forwarder(Ice::ObjectPrx target) : _target{std::move(target)} {}

    void dispatch(
        Ice::IncomingRequest& request,
        std::function<void(Ice::OutgoingResponse)> sendResponse) final
    {
        const Ice::Current& current = request.current();
        const std::byte* inEncaps;
        std::int32_t size;
        request.inputStream().readEncapsulation(inEncaps, size);

        _target.ice_invokeAsync(
            current.operation,
            current.mode,
            {inEncaps, inEncaps + size},
            [sendResponse, current](bool ok, std::pair<const std::byte*, const std::byte*> outEncaps)
            { sendResponse(Ice::makeOutgoingResponse(ok, outEncaps, current)); },
            [sendResponse, current](std::exception_ptr ex)
            { sendResponse(Ice::makeOutgoingResponse(ex, current)); },
            nullptr,
            current.ctx);
    }

private:
    Ice::ObjectPrx _target;
};
```

Ice provides the `Ice::Blobject`, `Ice::BlobjectArray`, `Ice::BlobjectAsync`, and `Ice::BlobjectArrayAsync` base classes
for backward compatibility: they implement `dispatch` by calling an `ice_invoke` or `ice_invokeAsync` function that you
override. New code overrides `dispatch` instead.

{% /language-section %}
