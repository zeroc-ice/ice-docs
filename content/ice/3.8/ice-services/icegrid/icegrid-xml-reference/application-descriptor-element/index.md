---
title: Application Descriptor Element
---

An `application` element defines an [IceGrid application](../icegrid-architecture). An application typically contains at
least one [node](../node-descriptor-element) element, but it may also be used for other purposes such as defining
[server](../server-template-descriptor-element) and [service](../service-template-descriptor-element) templates,
[default templates](../icegrid-templates), [replica groups](../replica-group-descriptor-element) and
[property sets](../properties-descriptor-element).

This element must be a child of an [icegrid](../icegrid-descriptor-element) element. Only one `application` element is
permitted per file.

The following attributes are supported.

| **Attribute**              | **Description**                                                                                                                                                                                                                                          | **Required** |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `import-default-templates` | If `true`, the [default templates](../icegrid-templates) configured for the IceGrid registry are imported and available for use within this application. If not specified, the default value is `false`.                                                 | No           |
| `name`                     | The name of the application. This name must be unique among all applications in the registry. Within the application, child elements can refer to its name using the [reserved variable](../using-descriptor-variables-and-parameters) `${application}`. | Yes          |

An optional nested [description](../description-descriptor-element) element provides free-form descriptive text.

Here is an example to demonstrate the use of this element:

```xml
<icegrid>
    <application name="MyApplication" import-default-templates="true">
        <description>A description of the application.</description>
        ...
    </application>
</icegrid>
```

##### See Also

- [IceGrid Architecture](../icegrid-architecture)
- [Node Descriptor Element](../node-descriptor-element)
- [Server-Template Descriptor Element](../server-template-descriptor-element)
- [Service-Template Descriptor Element](../service-template-descriptor-element)
- [Replica-Group Descriptor Element](../replica-group-descriptor-element)
- [Properties Descriptor Element](../properties-descriptor-element)
- [IceGrid Descriptor Element](../icegrid-descriptor-element)
- [Description Descriptor Element](../description-descriptor-element)
- [IceGrid Templates](../icegrid-templates)
- [Using Descriptor Variables and Parameters](../using-descriptor-variables-and-parameters)
