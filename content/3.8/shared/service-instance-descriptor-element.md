---
id: service-instance-descriptor-element
title: Service-Instance Descriptor Element
---

A `service-instance` element creates an instance of a [service-template](../service-template-descriptor-element) element in an [IceBox](../icebox-integration-with-icegrid) server. It may supply additional information such as [configuration properties](../properties-descriptor-element).

This element may only appear as a child of an [icebox element](../icebox-descriptor-element).

The following attributes are supported:

| **Attribute** | **Description** | **Required** |
| --- | --- | --- |
| `template` | Identifies the service [template](../icegrid-templates). | Yes |

All other attributes of the element must correspond to [parameters](../using-descriptor-variables-and-parameters) declared by the template. The `service-instance` element must provide a value for each parameter that does not have a default value supplied by the template.

Here is an example to demonstrate the use of this element:

```xml
<icebox id="IceBoxServer" ...>
    <service-instance template="ServiceTemplate" name="Service1">
        <properties>
            <property name="Debug" value="1"/>
        </properties>
    </service-instance>
</icebox>
```

##### See Also

- [Service-Template Descriptor Element](../service-template-descriptor-element)
- [IceBox Descriptor Element](../icebox-descriptor-element)
- [IceGrid Templates](../icegrid-templates)
- [IceBox Integration with IceGrid](../icebox-integration-with-icegrid)
