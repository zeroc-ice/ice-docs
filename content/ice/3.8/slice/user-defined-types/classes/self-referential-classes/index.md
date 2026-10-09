---
title: Self-Referential Classes
---

Classes can be self-referential.

For example:

```slice
class Link
{
    SomeType value;
    Link next;
}
```

Here, the `next` field refers to another `Link` instance, or is null.

Self-referential classes are particularly useful to model recursive structures such as trees. For example, we can create
a simple expression tree along the following lines:

```slice
enum UnaryOp { UnaryPlus, UnaryMinus, Not }
enum BinaryOp { Plus, Minus, Multiply, Divide, And, Or }

class Node {}

class UnaryOperator extends Node
{
    UnaryOp op;
    Node operand;
}

class BinaryOperator extends Node
{
    BinaryOp op;
    Node operand1;
    Node operand2;
}

class Operand extends Node
{
    long val;
}
```

The expression tree consists of leaf nodes of type `Operand`, and interior nodes of type `UnaryOperator` and
`BinaryOperator`, with one or two descendants, respectively. All three of these classes derive from a common base class
`Node`, which is empty.

If we write an operation that, for example, accepts a `Node` parameter, passing that parameter results in transmission
of the entire tree to the server:

```slice
interface Evaluator
{
    long eval(Node expression); // Send entire tree for evaluation
}
```

A class graph can also contain cycles. In the following tree, each node refers to its parent and to its children, so a
node and each of its children refer to each other:

```slice
class TreeNode;
sequence<TreeNode> TreeNodeSeq;

class TreeNode
{
    string name;
    TreeNode parent;
    TreeNodeSeq children;
}
```

The Ice runtime marshals each instance of a class graph once, so the
[encoded graph](../../../../encoding/data-encoding-for-classes/class-graphs) keeps these cycles.

{% language-section name="mapping" /%}
