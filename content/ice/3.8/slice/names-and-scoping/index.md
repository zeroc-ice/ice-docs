---
title: Names and Scoping
---

The Slice compiler resolves an identifier in the scope where you use it. This page gives the rules for declaring
identifiers in a scope and for referring to them.

## Naming Scopes

The global scope, [modules](../modules), [interfaces](../interfaces), [classes](../user-defined-types/classes),
[structs](../user-defined-types/structures), [exceptions](../exceptions),
[enumerations](../user-defined-types/enumerations), and the parameter list of an [operation](../operations) each form a
naming scope. Within a scope, each identifier must be unique, and identifiers that differ only in capitalization are the
same identifier; see [Case Sensitivity](../lexical-rules#case-sensitivity). Reopening a module and defining a
forward-declared class or interface do not count as redefinitions.

```slice
interface Bad
{
    void op(int value, string value); // Error: duplicate parameter name
}
```

## Qualified Names

The scope-qualification operator `::` refers to a definition in another scope:

```slice
module Types
{
    sequence<long> LongSeq;
}

module MyApp
{
    sequence<Types::LongSeq> NumberTree;
}
```

`Types::LongSeq` refers to the `LongSeq` sequence of module `Types`. The compiler resolves a name that starts with `::`
from the global scope: `::Types::LongSeq` is the fully qualified name of this sequence.

## Names in Nested Scopes

An identifier defined in an inner scope hides the same identifier in an enclosing scope. A qualified name still refers
to the hidden definition:

```slice
module Outer
{
    sequence<string> Seq;

    module Inner
    {
        sequence<short> Seq;

        struct Example
        {
            Seq a;          // Sequence of short
            ::Outer::Seq b; // Sequence of string
        }
    }
}
```

An operation cannot have the name of its enclosing interface, whatever its capitalization.

## Name Lookup Rules

To resolve a name that does not start with `::`, the compiler searches the definitions that precede it in the current
scope, then each enclosing scope in turn, up to the global scope. It never takes a name from a base interface or class:

```slice
module M
{
    sequence<double> Seq;

    module A
    {
        sequence<string> Seq;

        interface Base
        {
            Seq getBase();     // Sequence of string
        }
    }

    module B
    {
        interface Derived extends A::Base
        {
            Seq getDerived();  // Sequence of double
        }
    }
}
```

In `A::Base`, `Seq` is `M::A::Seq`. In `B::Derived`, it is `M::Seq`, even though `Derived` extends `A::Base`.

## Hiding a Used Identifier

A scope cannot hide an identifier it has already used. A qualified name such as `M::Seq` uses only `M`, and a fully
qualified name such as `::M::Seq` uses no identifier of the current scope:

```slice
module M
{
    sequence<string> Seq;

    interface Bad
    {
        Seq op1();
        int Seq();      // Error: Seq has changed meaning
    }

    interface Good
    {
        ::M::Seq op1();
        int Seq();      // OK
    }
}
```

In `Bad`, `op1` uses `Seq`, so an operation named `Seq` cannot hide it. In `Good`, `::M::Seq` uses no identifier of
`Good`, so `Seq` can name an operation.

## Parameter and Field Names

A parameter can reuse an identifier from an enclosing scope, such as the name of its operation or of a type:

```slice
module M
{
    sequence<string> Seq;

    interface I
    {
        string query(string query); // OK
        void op(Seq Seq);           // OK
    }
}
```

A field can likewise reuse an identifier from an enclosing scope.

## See Also

- [Lexical Rules](../lexical-rules)
- [Forward Declarations](../forward-declarations)
