---
title: Server-Template Descriptor Element
---

A `server-template` element defines a [template](services/icegrid/icegrid-templates) for a
[server](services/icegrid/icegrid-xml-reference/server-descriptor-element) element, simplifying the task of deploying
multiple instances of the same server definition. The template should contain a parameterized
[server](services/icegrid/icegrid-xml-reference/server-descriptor-element) element that is instantiated using a
[server-instance](services/icegrid/icegrid-xml-reference/server-instance-descriptor-element) element.

This element may only appear as a child of an
[application](services/icegrid/icegrid-xml-reference/application-descriptor-element) element.

The following attributes are supported:

| **Attribute** | **Description**                                                                                                                 | **Required** |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `id`          | Specifies the identifier for the server template. This identifier must be unique among all server templates in the application. | Yes          |

A template may declare [parameters](services/icegrid/using-descriptor-variables-and-parameters) that are used to
instantiate the `server` element. You can define a default value for each parameter. Parameters without a default value
are considered mandatory and values for them must be supplied by the `server-instance` element.

Here is an example to demonstrate the use of this element:

```xml
<icegrid>
    <application name="SampleApp">
        <server-template id="ServerTemplate">
            <parameter name="id"/>
            <server id="${id}" activation="manual" .../>
        </server-template>
        <node name="Node1">
            <server-instance template="ServerTemplate" id="TheServer"/>
        </node>
    </application>
</icegrid>
```

## See Also

- [IceGrid Templates](services/icegrid/icegrid-templates)
- [Server Descriptor Element](services/icegrid/icegrid-xml-reference/server-descriptor-element)
- [Server-Instance Descriptor Element](services/icegrid/icegrid-xml-reference/server-instance-descriptor-element)
- [Application Descriptor Element](services/icegrid/icegrid-xml-reference/application-descriptor-element)
- [Using Descriptor Variables and Parameters](services/icegrid/using-descriptor-variables-and-parameters)
