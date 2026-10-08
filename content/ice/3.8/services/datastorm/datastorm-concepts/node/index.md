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

An application that already has an Ice communicator, or that needs other node options, creates the node from a
[NodeOptions](https://code.zeroc.com/ice/3.8/api/cpp/structDataStorm_1_1NodeOptions.html) structure:

```cpp
#include <DataStorm/DataStorm.h>
#include <Ice/Ice.h>

int
main(int argc, char* argv[])
{
    Ice::InitializationData initData;
    initData.properties = std::make_shared<Ice::Properties>(argc, argv);
    initData.properties->setProperty("Ice.ThreadPool.Client.Serialize", "1");
    Ice::CommunicatorHolder communicatorHolder{std::move(initData)};

    DataStorm::NodeOptions options;
    options.communicator = communicatorHolder.communicator();
    DataStorm::Node node{std::move(options)};
    ...
}
```

The `DataStorm::Node` constructor that takes only a communicator is a shorthand for this constructor with the other
options left at their defaults.

A communicator you supply must meet two requirements:

- It must not have a default object adapter. The `DataStorm::Node` constructor throws `std::invalid_argument` otherwise.
  The node sets the communicator's default object adapter to one of its own object adapters, so two nodes cannot use the
  same communicator at the same time.
- It must dispatch the requests it receives on a connection in the order they were sent, because a partial update
  applies to the value left by the preceding sample for the same key. A node sets
  [Ice.ThreadPool.Client.Serialize](../../../../property-reference/ice-threadpool-properties#ice.threadpool.name.serialize)
  to `1` by default on the communicators it creates, but not on a communicator you supply: set this property before you
  create the communicator. An executor set through `Ice::InitializationData` must also preserve this dispatch order.

The node destroys a supplied communicator only when `nodeOwnsCommunicator` is `true`; the default is `false`. Otherwise,
destroying the node releases the node's resources and destroys its object adapters, and the communicator remains usable.

`NodeOptions` has two other options:

- `customExecutor` is a function that receives, from the node's callback thread, the functions that deliver user
  notifications, such as the `onSamples` callbacks described in [Reading Samples](../reader#reading-samples). Without
  it, the node runs these functions on that thread.
- `serverAuthenticationOptions` configures the SSL server side of the `DataStorm.Node.Server` object adapter that
  accepts connections from other nodes, described in [Node Server](../../node-server).

## Shutting Down a Node

After the node is destroyed, writers will no longer publish samples, and readers will no longer receive samples.

The `Node::shutdown` method can be used to unblock readers and writers that are waiting to receive a sample or for a
peer node to connect. In this case, the waiting threads throw a `NodeShutdownException` exception. `Node::isShutdown`
returns whether the node is shut down, and `Node::waitForShutdown` blocks until it is. Shutting down a node doesn't
destroy it: the node releases its resources, and destroys the communicator it owns, when the `DataStorm::Node` object is
destroyed. `Node::getCommunicator` returns the node's communicator.
