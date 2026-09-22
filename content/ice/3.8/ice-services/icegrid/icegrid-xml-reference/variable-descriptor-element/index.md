---
id: variable-descriptor-element
title: Variable Descriptor Element
---

A `variable` element defines a [variable](../using-descriptor-variables-and-parameters).

This element may only appear as a child of an [application](../application-descriptor-element) element or
[node](../node-descriptor-element) element.

The following attributes are supported:

| **Attribute** | **Description**                                                                                                                       | **Required** |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `name`        | Specifies the variable name. The value of this variable is substituted whenever its name is used in variable syntax, as in `${name}`. | Yes          |
| `value`       | Specifies the variable value. If not defined, the default value is an empty string.                                                   | No           |

Here is an example to demonstrate the use of this element:

```xml
<icegrid>
    <application name="SampleApp">
        <variable name="Var1" value="foo"/>
        <variable name="Var2" value="${Var1}bar"/>
        ...
    </application>
</icegrid>
```

##### See Also

- [Using Descriptor Variables and Parameters](../using-descriptor-variables-and-parameters)
- [Application Descriptor Element](../application-descriptor-element)
- [Node Descriptor Element](../node-descriptor-element)
