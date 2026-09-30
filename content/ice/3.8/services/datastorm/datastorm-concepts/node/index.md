---
title: Node
---

The **node** is the central component of any DataStorm publish–subscribe application. Every DataStorm application must
start by creating a node and keep it alive for the duration of the application.

A DataStorm node maintains **sessions** with other connected nodes to exchange information about the topics created
within each node and the readers and writers associated with those topics.

The node also acts as a **registry** for topics created locally and informs remote connected nodes about these topics.

From an implementation perspective, a node is simply an instance of the `DataStorm::Node` class. You create a node using
one of its constructors and destroy it using its destructor.

The most common setup is to create a `DataStorm::Node` instance on the stack in your `main` function. It will be
automatically destroyed when it goes out of scope, just before your application returns from `main`.

```cpp
#include <DataStorm/DataStorm.h>

int
main(int argc, char* argv[])
{
    DataStorm::Node node{argc, argv};
    ...

    // Node is automatically destroyed before returning from main when
    // it falls out of scope.
}
```

In this example, we use the `DataStorm::Node` constructor that takes the `argc` and `argv` parameters. This constructor
parses DataStorm command-line options and converts them into properties that are used to configure the node.

The `DataStorm::Node` class also provides additional constructors that allow different ways to configure the node or
specify extra parameters. See the [API reference](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Node.html)
for details.

After the node is destroyed, writers will no longer publish samples, and readers will no longer receive samples.

The `Node::shutdown` method can be used to unblock readers and writers that are waiting to receive a sample or for a
peer node to connect. In this case, the waiting threads throw a `NodeShutdownException` exception.
