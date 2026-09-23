---
title: Self-Referential Classes
---

Classes can be self-referential.

For example:

```slice
class Link
{
    SomeType value;
    Link next;
}
```

Here, `value` and `next` are fields and the type of next is `Link`, which has _value_ semantics. In particular, while
`next` looks and feels like a pointer, _it cannot denote an instance in a different address space_. This means that if
we have a chain of `Link` instances, all of the instances are in our local address space and, when we read or write a
value field, we are performing local address space operations.

Self-referential classes are particularly useful to model graphs. For example, we can create a simple expression tree
along the following lines:

```slice
enum UnaryOp { UnaryPlus, UnaryMinus, Not }
enum BinaryOp { Plus, Minus, Multiply, Divide, And, Or }

class Node {}

class UnaryOperator extends Node
{
    UnaryOp operator;
    Node operand;
}

class BinaryOperator extends Node
{
    BinaryOp op;
    Node operand1;
    Node operand2;
}

class Operand extends Node
{
    long val;
}
```

The expression tree consists of leaf nodes of type `Operand`, and interior nodes of type `UnaryOperator` and
`BinaryOperator`, with one or two descendants, respectively. All three of these classes are derived from a common base
class `Node`. Note that `Node` is an empty class. This is one of the few cases where an empty base class is justified.

If we write an operation that, for example, accepts a `Node` parameter, passing that parameter results in transmission
of the entire tree to the server:

```slice
interface Evaluator
{
    long eval(Node expression); // Send entire tree for evaluation
}
```

Self-referential classes are not limited to acyclic graphs; the Ice runtime permits loops: it ensures that no resources
are leaked and that infinite loops are avoided during marshaling.

{% language-section name="lang-1" /%}
