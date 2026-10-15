{% language-section name="example" %}

```java
var item = new Item("widget", 12);

var outputStream = new com.zeroc.Ice.OutputStream(communicator);
outputStream.startEncapsulation();
Item.ice_write(outputStream, item);
outputStream.endEncapsulation();
byte[] bytes = outputStream.finished();

var inputStream = new com.zeroc.Ice.InputStream(communicator, bytes);
inputStream.startEncapsulation();
Item decoded = Item.ice_read(inputStream);
inputStream.endEncapsulation();
```

{% /language-section %}

{% language-section name="types" %}

| Slice type                   | Write                                | Read                                          |
| ---------------------------- | ------------------------------------ | --------------------------------------------- |
| Structure or enumeration `T` | `T.ice_write(outputStream, value)`   | `T.ice_read(inputStream)`                     |
| Sequence or dictionary `T`   | `THelper.write(outputStream, value)` | `THelper.read(inputStream)`                   |
| Interface `I` (proxy)        | `outputStream.writeProxy(proxy)`     | `IPrx.uncheckedCast(inputStream.readProxy())` |
| Class `C`                    | `outputStream.writeValue(instance)`  | `inputStream.readValue(callback, C.class)`    |
| Exception                    | `outputStream.writeException(error)` | `inputStream.throwException()`                |

`throwException` reads an exception and throws it.

{% /language-section %}
