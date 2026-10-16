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
parses DataStorm command-line options and converts them into properties that are used to configure the node. The node
creates its Ice communicator from these properties and destroys it when the node is destroyed.

## Creating a Node with NodeOptions

The [NodeOptions](https://code.zeroc.com/ice/3.8/api/cpp/structDataStorm_1_1NodeOptions.html) structure configures a
node from code. It lets you supply the Ice communicator the node uses and say whether the node owns it, set the executor
that runs your callbacks, described in [Reading Samples](../reader#reading-samples), and set the SSL server
authentication options of the `DataStorm.Node.Server` object adapter, described in
[Direct Node Connections](../connectivity#direct-node-connections). When `communicator` is `nullptr`, the node creates
its own communicator and destroys it with the node.

For example, to give the node's communicator a custom logger, create the communicator yourself and let the node own it:

```cpp
#include <DataStorm/DataStorm.h>
#include <Ice/Ice.h>

int
main(int argc, char* argv[])
{
    Ice::InitializationData initData;
    initData.properties = std::make_shared<Ice::Properties>(argc, argv);
    initData.properties->setProperty("Ice.ThreadPool.Client.Serialize", "1");
    initData.logger = std::make_shared<MyLogger>();

    DataStorm::NodeOptions options;
    options.communicator = Ice::initialize(std::move(initData));
    options.nodeOwnsCommunicator = true;
    DataStorm::Node node{std::move(options)};
    ...
}
```

With `nodeOwnsCommunicator` set to `true`, the node destroys the communicator when the node is destroyed. When it is
`false`, the default, destroying the node releases the node's resources and destroys its object adapters, and the
communicator remains usable. The `DataStorm::Node` constructor that takes only a communicator is a shorthand for
`NodeOptions` with this communicator and the other options left at their defaults.

A communicator you supply must meet two requirements:

- It must not have a default object adapter: the node sets the communicator's default object adapter to one of its own
  object adapters.
- It must dispatch the requests it receives on a connection in the order they were sent, because a partial update
  applies to the value left by the preceding sample for the same key. A node sets
  [Ice.ThreadPool.Client.Serialize](../../../../property-reference/ice-threadpool-properties#ice.threadpool.name.serialize)
  to `1` on the communicator it creates, but not on a communicator you supply: set this property before you create the
  communicator. An executor set through `Ice::InitializationData` must also preserve this dispatch order.

## Shutting Down a Node

The `Node::shutdown` method unblocks readers and writers that are waiting to receive a sample or for a peer node to
connect. The [DataStorm::Node](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Node.html) API reference
describes the node's other methods.
