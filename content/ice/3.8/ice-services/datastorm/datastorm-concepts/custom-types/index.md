---
id: custom-types
title: Custom Types
---

DataStorm supports custom types for a topic’s `Key`, `Value`, and `UpdateTag`, as well as for the key and sample filter
criteria types.

All types used with DataStorm must support **encoding to** and **decoding from** a `std::vector<byte>`.

For **types defined in Slice**, DataStorm automatically uses the **Ice encoding**.

- For **built-in Slice types** (e.g., `string`, `int`, `float`), no additional steps are required.
- For **custom Slice types**, you must include the Slice-to-C++ generated code in your application.

### Example: Built-in Slice Types

```cpp
Topic<string, float> temperatures{node, "temperatures"};
```

In this example, DataStorm uses the Ice encoding for both string and float. No additional code or configuration is
needed because both string and float are [Slice built-in types](../basic-types).

### Example: Custom Slice Type

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

### **Example: Non-Slice Types**

If your types are **not defined in Slice**, you must provide specializations of the
[DataStorm::Encoder](https://code.zeroc.com/ice/3.8/api/cpp/structDataStorm_1_1Decoder.html) and
[DataStorm::Decoder](https://code.zeroc.com/ice/3.8/api/cpp/structDataStorm_1_1Decoder.html) templates for those types.

## Additional Requirements

For **partial updates**, DataStorm needs to clone values. By default, DataStorm performs cloning using the type’s **copy
constructor**.

In some cases, using the copy constructor may not be appropriate — for example, when the value is a `std::shared_ptr` or
another reference type that should not be deep-copied.

The [DataStorm::Cloner](https://code.zeroc.com/ice/3.8/api/cpp/structDataStorm_1_1Cloner.html) template allows
applications to customize how values are cloned for their own types. You can specialize this template to define a custom
clone behavior that suits your data types.

## Stringification

DataStorm converts types to strings using the `operator<<` overload for `std::ostream` in two scenarios:

- **Tracing** DataStorm traces include the string representation of keys. If a key type does not support string
  conversion via `operator<<`, DataStorm falls back to printing the key’s `typeid` and memory address.
- **Regex Filters** DataStorm provides a built-in `_regex` filter. The regular expression is applied to the string
  representation of the key or value, which requires that the type implement a valid `operator<<` overload.
