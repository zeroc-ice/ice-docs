{% language-section name="lang-1" %}

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
GetGridMarshaledResult
GridServant::getGrid(const Ice::Current& current)
{
   lock_guard lock(_mutex);
   // marshal _grid data member within synchronization
   return GetGridMarshaledResult{_grid, current};
}
```

{% /language-section %}

{% language-section name="lang-2" %}

The metadata directives for C++ uses the `cpp` prefix.

### `cpp:array`

This directive applies to sequence parameters in operations. It directs the Slice compiler to map these parameters to
[pairs of pointers](../sequences).

### `cpp:const`

This directive applies to operations. It directs the Slice compiler to create a `const` pure virtual member function for
the skeleton class.

{% callout type="info" %}

The generated skeleton code calls servant member functions using a `shared_ptr<non-const-T>`. Adding this `const` only
affects your own servant implementation code.

{% /callout %}

### `cpp:custom-print`

This directive applies to enumerations, structs, classes and exceptions. It tells the Slice compiler that you want to
implement your own “custom print” for this type, and not rely on the compiler-generated print implementation.

For an enum E, the Slice compiler generates a declaration for `std::ostream& operator<<(std::ostream&, E)` in the
enclosing namespace, but does not implement this operator.

For a struct S, the Slice compiler generates a declaration for `std::ostream& operator<<(std::ostream&, const S&)` in
the enclosing namespace, but does not implement this operator.

For a class or exception C, the Slice compiler generates a declaration for the member function
`void ice_print(std::ostream& os) const override` in the mapped C++ class, but does not implement this member function.

### `cpp:dll-export:SYMBOL`

This file directive applies to all definitions in a Slice file.

Use `SYMBOL` to control the export and import of symbols from DLLs on Windows and shared libraries on other platforms.
This option allows you to export symbols from the generated code, and place such generated code in a DLL (on Windows) or
shared library (on other platforms). As an example, compiling a Slice file `Widget.ice` with:

```slice
[["cpp:dll-export:WIDGET_API"]]
```

results in the following additional code being generated into `Widget.h`:

```cpp
#ifndef WIDGET_API
#   if defined(ICE_STATIC_LIBS)
#       define WIDGET_API /**/
#   ifdef WIDGET_API_EXPORTS
#       define WIDGET_API ICE_DECLSPEC_EXPORT
#   else
#       define WIDGET_API ICE_DECLSPEC_IMPORT
#   endif
#endif
```

The generated code also includes the provided `SYMBOL` name (`WIDGET_API` in our example) in the declaration of classes
and functions that need to be exported (when building a DLL or shared library) or imported (when using such library).

`ICE_DECLSPEC_EXPORT` and `ICE_DECLSPEC_IMPORT` are macros that expand to compiler-specific attributes. For example, for
Visual Studio, they are defined as:

```cpp
#if defined(_MSC_VER)
#   define ICE_DECLSPEC_EXPORT __declspec(dllexport)
#   define ICE_DECLSPEC_IMPORT __declspec(dllimport)
```

With GCC and clang, they are defined as:

```cpp
#elif defined(__GNUC__) || defined(__clang__)
#   define ICE_DECLSPEC_EXPORT __attribute__((visibility ("default")))
#   define ICE_DECLSPEC_IMPORT __attribute__((visibility ("default")))
```

The generated .cpp file (`Widget.cpp` in our example) defines `SYMBOL_EXPORTS`; this way, you don't need to do anything
special when compiling generated files.

### `cpp:doxygen:include:c++-header`

This file directive instructs the Slice compiler to generate a doc-comment with `@headerfile` and the specified C++
header for all generated C++ classes.

### `cpp:header-ext:c++-ext`

This file directive allows you to use a file extension for C++ header files other than the default `.h` extension.

### `cpp:identifier:c++-identifier`

This directive applies to all Slice constructs, and instructs the Slice compiler to use the specified `c++-identifier`.

For example:

```slice
struct Descriptor
{
    ["cpp:identifier:blueprint"]
    string template;
}
```

The `cpp:identifier` directive ensures the field `template` is mapped to `blueprint` in C++. We can’t use the default
mapping (`template`) since it’s a C++ keyword.

### `cpp:ice_print`

This directive applies to exceptions. It is a deprecated alias for `cpp:custom-print`.

### `cpp:include:c++-header`

This file directive allows you to inject additional `#include` directives into the generated C++ header file. This is
useful when using the `cpp:type` metadata.

### `cpp:source-ext:c++-ext`

This file directive allows you to use a file extension for C++ source files other than the default `.cpp` extension.

### `cpp:source-include:c++-header`

This file directive allows you to inject additional `#include` directives into the generated C++ source file. This is
required to make forward declared types visible to the source files.

### `cpp:type:c++-type`

This directive applies to [sequences](../sequences) and [dictionaries](../dictionaries). It directs the Slice compiler
to map the Slice type or parameter to the provided C++ type.

### `cpp:type:string` and `cpp:type:wstring`

These directives apply to fields of type string as well as to containers, such as structures, classes and exceptions.
String fields [map by default](../basic-types) to `std::string`. You can use the `cpp:type:wstring` metadata to cause a
string field (or all string fields in a structure, class or exception) to map to `std::wstring` instead. Use the
`cpp:type:string` metadata to force string fields to use the default mapping regardless of any enclosing metadata.

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

### `cpp:view-type:c++-view-type`

This directive applies to sequence parameters. It directs the Slice compiler to map this parameter to the provided C++
type when this parameter does not need to hold any memory, for example when mapping an in-parameter to a proxy function.

{% /language-section %}
