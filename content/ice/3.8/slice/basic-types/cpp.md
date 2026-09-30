{% language-section name="lang-1" %}

The built-in types are mapped to C++ types as shown in this table:

| **Slice** | **C++**                             |
| --------- | ----------------------------------- |
| bool      | `bool`                              |
| byte      | `std::uint8_t` or `std::byte`       |
| short     | `std::int16_t`                      |
| int       | `std::int32_t`                      |
| long      | `std::int64_t`                      |
| float     | `float`                             |
| double    | `double`                            |
| string    | `std::string` or `std::string_view` |

### Byte Mapping

A single byte is mapped to a `std::uint8_t` while a `sequence<byte>` is mapped to a `std::vector<std::byte>`.

### String Mapping

A string is usually mapped to a C++ `std::string`. In particular, string fields, sequence elements, and dictionary keys
and values, are always mapped to `std::string`. The mapping changes to `std::string_view` for individual string
parameters that the application gives to Ice for marshaling, such as input parameters in proxy functions.

### Wide String Mapping

You can use a metadata directive, `"cpp:type:wstring"`, to map strings to C++ `std::wstring` or `std::wstring_view`. For
containers (such as interfaces or structures), the metadata directive applies to all strings within the type. A
corresponding metadata directive, `"cpp:type:string"`, can be used to selectively override the mapping defined by the
enclosing container. For example:

```slice
["cpp:type:wstring"]
struct S1
{
    string x;                        // Maps to std::wstring
    ["cpp:type:wstring"] string y;   // Maps to std::wstring
    ["cpp:type:string"] string z;    // Maps to std::string
}

struct S2
{
    string x;                        // Maps to std::string
    ["cpp:type:string"] string y;    // Maps to std::string
    ["cpp:type:wstring"] string z;   // Maps to std::wstring
}
```

With these metadata directives, the strings are mapped as indicated by the comments.

### String Converters

On the wire, Ice [transmits](../basic-data-encoding) all strings as Unicode strings in UTF-8 encoding. For languages
other than C++, Ice uses strings in their language-native Unicode representation and converts automatically to and from
UTF-8 for transmission, so applications can transparently use characters from non-English alphabets.

However, for C++, how strings are represented inside a process depends on the platform as well as the mapping that is
chosen for a particular string.

By default, the Ice runtime encodes strings as follows:

- Narrow strings (that is, strings mapped to `std::string`) are presented to the application in UTF-8 encoding and,
  similarly, the application is expected to provide narrow strings in UTF-8 encoding to the Ice runtime for
  transmission.

  With this default behavior, the application code is responsible for converting between the native codeset for 8-bit
  characters and UTF-8. For example, if the native codeset is ISO Latin-1, the application is responsible for converting
  between UTF-8 and narrow (8-bit) characters in ISO Latin-1 encoding. The default behavior does not require the
  application to do anything if it only uses characters in the ASCII range. (This is because a string containing only
  characters in the (7-bit) ASCII range is also a valid UTF-8 string.)

- Wide strings (that is, strings mapped to `std::wstring`) are automatically encoded as Unicode by the Ice runtime as
  appropriate for the platform. For example, for Windows, the Ice runtime converts between UTF-8 and UTF-16 in
  little-endian representation whereas, for Linux, the Ice run time converts between UTF-8 and UTF-32 in the endian-ness
  appropriate for the host CPU.

  With this default behavior, wide strings are transparently converted between their on-the-wire representation and
  their native C++ representation as appropriate, so application code need not do anything special.

The default behavior of the runtime can be changed by providing application-specific string converters. If you install
such converters, all Slice strings will be passed to the appropriate converter when they are marshaled and unmarshaled.
Therefore, the string converters allow you to convert all strings transparently into their native representation without
having to insert explicit conversion calls whenever a string crosses a Slice interface boundary.

You can install string converters by calling `Ice::setProcessStringConverter` for the narrow string converter, and
`Ice::setProcessWstringConverter` for the wide string converter. Any strings that use the default (`std::string`)
mapping are passed through the specified narrow string converter and any strings that use the wide (`std::wstring`)
mapping are passed through the specified wide string converter. Passing `nullptr` to one of these set functions resets
the corresponding narrow or wide string converter to its default.

You can retrieve the previously installed string converters (or default string converters) with
`Ice::getProcessStringConverter` and `Ice::getProcessWstringConverter`. The default narrow string converter is null,
meaning Ice considers that all `std::string` are UTF-8. The default wide-string converter converts from UTF-16 or UTF-32
(depending on the size and endianness of the native wchar_t) to UTF-8.

{% callout type="warning" %}

Each communicator caches the narrow string converter and wide string converter installed when this communicator is
initialized. You should always install your string converters before creating your communicator(s).

{% /callout %}

{% /language-section %}
