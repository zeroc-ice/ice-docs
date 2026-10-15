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
