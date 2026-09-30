---
title: Using Descriptor Variables and Parameters
---

[Variable descriptors](../variable-descriptor-element) allow you to define commonly-used information once and refer to
them symbolically throughout your application descriptors.

## Descriptor Substitution Syntax

Substitution for a variable or parameter `VP` is attempted whenever the symbol `${VP}` is encountered, subject to the
limitations and rules described below. Substitution is case-sensitive, and a fatal error occurs if `VP` is not defined.

### Limitations

Substitution is only performed in string values, and excludes the following cases:

- Identifier of a template descriptor definition

  ```xml
  <server-template id="${invalid}" ...>
  ```

- Name of a variable definition

  ```xml
  <variable name="${invalid}" ...>
  ```

- Name of a template parameter definition

  ```xml
  <parameter name="${invalid}" ...>
  ```

- Name of a template parameter assignment

  ```xml
  <server-instance template="T" ${invalid}="val" ...>
  ```

- Name of a node definition

  ```xml
  <node name="${invalid}" ...>
  ```

- Name of an application definition

  ```xml
  <application name="${invalid}" ...>
  ```

Substitution is not supported for values of other types. The example below demonstrates an invalid use of substitution:

```xml
<variable name="server-lifetime" value="true"/>
<node name="Node">
    <server id="Server1" ...>
        <adapter name="Adapter1" server-lifetime=${server-lifetime} .../>
```

In this case, a variable cannot supply the value of `server-lifetime` because that attribute expects a boolean value,
not a string.

Most values are strings, however, so this limitation is rarely a problem.

### Escaping a Variable

You can prevent substitution by escaping a variable reference with an additional leading `$` character. For example, in
order to assign the literal string `${abc}` to a variable, you must escape it as shown below:

```xml
<variable name="x" value="$${abc}"/>
```

The extra `$` symbol is only meaningful when immediately preceding a variable reference, therefore text such as `US$$55`
is not modified. Each occurrence of the characters `$$` preceding a variable reference is replaced with a single `$`
character, and that character does not initiate a variable reference. Consider these examples:

```xml
<variable name="a" value="hi"/>
<variable name="b" value="$${a}"/>
<variable name="c" value="$$${a}"/>
<variable name="d" value="$$$${a}"/>
```

After substitution, `b` has the value `${a}`, `c` has the value `$hi`, and `d` has the value `$${a}`.

## Special Descriptor Variables

IceGrid defines a set of read-only variables to hold information that may be of use to descriptors. The names of these
variables are reserved and cannot be used as variable or parameter names. The table describes the purpose of each
variable and defines the context in which it is valid.

