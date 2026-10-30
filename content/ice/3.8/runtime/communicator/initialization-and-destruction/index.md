---
title: Communicator Initialization and Destruction
sidebarLabel: Initialization and Destruction
---

## Creating a Communicator

{% language-section name="mapping" /%}

## Destroying a Communicator

Destroy a communicator when you no longer need it. Destroying a communicator closes its connections and releases its
resources, such as threads and file descriptors.

{% iflang langs="cpp,csharp,java,js,python,swift" %}

It also destroys the communicator's object adapters, and waits for the dispatches that are still running to complete.

{% /iflang %}

## Initialization Data

Some aspects of the Ice runtime must be configured when you create the communicator, such as its properties and its
logger. The [InitializationData](api:Ice/InitializationData) class or struct holds these options, and the communicator
constructor or `initialize` function accepts it.

## See Also

- [Command-Line Parsing and Initialization](../../properties-and-configuration/command-line-parsing-and-initialization)
- [The Properties Interface](../../properties-and-configuration/properties-class)
