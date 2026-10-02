---
title: Parameter Descriptor Element
---

A `parameter` element defines a [template](services/icegrid/icegrid-templates) parameter. Template parameters must be
declared with this element to be used in template instantiation.

This element may only appear as a child of a
[server-template](services/icegrid/icegrid-xml-reference/server-template-descriptor-element) element or a
[service-template](services/icegrid/icegrid-xml-reference/service-template-descriptor-element) element.

The following attributes are supported:

| **Attribute** | **Description**                                                                                                                                                 | **Required** |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `name`        | The name of the parameter. For example, if `index` is used as the name of a parameter, it can be referenced using `${index}` in the server or service template. | Yes          |
| `default`     | An optional default value for the parameter. This value is used if the parameter is not defined when a server or service is instantiated.                       | No           |

Here is an example to demonstrate the use of this element:

```xml
<server-template id="MyServerTemplate">
    <parameter name="index"/>
    <parameter name="exepath" default="/opt/myapp/bin/server"/>
    ...
</server-template>
```

## See Also

- [IceGrid Templates](services/icegrid/icegrid-templates)
- [Server-Template Descriptor Element](services/icegrid/icegrid-xml-reference/server-template-descriptor-element)
- [Service-Template Descriptor Element](services/icegrid/icegrid-xml-reference/service-template-descriptor-element)
- [Using Descriptor Variables and Parameters](services/icegrid/using-descriptor-variables-and-parameters)