| **Reserved Name** | **Description**                                                                                                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `application`     | The name of the enclosing application.                                                                                                                                                                                          |
| `node`            | The name of the enclosing node.                                                                                                                                                                                                 |
| `node.os`         | The name of the enclosing node's operating system. On Unix, this is value is provided by `uname`. On Windows, the value is `Windows`.                                                                                           |
| `node.hostname`   | The host name of the enclosing node.                                                                                                                                                                                            |
| `node.release`    | The operating system release of the enclosing node. On Unix, this value is provided by `uname`. On Windows, the value is obtained from the `OSVERSIONINFO` data structure.                                                      |
| `node.version`    | The operating system version of the enclosing node. On Unix, this value is provided by `uname`. On Windows, the value represents the current service pack level.                                                                |
| `node.machine`    | The machine hardware name of the enclosing node. On Unix, this value is provided by `uname`. On Windows, the value can be x86, x64, or IA64, depending on the machine architecture.                                             |
| `node.data`       | The absolute pathname of the enclosing [node's data directory](../icegrid-persistent-data).                                                                                                                                     |
| `server`          | The ID of the enclosing server.                                                                                                                                                                                                 |
| `server.data`     | The pathname of the enclosing [server's user data directory](../icegrid-persistent-data), and an alias for `${node.data}/servers/${server}/data`.                                                                               |
| `service`         | The name of the enclosing service.                                                                                                                                                                                              |
| `service.data`    | The pathname of the enclosing [service's user data directory](../icegrid-persistent-data), and an alias for `${node.data}/servers/${server}/data_${service}`.                                                                   |
| `session.id`      | The client session identifier. For sessions created with a user name and password, the value is the user ID; for sessions created from a secure connection, the value is the distinguished name associated with the connection. |

The availability of a variable is easily determined in some cases, but may not be readily apparent in others. For
example, the following example represents a valid use of the `${node}` variable:

```xml
<icegrid>
    <application name="App">
        <server-template id="T" ...>
            <parameter name="id"/>
            <server id="${id}" ...>
                <property name="NodeName" value="${node}"/>
                ...
            </server>
        </server-template>
        <node name="TheNode">
            <server-instance template="T" id="TheServer"/>
        </node>
    </application>
</icegrid>
```

Although the server template descriptor is defined as a child of an application descriptor, its variables are not
evaluated until it is instantiated. Since a template _instance_ is always enclosed within a node, it is able to use the
`${node}` variable.

## Descriptor Variable Scoping Rules

Descriptors may only define variables at the application and node levels. Each node introduces a new scope, such that
defining a variable at the node level overrides (but does not modify) the value of an application variable with the same
name. Similarly, a template parameter overrides the value of a variable with the same name in an enclosing scope. A
descriptor may refer to a variable defined in any enclosing scope, but its value is determined by the nearest scope. The
following figure illustrates these concepts:

![Application variable x is 1. Node A overrides x with 2; Node B defines y as 4 and inherits x as 1. A server instance in Node A passes parameter x as 3 to template T, while its own variable x remains 2. The server template sees parameter x as 3.](/attachments/3.8/variables-in-icegrid-descriptors/variable-scoping.svg)

In this diagram, the variable `x` is defined at the application level with the value `1`. In `nodeA`, `x` is overridden
with the value `2`, whereas `x` remains unchanged in `nodeB`. Within the context of `nodeA`, `x` continues to have the
value `2` in a server instance definition. However, when `x` is used as the name of a template parameter, the node's
definition of `x` is overridden and `x` has the value `3` in the template's scope.

### Resolving a Reference

To resolve a variable reference `${var}`, IceGrid searches for a definition of `var` using the following order of
precedence:

1. Pre-defined variables
2. Template parameters, if applicable
3. Node variables, if applicable
4. Application variables

After the initial substitution, any remaining references are resolved recursively using the following order of
precedence:

1. Pre-defined variables
2. Node variables, if applicable
3. Application variables

### Template Parameters

[Template](../icegrid-templates) parameters are not visible in nested template instances. This situation can only occur
when an IceBox server template instantiates a service template, as shown in the following example:

```xml
<icegrid>
    <application name="IceBoxApp">
        <service-template id="ServiceTemplate">
            <parameter name="name"/>
            <service name="${name}" entry="DemoService:create">
                ...
                <property name="${name}.Identity"
                          value="${id}-${name}"/> <!-- WRONG! -->
            </service>
        </service-template>
        <server-template id="ServerTemplate">
            <parameter name="id"/>
            <icebox id="${id}" endpoints="default" ...>
                <service-instance template="ServiceTemplate" name="Service1"/>
            </icebox>
        </server-template>
        <node name="Node1">
            <server-instance template="ServerTemplate" id="IceBoxServer"/>
        </node>
    </application>
</icegrid>
```

The service template incorrectly refers to `id`, which is a parameter of the server template.

Template parameters can be referenced only in the body of a template; they cannot be used to define other parameters.
For example, the following is illegal:

```xml
<server-template id="ServerTemplate">
    <parameter name="par1"/>
    <parameter name="par2" default="${par1}"/>
    ...
</server-template>
```

### Modifying a Variable

A variable definition can be overridden in an inner scope, but the inner definition does not modify the outer variable.
If a variable is defined multiple times in the same scope (which is only relevant in XML definitions), the most recent
definition is used for all references to that variable. Consider the following example:

```xml
<application name="MyApp">
    <variable name="x" value="1"/>
    <variable name="y" value="${x}"/>
    <variable name="x" value="2"/>
    ...
</application>
```

When descriptors such as these are created, IceGrid validates their variable references but does not perform
substitution until the descriptor is acted upon (such as when a node is generating a configuration file for a server).
As a result, the value of `y` in the above example is `2` because that is the most recent definition of `x`.

## See Also

- [Variable Descriptor Element](../variable-descriptor-element)
- [IceGrid Templates](../icegrid-templates)
- [Application Distribution](../application-distribution)
- [Variables in IceGrid Descriptors](../variables-in-icegrid-descriptors)
