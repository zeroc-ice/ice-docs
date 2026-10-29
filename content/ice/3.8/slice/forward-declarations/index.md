---
title: Forward Declarations
---

[Interfaces](../interfaces) and [classes](../user-defined-types/classes) can be forward declared, so that you can use
them before their definition. This lets you define types that refer to each other, for example:

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

The forward declaration of `Child` lets `Children` and `Parent` use `Child` before its definition.

You can use a forward-declared class or interface as the element type of a sequence, the value type of a dictionary, the
type of a field, and the type of an operation parameter or return value. As with any interface, you refer to a
forward-declared interface by its proxy type, such as `Child*`.

A class or interface cannot extend a forward-declared class or interface until its definition has been seen:

```slice
interface Base;                         // Forward declaration

interface Derived1 extends Base {}      // Error!

interface Base {}                       // Definition

interface Derived2 extends Base {}      // OK, definition was seen
```

## Language Mapping

A forward declaration has no mapped type of its own: the generated code uses the type mapped from the definition.

{% language-section name="mapping" /%}
