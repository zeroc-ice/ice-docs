{% language-section name="general-metadata-directives" %}

The mapped skeleton member function for `getGrid` is:

```cpp
GetGridMarshaledResult getGrid(const Ice::Current& current) = 0;
```

where `GetGridMarshaledResult` is a generated class with a constructor that accepts a parameter for the return value,
followed by `Current`:

```cpp
// Generated server-side code
class GetGridMarshaledResult : public Ice::MarshaledResult
{
public:
    // Marshals returnValue immediately.
    GetGridMarshaledResult(const GridPtr& returnValue, const Ice::Current& current);
};
```

A typical implementation of the `getGrid` operation in your servant would be:

```cpp
GridServant::GetGridMarshaledResult
GridServant::getGrid(const Ice::Current& current)
{
   lock_guard lock(_mutex);
   // marshal _grid data member within synchronization
   return GetGridMarshaledResult{_grid, current};
}
```

{% /language-section %}

{% language-section name="language-specific-metadata-directives" %}

C++ metadata directives use the `cpp` prefix.

### cpp:array

`["cpp:array"]`. Applies to sequence parameters of operations.

This directive maps the parameter to a [pair of pointers](../user-defined-types/sequences).

### cpp:const

`["cpp:const"]`. Applies to operations.

This directive makes the pure virtual member function of the skeleton class `const`.

{% callout type="note" %}

The generated skeleton code calls servant member functions using a `shared_ptr<non-const-T>`. Adding this `const` only
affects your own servant implementation code.

{% /callout %}

### cpp:custom-print

`["cpp:custom-print"]`. Applies to enumerations, structs, classes, and exceptions.

This directive tells the Slice compiler that you implement the printing of this type yourself:

- For an enum `E`, the Slice compiler declares `std::ostream& operator<<(std::ostream&, E)` in the enclosing namespace,
  but does not implement this operator.
- For a struct `S`, the Slice compiler declares `std::ostream& operator<<(std::ostream&, const S&)` in the enclosing
  namespace, but does not implement this operator.
- For a class or exception, the Slice compiler declares the member function
  `void ice_print(std::ostream& os) const override` in the mapped C++ class, but does not implement this member
  function.

### cpp:dll-export

`[["cpp:dll-export:SYMBOL"]]`. Applies to a Slice file.

This directive lets you build the generated code into a DLL (on Windows) or a shared library (on other platforms): the
Slice compiler adds `SYMBOL` to the generated declarations that such a library exports. The generated header defines
`SYMBOL` to export these declarations when `SYMBOL_EXPORTS` is defined, and to import them otherwise; the generated
source file defines `SYMBOL_EXPORTS`.

### cpp:doxygen

`[["cpp:doxygen:include:header"]]`. Applies to a Slice file.

This directive adds a doc comment with `@headerfile` and `header` to all generated C++ classes.

### cpp:header-ext

`[["cpp:header-ext:extension"]]`. Applies to a Slice file.

This directive sets the file extension of the generated header file, instead of the default `.h`.

### cpp:identifier

`["cpp:identifier:name"]`. Applies to any definition, parameter, or field.

This directive maps the Slice construct to the C++ identifier `name`. For example:

```slice
struct Descriptor
{
    ["cpp:identifier:blueprint"]
    string template;
}
```

The field `template` maps to `blueprint` in C++, because `template` is a C++ keyword.

### cpp:ice_print

`["cpp:ice_print"]`. Applies to exceptions.

This directive is a deprecated alias for `cpp:custom-print`.

### cpp:include

`[["cpp:include:header"]]`. Applies to a Slice file.

This directive adds `#include <header>` to the generated header file, typically for a type you select with `cpp:type`.

### cpp:source-ext

`[["cpp:source-ext:extension"]]`. Applies to a Slice file.

This directive sets the file extension of the generated source file, instead of the default `.cpp`.

### cpp:source-include

`[["cpp:source-include:header"]]`. Applies to a Slice file.

This directive adds `#include <header>` to the generated source file, for example when the generated code needs the
complete definition of a type that the generated header does not include.

### cpp:type

`["cpp:type:type"]`, `["cpp:type:string"]`, or `["cpp:type:wstring"]`. Applies to sequences, dictionaries, and strings.

On a [sequence](../user-defined-types/sequences) or [dictionary](../user-defined-types/dictionaries), or on a parameter
or field of such a type, `cpp:type:type` maps it to the C++ type `type`.

Slice strings [map by default](../basic-types) to `std::string`. `cpp:type:wstring` maps them to `std::wstring` instead,
and `cpp:type:string` maps them back to `std::string`. You can apply these two directives to a use of `string`, such as
a field or a parameter, or to a module, interface, class, struct, or exception, where they apply to all the strings it
contains:

```slice
module A
{
    ["cpp:type:wstring"] struct Struct1
    {
        string s1; // Maps to std::wstring
        ["cpp:type:string"] string s2; // Maps to std::string
    }
}
```

### cpp:view-type

`["cpp:view-type:type"]`. Applies to sequence parameters of operations.

This directive maps the parameter to the C++ type `type`, a view that does not own the elements, where the generated
code only reads the sequence, such as an in parameter of a proxy function.

{% /language-section %}
