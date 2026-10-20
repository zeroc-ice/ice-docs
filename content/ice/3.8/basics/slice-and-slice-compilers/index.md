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

A Slice compiler uses your Slice definitions to generate code for one programming language. For each Slice interface,
this generated code includes the proxy code that a client uses to call the interface's operations and the skeleton code
that a server implements; for each Slice type, it includes a type that carries the data.

The rules that govern how each Slice construct maps to a programming language are collectively known as a _**language
mapping**_. For example, the C++ mapping maps a Slice sequence to a `std::vector`, whereas the Java mapping maps it to a
Java array. The Slice definition and the mapping rules tell you what the generated API looks like; you need to read the
generated code only to check a specific detail.

Currently, Ice provides language mappings for C++, C#, Java, JavaScript, Python, Swift, and, for the client side,
MATLAB, PHP, and Ruby.

## See Also

- [The Slice Language](../../slice)
