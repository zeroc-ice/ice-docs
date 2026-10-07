{% language-section name="example" %}

```cpp
Inventory::Item item{"widget", 12};

Ice::OutputStream out{communicator};
out.startEncapsulation();
out.write(item);
out.endEncapsulation();
std::vector<std::byte> bytes;
out.finished(bytes);

Ice::InputStream in{communicator, bytes};
in.startEncapsulation();
Inventory::Item decoded;
in.read(decoded);
in.endEncapsulation();
```

{% /language-section %}

{% language-section name="output-stream" %}

`Ice::OutputStream` provides the following constructors:

```cpp
namespace Ice
{
    class OutputStream
    {
    public:
        OutputStream(
            EncodingVersion encoding = Encoding_1_1,
            FormatType format = FormatType::CompactFormat,
            StringConverterPtr stringConverter = nullptr,
            WstringConverterPtr wstringConverter = nullptr);

        OutputStream(const CommunicatorPtr& communicator, EncodingVersion encoding);

        OutputStream(const CommunicatorPtr& communicator);
        ...
    };
}
```

A stream created from a communicator also uses the communicator's string converters.

`finished(std::vector<std::byte>& bytes)` copies the encoded bytes into `bytes`. The `finished()` overload without
parameters returns a pair of pointers to the stream's own buffer instead; these pointers remain valid as long as the
stream.

{% /language-section %}

{% language-section name="input-stream" %}

`Ice::InputStream` provides the following constructors:

```cpp
namespace Ice
{
    class InputStream
    {
    public:
        InputStream(
            const CommunicatorPtr& communicator,
            const std::vector<std::byte>& bytes,
            SliceLoaderPtr sliceLoader = nullptr);

        InputStream(
            const CommunicatorPtr& communicator,
            std::pair<const std::byte*, const std::byte*> bytes,
            SliceLoaderPtr sliceLoader = nullptr);

        InputStream(
            const CommunicatorPtr& communicator,
            EncodingVersion encoding,
            const std::vector<std::byte>& bytes,
            SliceLoaderPtr sliceLoader = nullptr);

        InputStream(
            const CommunicatorPtr& communicator,
            EncodingVersion encoding,
            std::pair<const std::byte*, const std::byte*> bytes,
            SliceLoaderPtr sliceLoader = nullptr);
        ...
    };
}
```

When you give a Slice loader, the stream uses it instead of the communicator's Slice loader.

The `InputStream` reads the bytes in place, without copying them: keep these bytes alive and unchanged while you use the
stream.

{% /language-section %}

{% language-section name="types" %}

`write` and `read` are templates that accept any type the Slice compiler generates:

| Slice type                 | Write                       | Read                  |
| -------------------------- | --------------------------- | --------------------- |
| Structure                  | `out.write(item)`           | `in.read(item)`       |
| Enumeration                | `out.write(color)`          | `in.read(color)`      |
| Sequence or dictionary     | `out.write(items)`          | `in.read(items)`      |
| Proxy (`std::optional<P>`) | `out.write(proxy)`          | `in.read(proxy)`      |
| Class (`std::shared_ptr`)  | `out.write(instance)`       | `in.read(instance)`   |
| Exception                  | `out.writeException(error)` | `in.throwException()` |

`throwException` reads an exception and throws it.

{% /language-section %}

{% language-section name="classes" %}

```cpp
std::shared_ptr<Inventory::Product> product = ...;

Ice::OutputStream out{communicator};
out.startEncapsulation();
out.write(product);
out.writePendingValues();
out.endEncapsulation();
std::vector<std::byte> bytes;
out.finished(bytes);

Ice::InputStream in{communicator, bytes};
in.startEncapsulation();
std::shared_ptr<Inventory::Product> decoded;
in.read(decoded);
in.readPendingValues();
in.endEncapsulation();
```

`decoded` holds the class instance once `readPendingValues` returns.

{% /language-section %}
