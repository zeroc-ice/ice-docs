---
id: communicator-initialization-and-destruction
title: Communicator Initialization and Destruction
---

# Creating a Communicator

{% language-section name="lang-1" /%}

# Initialization Data

When a communicator is created, its `constructor` or the `initialize` method configures several features that control
its behavior. Once set, these features remain in effect for the lifetime of the communicator and cannot be changed
afterward. Therefore, any customization of these features must be done at communicator creation time.

The [InitializationData](https://code.zeroc.com/manual/Ice/InitializationData) class or struct holds all the features
(or options) that you can customize when you create a communicator.

##### See Also

- [Command-Line Parsing and Initialization](../command-line-parsing-and-initialization)
- [The Properties Interface](../the-properties-class)
