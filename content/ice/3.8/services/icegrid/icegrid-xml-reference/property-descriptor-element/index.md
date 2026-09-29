---
title: Property Descriptor Element
---

An IceGrid node generates a [configuration file](../properties-and-configuration) for each of its servers and services.
This file generally should not be edited manually because any changes are lost the next time the node generates the
file. The `property` element is the correct way to define additional properties in a configuration file.

Note that IceGrid [administrative utilities](../icegridadmin-command-line-tool) can retrieve the configuration
properties of a server or service via the [administrative facility](../icegrid-and-the-administrative-facility).

This element may only appear as a child of a [server](../server-descriptor-element) element, a
[service](../service-descriptor-element) element, an [icebox](../icebox-descriptor-element) element or a
[properties](../properties-descriptor-element) element.

The following attributes are supported:

| **Attribute** | **Description**                                                             | **Required** |
| ------------- | --------------------------------------------------------------------------- | ------------ |
| `name`        | Specifies the property name.                                                | Yes          |
| `value`       | Specifies the property value. If not defined, the value is an empty string. | No           |

Here is an example to demonstrate the use of this element:

```xml
<server id="MyServer" ...>
    <property name="Ice.ThreadPool.Server.SizeMax" value="10"/>
    ...
</server>
```

This `property` element adds the following definition to the server's configuration file:

```config
Ice.ThreadPool.Server.SizeMax=10
```

##### See Also

- [Properties and Configuration](../properties-and-configuration)
- [icegridadmin Command Line Tool](../icegridadmin-command-line-tool)
- [IceGrid and the Administrative Facility](../icegrid-and-the-administrative-facility)
- [Server Descriptor Element](../server-descriptor-element)
- [Service Descriptor Element](../service-descriptor-element)
- [IceBox Descriptor Element](../icebox-descriptor-element)
- [Properties Descriptor Element](../properties-descriptor-element)
