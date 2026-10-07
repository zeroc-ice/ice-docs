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

{% language-section name="output-stream" %}

`com.zeroc.Ice.OutputStream` provides the following constructors:

```java
package com.zeroc.Ice;

public final class OutputStream {
    public OutputStream() { ... }
    public OutputStream(EncodingVersion encoding) { ... }
    public OutputStream(EncodingVersion encoding, boolean direct) { ... }
    public OutputStream(EncodingVersion encoding, FormatType format, boolean direct) { ... }
    public OutputStream(Communicator communicator) { ... }
    ...
}
```

Without a communicator, the constructors that take no format use the compact class format, and the constructor without
parameters also uses encoding 1.1. `direct` selects a direct `java.nio.ByteBuffer` for the stream's buffer.

{% /language-section %}

{% language-section name="input-stream" %}

`com.zeroc.Ice.InputStream` provides the following constructors:

```java
package com.zeroc.Ice;

public final class InputStream {
    public InputStream(Communicator communicator, byte[] data) { ... }
    public InputStream(Communicator communicator, java.nio.ByteBuffer buf) { ... }
    public InputStream(Communicator communicator, EncodingVersion encoding, byte[] data) { ... }
    public InputStream(Communicator communicator, EncodingVersion encoding, java.nio.ByteBuffer buf) { ... }
    ...
}
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

{% language-section name="classes" %}

`readValue` takes a callback, which the stream calls with the class instance once it decodes this instance:

```java
var outputStream = new com.zeroc.Ice.OutputStream(communicator);
outputStream.startEncapsulation();
outputStream.writeValue(product);
outputStream.writePendingValues();
outputStream.endEncapsulation();
byte[] bytes = outputStream.finished();

var inputStream = new com.zeroc.Ice.InputStream(communicator, bytes);
inputStream.startEncapsulation();
var decoded = new java.util.concurrent.atomic.AtomicReference<Product>();
inputStream.readValue(decoded::set, Product.class);
inputStream.readPendingValues();
inputStream.endEncapsulation();
```

The stream has called the callback once `readPendingValues` returns.

{% /language-section %}
