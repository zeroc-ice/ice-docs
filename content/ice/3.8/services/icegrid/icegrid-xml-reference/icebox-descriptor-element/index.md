---
title: IceBox Descriptor Element
---

An `icebox` element defines an [IceBox](../icebox) server to be deployed on a node. It typically contains at least one
[service](../service-descriptor-element) element, and may supply additional information such as
[command-line options](../using-command-line-options-in-descriptors),
[environment variables](../setting-environment-variables-in-descriptors), and
[configuration properties](../properties-descriptor-element).

This element may only appear as a child of a [node](../node-descriptor-element) element or a
[server-template](../server-template-descriptor-element) element.

This element supports the same attributes as the [server](../server-descriptor-element) element.

An optional nested [description](../description-descriptor-element) element provides free-form descriptive text.

Here is an example to demonstrate the use of this element:

```xml
<icebox id="MyIceBox"
        activation="on-demand"
        activation-timeout="60"
        deactivation-timeout="60"
        exe="/opt/Ice/bin/icebox"
        pwd="/">
    <option>--Ice.Trace.Network=1</option>
    <env>PATH=/opt/Ice/bin:$PATH</env>
    <property name="IceBox.UseSharedCommunicator.Service1" value="1"/>
    <service name="Service1" .../>
    <service-instance template="ServiceTemplate" name="Service2"/>
</icebox>
```

## See Also

- [IceBox](../icebox)
- [Service Descriptor Element](../service-descriptor-element)
- [Adapter Descriptor Element](../adapter-descriptor-element)
- [Properties Descriptor Element](../properties-descriptor-element)
- [Node Descriptor Element](../node-descriptor-element)
- [Server-Template Descriptor Element](../server-template-descriptor-element)
- [Server Descriptor Element](../server-descriptor-element)
- [Description Descriptor Element](../description-descriptor-element)
- [Using Command Line Options in Descriptors](../using-command-line-options-in-descriptors)
- [Setting Environment Variables in Descriptors](../setting-environment-variables-in-descriptors)
- [Administrative Facility](../administrative-facility)
