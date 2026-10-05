{% language-section name="mapping" %}

Slice structures map to C++ structures with the same name. For each Slice field, the C++ structure contains a public
data member. For example, here is our Employee structure once more:

```slice
struct Employee
{
    long number;
    string firstName;
    string lastName;
}
```

The Slice-to-C++ compiler generates the following definitions for this structure:

```cpp
struct Employee
{
    std::int64_t number;
    std::string firstName;
    std::string lastName;

    [[nodiscard]]
    std::tuple<const std::int64_t&, const std::string&, const std::string&> ice_tuple() const;
};

std::ostream& operator<<(std::ostream& os, const Employee& value);
```

For each field in the Slice definition, the C++ structure contains a corresponding public data member of the same name.
Constructors are intentionally omitted so that the C++ structure qualifies as a _plain old datatype_ (POD).

### Comparison Operators

The generated C++ structures use templated comparison operators included from Ice.

```cpp
// !=, <, <=, >, >=  are implemented in the same manner
template<
    class T,
    std::enable_if_t<
        std::is_member_function_pointer_v<decltype(&T::ice_tuple)> &&
            !std::is_polymorphic_v<T>, bool> = true>
inline bool operator==(const T& lhs, const T& rhs)
{
    return lhs.ice_tuple() == rhs.ice_tuple();
}
```

These operators compare the `std::tuple` returned by the generated `ice_tuple()` function.

### Default Constructor

Structures have a default constructor that default-constructs each data member. Members having a complex type, such as
strings, sequences, and dictionaries, are initialized by their own default constructor. However, the default constructor
performs no initialization for members having one of the simple built-in types boolean, integer, floating point, or
enumeration. For such a member, it is not safe to assume that the member has a reasonable default value. This is
especially true for enumerated types as the member's default value may be outside the legal range for the enumeration,
in which case an exception will occur during marshaling unless the member is explicitly set to a legal value.

To ensure that data members of primitive types are initialized to reasonable values, you can declare default values in
your Slice definition. These default values are mapped to C++ data member initializers.

### Printing Structs

The Slice compiler generates an `operator<<` that prints the C++ structure, including the value of all its data members:

```cpp
std::ostream& operator<<(std::ostream& os, const Employee& value);
```

You can suppress the generation of this operator, and tell the Slice compiler you’ll provide your own custom operator<<,
with the `"cpp:custom-print"` metadata. For example:

```slice
// We'll provide our own custom operator<< for this struct.
["cpp:custom-print"]
struct Employee
{
    long number;
    string firstName;
    string lastName;
}
```

{% /language-section %}
