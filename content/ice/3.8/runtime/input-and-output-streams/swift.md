{% language-section name="example" %}

```swift
let item = Item(name: "widget", quantity: 12)

let outputStream = Ice.OutputStream(communicator: communicator)
outputStream.startEncapsulation()
outputStream.write(item)
outputStream.endEncapsulation()
let bytes = outputStream.finished()

let inputStream = Ice.InputStream(communicator: communicator, bytes: bytes)
try inputStream.startEncapsulation()
let decoded: Item = try inputStream.read()
try inputStream.endEncapsulation()
```

Foundation also defines `InputStream` and `OutputStream` classes, so qualify the Ice stream classes with `Ice.`.
`finished` returns `Data`.

{% /language-section %}

{% language-section name="output-stream" %}

`Ice.OutputStream` provides the following initializers:

```swift
public final class OutputStream {
    public init(encoding: EncodingVersion, format: FormatType)
    public convenience init(communicator: Communicator)
    public convenience init(communicator: Communicator, encoding: EncodingVersion)
    ...
}
```

The initializer that takes a communicator and an encoding version uses the communicator's class format.

{% /language-section %}

{% language-section name="input-stream" %}

`Ice.InputStream` provides the following initializers:

```swift
public final class InputStream {
    public convenience init(communicator: Communicator, bytes: Data)
    public required init(communicator: Communicator, encoding: EncodingVersion, bytes: Data)
    ...
}
```

{% /language-section %}

{% language-section name="encapsulations" %}

`startEncapsulation` supports one encapsulation per `Ice.OutputStream` or `Ice.InputStream`: calling it a second time on
the same stream, for a nested encapsulation or after the first encapsulation ends, is a precondition failure.

{% /language-section %}

{% language-section name="types" %}

| Slice type                   | Write                                           | Read                                         |
| ---------------------------- | ----------------------------------------------- | -------------------------------------------- |
| Structure or enumeration `T` | `outputStream.write(value)`                     | `let value: T = try inputStream.read()`      |
| Sequence or dictionary `T`   | `THelper.write(to: outputStream, value: value)` | `try THelper.read(from: inputStream)`        |
| Interface `I` (proxy)        | `outputStream.write(proxy)`                     | `try inputStream.read(IPrx.self)`            |
| Class `C`                    | `outputStream.write(instance)`                  | `try inputStream.read(C.self, cb: callback)` |
| Exception                    | `outputStream.write(error)`                     | `try inputStream.throwException()`           |

For a sequence of a built-in type such as `int` or `string`, use the stream's own `write` and `read` methods.
`throwException` reads an exception and throws it.

{% /language-section %}

{% language-section name="classes" %}

`read(_:cb:)` takes a callback, which the stream calls with the class instance once it decodes this instance:

```swift
let outputStream = Ice.OutputStream(communicator: communicator)
outputStream.startEncapsulation()
outputStream.write(product)
outputStream.writePendingValues()
outputStream.endEncapsulation()
let bytes = outputStream.finished()

let inputStream = Ice.InputStream(communicator: communicator, bytes: bytes)
try inputStream.startEncapsulation()
nonisolated(unsafe) var decoded: Product?
try inputStream.read(Product.self) { decoded = $0 }
try inputStream.readPendingValues()
try inputStream.endEncapsulation()
```

The stream has called the callback once `readPendingValues` returns.

{% /language-section %}
