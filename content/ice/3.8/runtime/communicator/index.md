---
title: Communicator
---

A [communicator](api:Ice/Communicator) is the central object of the Ice runtime. It creates and caches the outgoing
connections of your application{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}, runs the client-side
[thread pool](../threading-model) that processes the messages received on these connections,{% /iflang %} and holds its
[configuration properties](../properties-and-configuration) and its [logger](../../administration/logger-facility). You
create proxies with a communicator.

{% iflang langs="cpp,csharp,java,js,python,swift" %}

A communicator also creates the [object adapters](../dispatch) that dispatch incoming requests to your servants.

{% /iflang %}

Most applications use a single communicator, but an application can create several communicators when needed.

## Creating a Communicator

{% language-section name="creating" /%}

## Destroying a Communicator

{% language-section name="destroying" /%}

{% iflang langs="cpp,csharp,java,js,matlab,python,ruby,swift" %}Destroy a communicator when you no longer need it.
{% /iflang %}Destroying a communicator closes its connections{% iflang langs="cpp,csharp,java,js,python,swift" %},
destroys its object adapters, waits for the dispatches that are still running to complete,{% /iflang %} and releases its
resources.

{% language-section name="after-destroying" /%}

## Initialization Data

Some aspects of the Ice runtime must be configured when you create the communicator, such as its
properties{% iflang langs="cpp,csharp,java,js,php,python,swift" %} and its logger{% /iflang %}. The
[InitializationData](api:Ice/InitializationData) class or struct holds these options, and the communicator constructor
or `initialize` function accepts it.

{% language-section name="initialization-data" /%}

## See Also

- [Command-Line Parsing and Initialization](../properties-and-configuration/command-line-parsing-and-initialization)
- [The Properties Interface](../properties-and-configuration/properties-class)
