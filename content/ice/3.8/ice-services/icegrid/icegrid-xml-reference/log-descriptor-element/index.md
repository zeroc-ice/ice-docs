---
title: Log Descriptor Element
---

A `log` element specifies the name of a log file for a server or service. A `log` element must be defined for each log
file that can be [accessed remotely](../icegrid-administrative-sessions) by an administrative tool. Note that it is not
necessary to define a `log` element for the values of the `Ice.StdErr` and `Ice.StdOut` properties.

This element may only appear as a child of a [server](../server-descriptor-element) element or a
[service](../service-descriptor-element) element.

The following attributes are supported:

| **Attribute** | **Description**                                                                                                                                                                                | **Required** |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `path`        | The path name of the log file. If a relative path is specified, it is relative to the current working directory of the node. The node must have sufficient access privileges to read the file. | Yes          |
| `property`    | Specifies the name of a property in which to store the path name of the log file as given in the `path` attribute.                                                                             | No           |

Here is an example to demonstrate the use of this element:

```xml
<server id="MyServer" ...>
    <log path="${server}.log" property="LogFile"/>
</server>
```

##### See Also

- [IceGrid Administrative Sessions](../icegrid-administrative-sessions)
- [Server Descriptor Element](../server-descriptor-element)
- [Service Descriptor Element](../service-descriptor-element)
