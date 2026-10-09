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

{% language-section name="output-stream" %}

`Ice.OutputStream` provides the following constructors:

```csharp
namespace Ice;

public sealed class OutputStream
{
    public OutputStream(EncodingVersion? encoding = null, FormatType format = FormatType.CompactFormat);

    public OutputStream(Communicator communicator);
    ...
}
```

A `null` encoding is encoding 1.1.

{% /language-section %}

{% language-section name="input-stream" %}

`Ice.InputStream` provides the following constructors:

```csharp
namespace Ice;

public sealed class InputStream
{
    public InputStream(Communicator communicator, byte[] data);

    public InputStream(Communicator communicator, EncodingVersion encoding, byte[] data);
    ...
}
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

{% language-section name="classes" %}

`readValue` takes a callback, which the stream calls with the class instance once it decodes this instance:

```csharp
var outputStream = new Ice.OutputStream(communicator);
outputStream.startEncapsulation();
outputStream.writeValue(product);
outputStream.writePendingValues();
outputStream.endEncapsulation();
byte[] bytes = outputStream.finished();

var inputStream = new Ice.InputStream(communicator, bytes);
inputStream.startEncapsulation();
Inventory.Product? decoded = null;
inputStream.readValue<Inventory.Product>(value => decoded = value);
inputStream.readPendingValues();
inputStream.endEncapsulation();
```

The stream has called the callback once `readPendingValues` returns.

{% /language-section %}
