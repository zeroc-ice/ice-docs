{% language-section name="example" %}

```csharp
var item = new Inventory.Item("widget", 12);

var outputStream = new Ice.OutputStream(communicator);
outputStream.startEncapsulation();
Inventory.Item.ice_write(outputStream, item);
outputStream.endEncapsulation();
byte[] bytes = outputStream.finished();

var inputStream = new Ice.InputStream(communicator, bytes);
inputStream.startEncapsulation();
Inventory.Item decoded = Inventory.Item.ice_read(inputStream);
inputStream.endEncapsulation();
```

{% /language-section %}

{% language-section name="types" %}

| Slice type                 | Write                                   | Read                                 |
| -------------------------- | --------------------------------------- | ------------------------------------ |
| Structure `S`              | `S.ice_write(outputStream, value)`      | `S.ice_read(inputStream)`            |
| Enumeration `E`            | `EHelper.write(outputStream, value)`    | `EHelper.read(inputStream)`          |
| Sequence or dictionary `T` | `THelper.write(outputStream, value)`    | `THelper.read(inputStream)`          |
| Interface `I` (proxy)      | `IPrxHelper.write(outputStream, proxy)` | `IPrxHelper.read(inputStream)`       |
| Class `C`                  | `outputStream.writeValue(instance)`     | `inputStream.readValue<C>(callback)` |
| Exception                  | `outputStream.writeException(error)`    | `inputStream.throwException()`       |

`throwException` reads an exception and throws it.

{% /language-section %}
