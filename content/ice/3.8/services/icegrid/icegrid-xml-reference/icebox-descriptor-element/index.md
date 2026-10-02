---
title: IceBox Descriptor Element
---

An `icebox` element defines an [IceBox](services/icebox) server to be deployed on a node. It typically contains at least
one [service](services/icegrid/icegrid-xml-reference/service-descriptor-element) element, and may supply additional
information such as
[command-line options](services/icegrid/icegrid-xml-reference/using-command-line-options-in-descriptors),
[environment variables](services/icegrid/icegrid-xml-reference/setting-environment-variables-in-descriptors), and
[configuration properties](services/icegrid/icegrid-xml-reference/properties-descriptor-element).

This element may only appear as a child of a [node](services/icegrid/icegrid-xml-reference/node-descriptor-element)
element or a [server-template](services/icegrid/icegrid-xml-reference/server-template-descriptor-element) element.

This element supports the same attributes as the
[server](services/icegrid/icegrid-xml-reference/server-descriptor-element) element.

An optional nested [description](services/icegrid/icegrid-xml-reference/description-descriptor-element) element provides
free-form descriptive text.

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

- [IceBox](services/icebox)
- [Service Descriptor Element](services/icegrid/icegrid-xml-reference/service-descriptor-element)
- [Adapter Descriptor Element](services/icegrid/icegrid-xml-reference/adapter-descriptor-element)
- [Properties Descriptor Element](services/icegrid/icegrid-xml-reference/properties-descriptor-element)
- [Node Descriptor Element](services/icegrid/icegrid-xml-reference/node-descriptor-element)
- [Server-Template Descriptor Element](services/icegrid/icegrid-xml-reference/server-template-descriptor-element)
- [Server Descriptor Element](services/icegrid/icegrid-xml-reference/server-descriptor-element)
- [Description Descriptor Element](services/icegrid/icegrid-xml-reference/description-descriptor-element)
- [Using Command Line Options in Descriptors](services/icegrid/icegrid-xml-reference/using-command-line-options-in-descriptors)
- [Setting Environment Variables in Descriptors](services/icegrid/icegrid-xml-reference/setting-environment-variables-in-descriptors)
- [Administrative Facility](administration/administrative-facility)
