---
title: Communicator
---

A [communicator](api:Ice/Communicator) is the central object of the Ice runtime. It creates and caches the outgoing
connections of your application, holds its [configuration properties](../properties-and-configuration) and its
[logger](../../administration/logger-facility), and runs the client-side [thread pool](../threading-model) that
processes the messages received on these connections. You create proxies with a communicator.

{% iflang langs="cpp,csharp,java,js,python,swift" %}

A communicator also creates the [object adapters](../dispatch) that dispatch incoming requests to your servants.

{% /iflang %}

Most applications use a single communicator, but an application can create several communicators when needed.

## Creating a Communicator

{% language-section name="creating" /%}

## Destroying a Communicator

{% iflang langs="cpp,csharp,java,js,matlab,python,ruby,swift" %}

Destroy a communicator when you no longer need it.

{% /iflang %}

{% language-section name="destroying" /%}

Destroying a communicator closes its connections and releases its resources.

{% iflang langs="cpp,csharp,java,js,python,swift" %}

It also destroys the communicator's object adapters, and waits for the dispatches that are still running to complete.

{% /iflang %}

{% language-section name="after-destroying" /%}

## Initialization Data

Some aspects of the Ice runtime must be configured when you create the communicator, such as its properties and its
logger. The [InitializationData](api:Ice/InitializationData) class or struct holds these options, and the communicator
constructor or `initialize` function accepts it.

{% language-section name="after-initialization-data" /%}

## See Also

- [Command-Line Parsing and Initialization](../properties-and-configuration/command-line-parsing-and-initialization)
- [The Properties Interface](../properties-and-configuration/properties-class)
