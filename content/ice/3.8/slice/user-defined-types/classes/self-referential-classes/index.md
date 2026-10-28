---
title: Self-Referential Classes
---

Classes can be self-referential.

For example:

```slice
class Link
{
    string value;
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
`BinaryOperator`, with one or two descendants, respectively. All three of these classes derive from the empty base class
`Node`.

If we write an operation that, for example, accepts a `Node` parameter, passing that parameter results in transmission
of the entire tree to the server:

```slice
interface Evaluator
{
    long eval(Node expression); // Send entire tree for evaluation
}
```

Several fields can refer to the same instance. Ice marshals this instance once, and in the graph the receiver
unmarshals, these fields refer to a single instance too. For example, the two operands of a `BinaryOperator` can be the
same `Operand` instance.

A class graph can also contain cycles. For example, a tree node can refer to its parent as well as to its children:

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

The `parent` field of each child refers back to the node that holds this child in its `children` sequence, so every
parent-child pair forms a cycle. Ice marshals each class instance only once, so marshaling such a graph terminates.

{% language-section name="mapping" /%}
