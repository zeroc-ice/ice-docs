---
title: Custom Types
---

DataStorm supports custom types for a topic’s `Key`, `Value`, and `UpdateTag`, as well as for the key and sample filter
criteria types.

All types used with DataStorm must support **encoding to** and **decoding from** a `std::vector<byte>`.

For **types defined in Slice**, DataStorm automatically uses the **Ice encoding**.

- For **built-in Slice types** (e.g., `string`, `int`, `float`), no additional steps are required.
- For **custom Slice types**, you must include the Slice-to-C++ generated code in your application.

## Example: Built-in Slice Types

```cpp
Topic<string, float> temperatures{node, "temperatures"};
```

In this example, DataStorm uses the Ice encoding for both string and float. No additional code or configuration is
needed because both string and float are [Slice built-in types](../../../../slice/basic-types).

## Example: Custom Slice Type

If you define a custom type in Slice, such as:

```slice
module ClearSky
{
    class AtmosphericConditions
    {
        /// The temperature in degrees Celsius.
        double temperature;

        /// The humidity in percent.
        double humidity;
    }
}
```

You must include the slice2cpp-generated code when building your application.

DataStorm will use the Ice encoding for both parameters:

- string is encoded as a built-in Slice type.
- `ClearSky::AtmosphericConditions` is encoded and decoded using the generated Slice code.

```cpp
Topic<string, ClearSky::AtmosphericConditionsPtr> temperatures{node, "temperatures"};
```

## Example: Non-Slice Types

By default, DataStorm encodes and decodes values with Ice streams. For a type that Ice streams cannot encode and decode,
you must provide specializations of the
[DataStorm::Encoder](https://code.zeroc.com/ice/3.8/api/cpp/structDataStorm_1_1Encoder.html) and
[DataStorm::Decoder](https://code.zeroc.com/ice/3.8/api/cpp/structDataStorm_1_1Decoder.html) templates for that type.

## Additional Requirements

DataStorm keeps keys, update tags, and filter criteria in ordered maps, so their types must be ordered by `std::less`,
which uses `operator<` unless you specialize it. A `Value` type must be default-constructible and copyable.

For **partial updates**, an updater modifies a clone of the previous value. The
[DataStorm::Cloner](https://code.zeroc.com/ice/3.8/api/cpp/structDataStorm_1_1Cloner.html) template creates this clone:
by default, it copies the value with its **copy constructor**, and for a `std::shared_ptr` to a Slice class, it calls
`ice_clone`, which copies the object but not the objects it references.

Specialize `Cloner` for your `Value` type when a copy shares state that an updater modifies, such as the object a
`std::shared_ptr` to a non-Slice type points to. Otherwise, the updater also modifies the previous values that readers
and writers keep.

## Stringification

DataStorm converts types to strings using the `operator<<` overload for `std::ostream` in two scenarios:

- **Tracing** DataStorm traces include the string representation of keys. If a key type does not support string
  conversion via `operator<<`, DataStorm falls back to printing the key’s `typeid` and memory address.
- **Regex Filters** DataStorm provides a built-in `_regex` filter. The regular expression is applied to the string
  representation of the key or value, which requires that the type implement a valid `operator<<` overload.
