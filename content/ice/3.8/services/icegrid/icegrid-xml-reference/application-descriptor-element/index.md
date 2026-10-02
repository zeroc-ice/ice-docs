---
title: Application Descriptor Element
---

An `application` element defines an [IceGrid application](services/icegrid/icegrid-architecture). An application
typically contains at least one [node](services/icegrid/icegrid-xml-reference/node-descriptor-element) element, but it
may also be used for other purposes such as defining
[server](services/icegrid/icegrid-xml-reference/server-template-descriptor-element) and
[service](services/icegrid/icegrid-xml-reference/service-template-descriptor-element) templates,
[default templates](services/icegrid/icegrid-templates),
[replica groups](services/icegrid/icegrid-xml-reference/replica-group-descriptor-element) and
[property sets](services/icegrid/icegrid-xml-reference/properties-descriptor-element).

This element must be a child of an [icegrid](services/icegrid/icegrid-xml-reference/icegrid-descriptor-element) element.
Only one `application` element is permitted per file.

The following attributes are supported.

| **Attribute**              | **Description**                                                                                                                                                                                                                                                        | **Required** |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `import-default-templates` | If `true`, the [default templates](services/icegrid/icegrid-templates) configured for the IceGrid registry are imported and available for use within this application. If not specified, the default value is `false`.                                                 | No           |
| `name`                     | The name of the application. This name must be unique among all applications in the registry. Within the application, child elements can refer to its name using the [reserved variable](services/icegrid/using-descriptor-variables-and-parameters) `${application}`. | Yes          |

An optional nested [description](services/icegrid/icegrid-xml-reference/description-descriptor-element) element provides
free-form descriptive text.

Here is an example to demonstrate the use of this element:

```xml
<icegrid>
    <application name="MyApplication" import-default-templates="true">
        <description>A description of the application.</description>
        ...
    </application>
</icegrid>
```

## See Also

- [IceGrid Architecture](services/icegrid/icegrid-architecture)
- [Node Descriptor Element](services/icegrid/icegrid-xml-reference/node-descriptor-element)
- [Server-Template Descriptor Element](services/icegrid/icegrid-xml-reference/server-template-descriptor-element)
- [Service-Template Descriptor Element](services/icegrid/icegrid-xml-reference/service-template-descriptor-element)
- [Replica-Group Descriptor Element](services/icegrid/icegrid-xml-reference/replica-group-descriptor-element)
- [Properties Descriptor Element](services/icegrid/icegrid-xml-reference/properties-descriptor-element)
- [IceGrid Descriptor Element](services/icegrid/icegrid-xml-reference/icegrid-descriptor-element)
- [Description Descriptor Element](services/icegrid/icegrid-xml-reference/description-descriptor-element)
- [IceGrid Templates](services/icegrid/icegrid-templates)
- [Using Descriptor Variables and Parameters](services/icegrid/using-descriptor-variables-and-parameters)
