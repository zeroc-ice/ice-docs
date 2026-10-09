{% language-section name="invoking-an-operation" %}

`ObjectPrx` provides an asynchronous `ice_invoke`:

```swift
extension ObjectPrx {
    public func ice_invoke(
        operation: String,
        mode: OperationMode,
        inEncaps: Data,
        context: Context? = nil
    ) async throws -> (ok: Bool, outEncaps: Data)
    ...
}
```

{% /language-section %}

{% language-section name="encoding-the-in-parameters" %}

You encode the in-parameters with an `OutputStream`. The following example invokes the `greet` operation of the
`Greeter` interface, which takes a `string` parameter:

```swift
let greeter = try makeProxy(
    communicator: communicator,
    proxyString: "greeter:tcp -h localhost -p 4061",
    type: ObjectPrx.self)

let outputStream = OutputStream(communicator: communicator)
outputStream.startEncapsulation()
outputStream.write("alice")
outputStream.endEncapsulation()
let inEncaps = outputStream.finished()

let (ok, outEncaps) = try await greeter.ice_invoke(
    operation: "greet",
    mode: .normal,
    inEncaps: inEncaps)
```

{% /language-section %}

{% language-section name="reading-the-reply" %}

You decode the reply with an `InputStream`. `throwException` decodes a user exception and throws it:

```swift
let inputStream = InputStream(communicator: communicator, bytes: outEncaps)
try inputStream.startEncapsulation()
if ok {
    let greeting: String = try inputStream.read()
    try inputStream.endEncapsulation()
} else {
    try inputStream.throwException()
}
```

{% /language-section %}

{% language-section name="forwarding-requests" %}

A forwarding dispatcher adopts the `Dispatcher` protocol:

```swift
struct Forwarder: Dispatcher {
    let target: ObjectPrx

    func dispatch(_ request: sending IncomingRequest) async throws -> OutgoingResponse {
        let current = request.current
        let (inEncaps, _) = try request.inputStream.readEncapsulation()
        let (ok, outEncaps) = try await target.ice_invoke(
            operation: current.operation,
            mode: current.mode,
            inEncaps: inEncaps,
            context: current.ctx)
        return current.makeOutgoingResponse(ok: ok, encapsulation: outEncaps)
    }
}
```

{% /language-section %}
