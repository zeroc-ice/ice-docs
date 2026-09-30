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
[_Slice language_](../slice). Slice allows you to define the client-server contract in a way that is independent of a
specific programming language, such as C++, Java, or C#.

## Slice Compilers

The Slice definitions are compiled by a compiler into an API for a specific programming language, that is, the part of
the API that is specific to the interfaces and types you have defined consists of generated code.

The rules that govern how each Slice construct is translated into a specific programming language are known as
_**language mappings**_. For example, for the C++ mapping, a Slice sequence appears as a `std::vector`, whereas, for the
Java mapping, a Slice sequence appears as a Java array. In order to determine what the API for a specific Slice
construct looks like, you only need the Slice definition and knowledge of the language mapping rules. The rules are
simple and regular enough to make it unnecessary to read the generated code to work out how to use the generated API.

Of course, you are free to peruse the generated code. However, as a rule, that is inefficient because the generated code
is not necessarily suitable for human consumption. We recommend that you familiarize yourself with the language mapping
rules; that way, you can mostly ignore the generated code and need to refer to it only when you are interested in some
specific detail.

Currently, Ice provides language mappings for C++, C#, Java, JavaScript, Python, Swift and, for the client side, MATLAB,
PHP and Ruby.

## See Also

- [The Slice Language](../slice)
