---
title: Communicator Initialization and Destruction
---

## Creating a Communicator

{% language-section name="mapping" /%}

## Initialization Data

When a communicator is created, its `constructor` or the `initialize` method configures several features that control
its behavior. Once set, these features remain in effect for the lifetime of the communicator and cannot be changed
afterward. Therefore, any customization of these features must be done at communicator creation time.

The [InitializationData](api:Ice/InitializationData) class or struct holds all the features (or options) that you can
customize when you create a communicator. Its fields depend on the language mapping:

| Field                                   | Description                                                                                                              | Languages                  |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| `properties` (`Properties` in MATLAB)   | The communicator's properties.                                                                                           | All                        |
| `logger`                                | The communicator's logger.                                                                                               | All except MATLAB and Ruby |
| `observer`                              | The communicator observer used by the Ice runtime.                                                                       | C++, C#, Java              |
| `threadStart`, `threadStop`             | The functions the communicator calls when it starts a thread, and before a thread it created terminates.                 | C++, C#, Java, Python      |
| `executor`                              | The function the communicator calls to execute dispatches and asynchronous invocation callbacks.                         | C++, C#, Java, Python      |
| `batchRequestInterceptor`               | The function the Ice runtime calls to enqueue a batch request.                                                           | C++, C#, Java, Python      |
| `clientAuthenticationOptions`           | The authentication options for SSL client connections. When set, the SSL transport ignores the IceSSL properties.        | C++, C#                    |
| `clientSSLEngineFactory`                | The SSL engine factory for SSL client connections. When set, the SSL transport ignores the IceSSL properties.            | Java                       |
| `classLoader`                           | The class loader the Ice runtime uses to load plug-ins, and Slice classes and exceptions when `sliceLoader` is not set.  | Java                       |
| `pluginFactories`                       | The plug-in factories whose plug-ins the communicator creates, in order, before all other plug-ins.                      | C++, C#, Java              |
| `eventLoopAdapter`                      | The adapter that runs the coroutines returned by asynchronous dispatch methods and wraps Ice futures for the event loop. | Python                     |
| `sliceLoader` (`SliceLoader` in MATLAB) | The Slice loader the Ice runtime uses to unmarshal Slice classes and exceptions.                                         | All except PHP             |

In MATLAB, you pass `Properties` and `SliceLoader` as name-value arguments to the `Ice.Communicator` constructor.

## See Also

- [Command-Line Parsing and Initialization](../../properties-and-configuration/command-line-parsing-and-initialization)
- [The Properties Interface](../../properties-and-configuration/properties-class)
