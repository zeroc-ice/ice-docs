---
title: Communicator Initialization and Destruction
sidebarLabel: Initialization and Destruction
---

## Creating a Communicator

{% language-section name="mapping" /%}

## Initialization Data

When a communicator is created, its `constructor` or the `initialize` method configures several features that control
its behavior. Once set, these features remain in effect for the lifetime of the communicator and cannot be changed
afterward. Therefore, any customization of these features must be done at communicator creation time.

The [InitializationData](api:Ice/InitializationData) class or struct holds all the features (or options) that you can
customize when you create a communicator.

## See Also

- [Setting Properties on the Command Line](../../properties-and-configuration/setting-properties-on-the-command-line)
- [The Properties Interface](../../properties-and-configuration/properties-class)
