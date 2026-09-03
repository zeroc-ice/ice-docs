---
id: object-descriptor-element
title: Object Descriptor Element
---

An `object` element defines a [well-known object](../well-known-objects) in the IceGrid registry. Clients can refer to this object using only its identity, or they can search for well-known objects of a specific type.

This element may only appear as a child of an [adapter](../adapter-descriptor-element) element or a [replica-group](../replica-group-descriptor-element) element.

The following attributes are supported:

| **Attribute** | **Description** | **Required** |
| --- | --- | --- |
| `identity` | Specifies the identity by which this object is known. | Yes |
| `property` | Specifies the name of a property to generate that contains the stringified identity of the object. This attribute is only allowed if this `object` element is a child of an [adapter](../adapter-descriptor-element) element. | No |
| `type` | An arbitrary string used to group objects. By convention, the string represents the most-derived Slice [type ID](../type-ids) of the object, but an application is free to use another convention. | No |
| `proxy-options` | The proxy options to use for the proxy of the well-known object return by IceGrid. | No |

Here is an example to demonstrate the use of this element:

```xml
<adapter name="MyAdapter" id="WellKnownAdapter" ...>
    <object identity="WellKnownObject" 
            type="::Module::WellKnownInterface" 
            proxy-options="-o"/>
</adapter>
```

In the configuration above, the object can be located via the equivalent proxies `WellKnownObject` and `WellKnownObject@WellKnownAdapter`.

##### See Also

- [Well-Known Objects](../well-known-objects)
- [Adapter Descriptor Element](../adapter-descriptor-element)
- [Replica-Group Descriptor Element](../replica-group-descriptor-element)
- [Type IDs](../type-ids)
