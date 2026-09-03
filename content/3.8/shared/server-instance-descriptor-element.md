---
id: server-instance-descriptor-element
title: Server-Instance Descriptor Element
---

A `server-instance` element deploys an instance of a [server-template](../server-template-descriptor-element) element on a node. It may supply additional information such as [configuration properties](../properties-descriptor-element).

This element may only appear as a child of a [node](../node-descriptor-element) element.

The following attributes are supported:

| **Attribute** | **Description** | **Required** |
| --- | --- | --- |
| `template` | Identifies the server [template](../icegrid-templates). | Yes |

All other attributes of the element must correspond to [parameters](../using-descriptor-variables-and-parameters) declared by the template. The `server-instance` element must provide a value for each parameter that does not have a default value supplied by the template.

Here is an example to demonstrate the use of this element:

```xml
<icegrid>
    <application name="SampleApp">
        <server-template id="ServerTemplate">
            <parameter name="id"/>
            <server id="${id}" activation="manual" .../>
        </server-template>
        <node name="Node1">
            <server-instance template="ServerTemplate" id="TheServer">
                <properties>
                    <property name="Debug" value="1"/>
                </properties>
            </server-instance>
        </node>
    </application>
</icegrid>
```

##### See Also

- [Server-Template Descriptor Element](../server-template-descriptor-element)
- [Node Descriptor Element](../node-descriptor-element)
- [IceGrid Templates](../icegrid-templates)
- [Using Descriptor Variables and Parameters](../using-descriptor-variables-and-parameters)
