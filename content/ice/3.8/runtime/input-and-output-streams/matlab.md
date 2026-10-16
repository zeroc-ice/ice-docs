{% language-section name="example" %}

```matlab
item = Inventory.Item('widget', 12);

outputStream = Ice.OutputStream();
outputStream.startEncapsulation(Ice.FormatType.CompactFormat);
Inventory.Item.ice_write(outputStream, item);
outputStream.endEncapsulation();
bytes = outputStream.finished();

inputStream = Ice.InputStream(communicator, communicator.getEncoding(), bytes);
inputStream.startEncapsulation();
decoded = Inventory.Item.ice_read(inputStream);
inputStream.endEncapsulation();
```

`Ice.OutputStream` takes an optional encoding version and class format, and `Ice.InputStream` takes the communicator,
the encoding version and the bytes to decode. `startEncapsulation` on an `OutputStream` takes the class format of the
encapsulation. `finished` returns a `uint8` row vector.

{% /language-section %}

{% language-section name="types" %}

| Slice type                   | Write                               | Read                                   |
| ---------------------------- | ----------------------------------- | -------------------------------------- |
| Structure or enumeration `T` | `T.ice_write(outputStream, value)`  | `T.ice_read(inputStream)`              |
| Sequence or dictionary `T`   | `T.write(outputStream, value)`      | `T.read(inputStream)`                  |
| Interface `I` (proxy)        | `outputStream.writeProxy(proxy)`    | `IPrx.ice_read(inputStream)`           |
| Class `C`                    | `outputStream.writeValue(instance)` | `inputStream.readValue(callback, 'C')` |
| Exception                    |                                     | `inputStream.throwException()`         |

For a sequence of a built-in type such as `int` or `string`, use the stream's own methods, such as `writeIntSeq` and
`readIntSeq`. `readValue` passes the instance to the callback, and takes the class name qualified with its package.
`throwException` reads an exception and throws it.

{% /language-section %}
