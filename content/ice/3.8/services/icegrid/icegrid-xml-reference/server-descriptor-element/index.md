---
title: Server Descriptor Element
---

A `server` element defines a server to be deployed on a node. It typically contains at least one
[adapter](../adapter-descriptor-element) element, and may supply additional information such as
[command-line options](../using-command-line-options-in-descriptors),
[environment variables](../setting-environment-variables-in-descriptors), and
[configuration properties](../properties-descriptor-element).

This element may only appear as a child of a [node](../node-descriptor-element) element or a
[server-template](../server-template-descriptor-element) element.

The following attributes are supported:

| **Attribute**          | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                 | **Required** |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `activation`           | Specifies whether the server's [activation](../../icegrid-server-activation) mode. Legal values are `manual`, `on-demand`, `always` and `session`. If not specified, manual activation is used by default.                                                                                                                                                                                                                                                      | No           |
| `activation-timeout`   | Defines the number of seconds a node will wait for the server to [activate](../../icegrid-server-activation). If the timeout expires, a client waiting to receive the endpoints of an object adapter in this server will receive an empty set of endpoints. If not defined, the default timeout is the value of the [IceGrid.Node.WaitTime](../../../../property-reference/icegrid-properties#icegrid.node.waittime) property configured for the server's node. | No           |
| `allocatable`          | Specifies whether the server can be [allocated](../../resource-allocation-using-icegrid-sessions). A server is allocated implicitly when one of its allocatable objects is allocated. The value of this attribute is ignored if the server activation mode is `session`; a server with this activation mode is always allocatable. Otherwise, if not specified and the server activation mode is not `session`, the server is not allocatable.                  | No           |
| `deactivation-timeout` | Defines the number of seconds a node will wait for the server to [deactivate](../../icegrid-server-activation). If the timeout expires, the node terminates the server process. If not defined, the default timeout is the value of the node's configuration property [IceGrid.Node.WaitTime](../../../../property-reference/icegrid-properties#icegrid.node.waittime).                                                                                         | No           |
| `exe`                  | The pathname of the server executable. The node resolves a relative path that contains `/`, such as `bin/server`, against the server's working directory: `pwd` when set, otherwise the node's working directory. For a name without `/`, such as `server`, the node searches the `PATH` of the server's environment on Linux and macOS, and the standard Windows search path on Windows, where it appends `.exe` when the name has no extension.               | Yes          |
| `ice-version`          | Specifies the Ice version in use by this server. If not defined, IceGrid assumes the server uses the same version that IceGrid itself uses.                                                                                                                                                                                                                                                                                                                     | No           |
| `id`                   | Specifies the identifier for this server. The identifier must be unique among all servers in the registry. Within the server, child elements can refer to its identifier using the [reserved variable](../../using-descriptor-variables-and-parameters) `${server}`.                                                                                                                                                                                            | Yes          |
| `pwd`                  | The default working directory for the server. If not defined, the server is started in the node's current working directory.                                                                                                                                                                                                                                                                                                                                    | No           |
| `user`                 | Specifies the user string from which the node determines the operating system account that runs the server. [Activating Servers with Specific User IDs](../../icegrid-server-activation#activating-servers-with-specific-user-ids) describes how the node maps this value to an account, the user string the node uses when this attribute is not specified, and when the node runs a server as root.                                                           | No           |

An optional nested [description](../description-descriptor-element) element provides free-form descriptive text.

Here is an example to demonstrate the use of this element:

```xml
<server id="MyServer"
        activation="on-demand"
        activation-timeout="60"
        deactivation-timeout="60"
        exe="/opt/app/bin/myserver"
        pwd="/">
    <option>--Ice.Trace.Network=1</option>
    <env>PATH=/opt/Ice/bin:$PATH</env>
    <property name="ServerId" value="${server}"/>
    <adapter name="Adapter1" .../>
</server>
```

## See Also

- [Adapter Descriptor Element](../adapter-descriptor-element)
- [Properties Descriptor Element](../properties-descriptor-element)
- [Node Descriptor Element](../node-descriptor-element)
- [Server-Template Descriptor Element](../server-template-descriptor-element)
- [Description Descriptor Element](../description-descriptor-element)
- [Using Command Line Options in Descriptors](../using-command-line-options-in-descriptors)
- [Setting Environment Variables in Descriptors](../setting-environment-variables-in-descriptors)
- [Application Distribution](../../application-distribution)
- [IceGrid Server Activation](../../icegrid-server-activation)
- [Using Descriptor Variables and Parameters](../../using-descriptor-variables-and-parameters)
