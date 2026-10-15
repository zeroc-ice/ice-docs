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

`finished(std::vector<std::byte>& bytes)` copies the encoded bytes into `bytes`. The `finished()` overload without
parameters returns a pair of pointers to the stream's own buffer instead; these pointers remain valid for the lifetime
of the stream.

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
