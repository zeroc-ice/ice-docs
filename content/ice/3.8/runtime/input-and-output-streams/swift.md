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
