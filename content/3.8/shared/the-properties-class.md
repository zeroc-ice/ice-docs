---
id: the-properties-class
title: The Properties Class
---

You can use the same [configuration file](../using-configuration-files) and [command-line](../setting-properties-on-the-command-line) mechanisms to set application-specific properties. For example, we could introduce a property to control the maximum file size for a file system application:

```config
# Configuration file for file system application

Filesystem.MaxFileSize=1024    # Max file size in kB
```

The Ice runtime stores this `Filesystem.MaxFileSize` property like any other property and makes it accessible programmatically via the [Properties](https://code.zeroc.com/manual/Ice/Properties) class.

To access property values from within your program, you need to acquire the communicator's properties by calling `getProperties`. Most of the methods on the returned `Properties` object involve reading properties, setting properties, and parsing properties.
