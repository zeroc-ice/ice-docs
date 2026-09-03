---
id: properties-descriptor-element
title: Properties Descriptor Element
---

The `properties` element is used in three situations:

- as a named property set if the `id` attribute is specified
- as a reference to a named property set if the `refid` attribute is specified
- as an unnamed property set if the `id` or `refid` attributes are not specified.

A property set is useful for defining a set of [properties](../properties-and-configuration) (a named property set) in application or node descriptors. Named property sets can be included in named or unnamed property sets with property set references.

A named property set element may only be a child of an [application](../application-descriptor-element) element or a [node](../node-descriptor-element) element. An unnamed property set element may only be a child of a [server](../server-descriptor-element), [icebox](../icebox-descriptor-element), [service](../service-descriptor-element), [server-instance](../server-instance-descriptor-element) or [service-instance](../service-instance-descriptor-element) element. An unnamed property set element with the `service` attribute defined may only be a child of a [server-instance](../server-instance-descriptor-element) element. A reference to a named property set can only be a child of a named or unnamed property set element.

The following attributes are supported:

| **Attribute** | **Description** | **Required** |
| --- | --- | --- |
| `id` | Defines a new named property set with the given identifier. The identifier must be unique among all named property sets defined in the same scope. If not specified, the properties element refers to an unnamed property set or a property set reference. | No |
| `refid` | Defines a reference to the named property set with the given identifier. If not specified, the element refers to an unnamed or named property set. | No |
| `service` | Specifies the name of an IceBox service that is defined in the enclosing `server-instance` descriptor. The server instance must be an IceBox server that includes a service with the given name. An unnamed property set with this attribute defined extends the properties of the service. If not specified, the unnamed property set extends the properties of the server instance. | No |

Here is an example to demonstrate the use of this element:

```xml
<application name="Simple">
   <properties id="Debug">
        <property name="Ice.Trace.Network" value="1"/>
   </properties>

    <server id="MyServer" exe="./server">
        <properties>
            <properties refid="Debug"/>
            <property name="AppProperty" value="1"/>
        </properties>
    </server>
</application>
```

##### See Also

- [Properties and Configuration](../properties-and-configuration)
- [Application Descriptor Element](../application-descriptor-element)
- [Node Descriptor Element](../node-descriptor-element)
- [Server Descriptor Element](../server-descriptor-element)
- [IceBox Descriptor Element](../icebox-descriptor-element)
- [Service Descriptor Element](../service-descriptor-element)
- [Server-Instance Descriptor Element](../server-instance-descriptor-element)
- [Service-Instance Descriptor Element](../service-instance-descriptor-element)
