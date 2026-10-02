---
title: Service-Template Descriptor Element
---

A `service-template` element defines a [template](services/icegrid/icegrid-templates) for a
[service](services/icegrid/icegrid-xml-reference/service-descriptor-element) element, simplifying the task of deploying
multiple instances of the same service definition. The template should contain a parameterized `service` element that is
instantiated using a [service-instance](services/icegrid/icegrid-xml-reference/service-instance-descriptor-element)
element.

This element may only appear as a child of an
[application](services/icegrid/icegrid-xml-reference/application-descriptor-element) element.

The following attributes are supported:

| **Attribute** | **Description**                                                                                                                   | **Required** |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `id`          | Specifies the identifier for the service template. This identifier must be unique among all service templates in the application. | Yes          |

A template may declare [parameters](services/icegrid/using-descriptor-variables-and-parameters) that are used to
instantiate the `service` element. You can define a default value for each parameter. Parameters without a default value
are considered mandatory and values for them must be supplied by the `service-instance` element.

Here is an example to demonstrate the use of this element:

```xml
<icegrid>
    <application name="IceBoxApp">
        <service-template id="ServiceTemplate">
            <parameter name="name"/>
            <service name="${name}" entry="DemoService:create">
                <adapter name="${service}" .../>
            </service>
        </service-template>
        <node name="Node1">
            <icebox id="IceBoxServer" ...>
                <service-instance template="ServiceTemplate" name="Service1"/>
            </icebox>
        </node>
    </application>
</icegrid>
```

## See Also

- [IceGrid Templates](services/icegrid/icegrid-templates)
- [Service Descriptor Element](services/icegrid/icegrid-xml-reference/service-descriptor-element)
- [Service-Instance Descriptor Element](services/icegrid/icegrid-xml-reference/service-instance-descriptor-element)
- [IceBox Integration with IceGrid](services/icegrid/icebox-integration-with-icegrid)
- [Using Descriptor Variables and Parameters](services/icegrid/using-descriptor-variables-and-parameters)
