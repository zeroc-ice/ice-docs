---
title: Variable Descriptor Element
---

A `variable` element defines a [variable](services/icegrid/using-descriptor-variables-and-parameters).

This element may only appear as a child of an
[application](services/icegrid/icegrid-xml-reference/application-descriptor-element) element or
[node](services/icegrid/icegrid-xml-reference/node-descriptor-element) element.

The following attributes are supported:

| **Attribute** | **Description**                                                                                                                       | **Required** |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `name`        | Specifies the variable name. The value of this variable is substituted whenever its name is used in variable syntax, as in `${name}`. | Yes          |
| `value`       | Specifies the variable value. If not defined, the default value is an empty string.                                                   | No           |

Here is an example to demonstrate the use of this element:

```xml
<icegrid>
    <application name="SampleApp">
        <variable name="Var1" value="foo"/>
        <variable name="Var2" value="${Var1}bar"/>
        ...
    </application>
</icegrid>
```

## See Also

- [Using Descriptor Variables and Parameters](services/icegrid/using-descriptor-variables-and-parameters)
- [Application Descriptor Element](services/icegrid/icegrid-xml-reference/application-descriptor-element)
- [Node Descriptor Element](services/icegrid/icegrid-xml-reference/node-descriptor-element)
