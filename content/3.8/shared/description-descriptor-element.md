---
id: description-descriptor-element
title: Description Descriptor Element
---

A `description` element specifies a description of its parent element.

This element may only appear as a child of the [application](../application-descriptor-element),
[replica-group](../replica-group-descriptor-element), [node](../node-descriptor-element),
[server](../server-descriptor-element), [service](../service-descriptor-element),
[icebox](../icebox-descriptor-element), and [adapter](../adapter-descriptor-element) elements.

Here is an example to demonstrate the use of this element:

```xml
<node name="localnode">
    <description>Free form descriptive text for localnode</description>
</node>
```

##### See Also

- [Application Descriptor Element](../application-descriptor-element)
- [Replica-Group Descriptor Element](../replica-group-descriptor-element)
- [Node Descriptor Element](../node-descriptor-element)
- [Server Descriptor Element](../server-descriptor-element)
- [Service Descriptor Element](../service-descriptor-element)
- [IceBox Descriptor Element](../icebox-descriptor-element)
- [Adapter Descriptor Element](../adapter-descriptor-element)
