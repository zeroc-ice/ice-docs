---
title: Communicator
---

A [communicator](api:Ice/Communicator) is the entry point into the Ice runtime. You create proxies with a communicator,
and each communicator has its own:

- **Outgoing connections** The communicator establishes and caches the connections that invocations on its proxies use.
- **Client-side thread pool** This [thread pool](../threading-model) processes the messages received on the outgoing
  connections.
- **Object adapters** The communicator creates the [object adapters](../dispatch) that dispatch incoming requests to
  your servants.
- **Properties** Each communicator holds a [property set](../properties-and-configuration). These properties configure
  this communicator, and an Ice service or an application that uses this communicator can read its own properties from
  the same set.
- **Logger** The [logger](../../administration/logger-facility) of a communicator receives the log messages of the Ice
  runtime.

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

{% iflang langs="cpp,csharp,java,js,php,python,ruby,swift" %}

## Initialization Data

[InitializationData](api:Ice/InitializationData) holds the options you can supply when you create a communicator, such
as its properties{% iflang langs="cpp,csharp,java,js,php,python,swift" %} and its logger{% /iflang %}. Set these options
in an `InitializationData` object, and create the communicator with this object.

{% /iflang %}

{% language-section name="initialization-data" /%}

## See Also

- [Setting Properties on the Command Line](../properties-and-configuration/setting-properties-on-the-command-line)
- [The Properties Class](../properties-and-configuration/properties-class)
