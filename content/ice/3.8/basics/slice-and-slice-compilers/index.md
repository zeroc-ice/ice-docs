---
title: Slice and Slice Compilers
---

## Slice

A client and a server must agree on the operations the client can call and on the data they exchange. Ice defines this
contract in Slice, its [interface definition language](https://en.wikipedia.org/wiki/Interface_description_language)
(IDL), independently of any programming language.

For example, the [Greeter example](../../greeter-example/defining-the-greeter-interface-in-slice) defines its interface
in Slice as follows:

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

This definition declares an interface named `Greeter` with one operation, `greet`, which takes a string, the name of the
person to greet, and returns a string, the greeting.

Each [Ice object](../terminology#ice-objects) implements a Slice interface: the server implements its operations, and
the client calls them through a [proxy](../terminology#proxies). The client and the server use the same Slice
definitions, even when they are written in different programming languages. Besides interfaces, Slice defines the data
types that the operations exchange, such as structures, sequences, and classes; see [The Slice Language](../../slice).

## Slice Compilers

To use your Slice definitions from a programming language, you compile them with the Slice compiler for this language,
such as `slice2cpp` for C++ or `slice2py` for Python. The compiler generates:

- for each Slice interface, the proxy code that a client uses to call the interface's operations, and, for the language
  mappings that support servers, the skeleton code that a [servant](../terminology#servants) implements;
- for each Slice type, the corresponding type in this language.

The rules that govern how each Slice construct maps to a programming language are known as a _language mapping_. For
example, the C++ mapping maps a Slice sequence to a `std::vector`, whereas the Java mapping maps it to a Java array.
With the Slice definition and the mapping rules, you know what the generated API looks like without reading the
generated code.

Ice provides language mappings for C++, C#, Java, JavaScript, Python, Swift, and, for the client side, MATLAB, PHP, and
Ruby.

## See Also

- [The Slice Language](../../slice)
