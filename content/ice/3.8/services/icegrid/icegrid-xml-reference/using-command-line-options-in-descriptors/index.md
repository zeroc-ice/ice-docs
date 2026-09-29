---
title: Using Command Line Options in Descriptors
---

[Server descriptors](../server-descriptor-element) and [IceBox descriptors](../icebox-descriptor-element) may specify
command-line options that the node will pass to the program at startup. As the node prepares to execute the server, it
assembles the command by appending options to the server executable's pathname.

In XML, you define a command-line option using the `option` element:

```xml
<server id="Server1" ...>
    <option>--Ice.Trace.Protocol</option>
    ...
</server>
```

The node preserves the order of options, which is especially important for Java servers. For example, JVM options must
appear before the class name, as shown below:

```xml
<server id="JavaServer" exe="java" ...>
    <option>-Xnoclassgc</option>
    <option>ServerClassName</option>
    <option>--Ice.Trace.Protocol</option>
    ...
</server>
```

The node translates these options into the following command:

```shell
java -Xnoclassgc ServerClassName --Ice.Trace.Protocol
```

##### See Also

- [Server Descriptor Element](../server-descriptor-element)
- [IceBox Descriptor Element](../icebox-descriptor-element)
