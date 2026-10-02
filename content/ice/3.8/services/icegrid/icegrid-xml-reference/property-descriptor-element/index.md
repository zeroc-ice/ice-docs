---
title: Property Descriptor Element
---

An IceGrid node generates a [configuration file](runtime/properties-and-configuration) for each of its servers and
services. This file generally should not be edited manually because any changes are lost the next time the node
generates the file. The `property` element is the correct way to define additional properties in a configuration file.

Note that IceGrid [administrative utilities](services/icegrid/icegridadmin-command-line-tool) can retrieve the
configuration properties of a server or service via the
[administrative facility](services/icegrid/icegrid-and-the-administrative-facility).

This element may only appear as a child of a [server](services/icegrid/icegrid-xml-reference/server-descriptor-element)
element, a [service](services/icegrid/icegrid-xml-reference/service-descriptor-element) element, an
[icebox](services/icegrid/icegrid-xml-reference/icebox-descriptor-element) element or a
[properties](services/icegrid/icegrid-xml-reference/properties-descriptor-element) element.

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

## See Also

- [Properties and Configuration](runtime/properties-and-configuration)
- [icegridadmin Command Line Tool](services/icegrid/icegridadmin-command-line-tool)
- [IceGrid and the Administrative Facility](services/icegrid/icegrid-and-the-administrative-facility)
- [Server Descriptor Element](services/icegrid/icegrid-xml-reference/server-descriptor-element)
- [Service Descriptor Element](services/icegrid/icegrid-xml-reference/service-descriptor-element)
- [IceBox Descriptor Element](services/icegrid/icegrid-xml-reference/icebox-descriptor-element)
- [Properties Descriptor Element](services/icegrid/icegrid-xml-reference/properties-descriptor-element)
