{% language-section name="example" %}

```js
const item = new Inventory.Item("widget", 12);

const outputStream = new Ice.OutputStream(communicator);
outputStream.startEncapsulation();
Inventory.Item.write(outputStream, item);
outputStream.endEncapsulation();
const bytes = outputStream.finished();

const inputStream = new Ice.InputStream(communicator, bytes);
inputStream.startEncapsulation();
const decoded = Inventory.Item.read(inputStream);
inputStream.endEncapsulation();
```

`finished` returns a `Uint8Array`.

{% /language-section %}

{% language-section name="output-stream" %}

`Ice.OutputStream` provides the following constructors:

```ts
class OutputStream {
    constructor(communicator: Communicator);
    constructor(encoding?: EncodingVersion, format?: FormatType);
    ...
}
```

Without a communicator, the stream uses encoding 1.1 when you give no encoding, and the compact class format when you
give no format.

{% /language-section %}

{% language-section name="input-stream" %}

`Ice.InputStream` provides the following constructors:

```ts
class InputStream {
    constructor(communicator: Communicator, buffer: Uint8Array | ArrayBuffer);
    constructor(communicator: Communicator, encoding: EncodingVersion, buffer: Uint8Array | ArrayBuffer);
    ...
}
```

{% /language-section %}

{% language-section name="types" %}

| Slice type                 | Write                                | Read                                 |
| -------------------------- | ------------------------------------ | ------------------------------------ |
| Structure `S`              | `S.write(outputStream, value)`       | `S.read(inputStream)`                |
| Enumeration `E`            | `outputStream.writeEnum(value)`      | `inputStream.readEnum(E)`            |
| Sequence or dictionary `T` | `THelper.write(outputStream, value)` | `THelper.read(inputStream)`          |
| Interface `I` (proxy)      | `outputStream.writeProxy(proxy)`     | `inputStream.readProxy(IPrx)`        |
| Class `C`                  | `outputStream.writeValue(instance)`  | `inputStream.readValue(callback, C)` |
| Exception                  | `outputStream.writeException(error)` | `inputStream.throwException()`       |

`throwException` reads an exception and throws it.

{% /language-section %}

{% language-section name="classes" %}

`readValue` takes a callback, which the stream calls with the class instance once it decodes this instance:

```js
const outputStream = new Ice.OutputStream(communicator);
outputStream.startEncapsulation();
outputStream.writeValue(product);
outputStream.writePendingValues();
outputStream.endEncapsulation();
const bytes = outputStream.finished();

const inputStream = new Ice.InputStream(communicator, bytes);
inputStream.startEncapsulation();
let decoded = null;
inputStream.readValue(value => {
    decoded = value;
}, Inventory.Product);
inputStream.readPendingValues();
inputStream.endEncapsulation();
```

The stream has called the callback once `readPendingValues` returns.

{% /language-section %}
