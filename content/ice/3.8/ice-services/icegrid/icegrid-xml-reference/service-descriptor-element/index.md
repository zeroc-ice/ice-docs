---
title: Service Descriptor Element
---

A `service` element defines an [IceBox](../icebox-integration-with-icegrid) service. It typically contains at least one
[adapter](../adapter-descriptor-element) element, and may supply additional information such as
[configuration properties](../properties-descriptor-element).

This element may only appear as a child of an [icebox](../icebox-descriptor-element) element or a
[service-template](../service-template-descriptor-element) element.

The following attributes are supported:

| **Attribute** | **Description**                                                                                                                                                                        | **Required** |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `entry`       | Specifies the entry point of this service.                                                                                                                                             | Yes          |
| `name`        | Specifies the name of this service. Within the service, child elements can refer to its name using the [reserved variable](../using-descriptor-variables-and-parameters) `${service}`. | Yes          |

An optional nested `description` element provides free-form descriptive text.

Here is an example to demonstrate the use of this element:

```xml
<icebox id="MyIceBox" ...>
    <service name="Service1" entry="service1:Create">
        <description>A description of this service.</description>
        <property name="ServiceName" value="${service}"/>
        <adapter name="MyAdapter" id="${service}Adapter" .../>
    </service>
    <service name="Service2" entry="service2:Create"/>
</icebox>
```

##### See Also

- [IceBox](../icebox)
- [Adapter Descriptor Element](../adapter-descriptor-element)
- [Properties Descriptor Element](../properties-descriptor-element)
- [IceBox Descriptor Element](../icebox-descriptor-element)
- [Service-Template Descriptor Element](../service-template-descriptor-element)
- [IceBox Integration with IceGrid](../icebox-integration-with-icegrid)
