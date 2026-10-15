---
title: Slice and Slice Compilers
---

## IDL

Slice is Ice’s [Interface Definition Language](https://en.wikipedia.org/wiki/Interface_description_language) (IDL). It
allows you to describe your network API in a clear and concise manner.

Defining the customary Greeter interface in Slice is straightforward:

```slice
/// Represents a simple greeter.
interface Greeter
{
    /// Creates a personalized greeting.
    /// @param name The name of the person to greet.
    /// @return The greeting.
    string greet(string name);
}
```

With Ice, each [Ice object](../terminology) implements a Slice interface with one or more operations.

Interfaces, operations, and the types of data that are exchanged between client and server are defined using the
[_Slice language_](../../slice). Slice allows you to define the client-server contract in a way that is independent of a
specific programming language, such as C++, Java, or C#.

## Slice Compilers

A Slice compiler translates your Slice definitions into code for one programming language. This generated code is the
part of your API that is specific to the interfaces and types you defined, such as the proxy types you use to call
operations and the types that carry your data.

The rules that govern how each Slice construct maps to a programming language are known as _**language mappings**_. For
example, the C++ mapping maps a Slice sequence to a `std::vector`, whereas the Java mapping maps it to a Java array. The
Slice definition and the mapping rules tell you what the generated API looks like; you need to read the generated code
only to check a specific detail.

Currently, Ice provides language mappings for C++, C#, Java, JavaScript, Python, Swift and, for the client side, MATLAB,
PHP and Ruby.

## See Also

- [The Slice Language](../../slice)
