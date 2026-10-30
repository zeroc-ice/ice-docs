---
title: Forward Declarations
---

[Interfaces](../interfaces) and [classes](../user-defined-types/classes) can be forward declared, so that you can use
them before their definition. This lets you write definitions that refer to each other, for example:

```slice
module Family
{
    interface Child;            // Forward declaration

    sequence<Child*> Children;

    interface Parent
    {
        Children getChildren();
    }

    interface Child             // Definition
    {
        Parent* getMother();
        Parent* getFather();
    }
}
```

You can use a forward-declared class, or the [proxy type](../interfaces/proxy-types) of a forward-declared interface, as
the element type of a sequence, the value type of a dictionary, the type of a field, and the type of an operation
parameter or return value.

You can extend a forward-declared class or interface only after its definition:

```slice
interface Base;                         // Forward declaration

interface Derived1 extends Base {}      // Error!

interface Base {}                       // Definition

interface Derived2 extends Base {}      // OK, definition was seen
```

## Language Mapping

{% iflang langs="cpp" %}

A forward declaration maps to a C++ forward declaration.

{% /iflang %}

{% iflang langs="csharp,java,js,matlab,php,python,ruby,swift" %}

A forward declaration maps to nothing.

{% /iflang %}

{% language-section name="mapping" /%}
