---
id: glacier2-integration-with-icegrid
title: Glacier2 Integration with IceGrid
---

This section provides information on integrating a [Glacier2 router](../glacier2) into your IceGrid environment.

# Configuration Changes for using Glacier2 with IceGrid

A typical IceGrid client must be configured with a [locator proxy](../getting-started-with-icegrid), but the configuration requirements change when the client accesses the location service indirectly via a Glacier2 router as shown below:

![icegrid-glacier2.gif](/attachments/3.8/glacier2-integration-with-icegrid/icegrid-glacier2.gif)

In this situation, it is the router that must be configured with a locator proxy.

Assuming the registry's client endpoint in the illustration uses port `8000`, the router requires the following setting for the [Ice.Default.Locator](../ice-default-properties) property:

```
Ice.Default.Locator=IceGrid/Locator:tcp -h 10.0.0.2 -p 8000
```

Fortunately, the node supplies this property when it starts the router, so there is no need to configure it explicitly. Note that all of the router's clients use the same locator.

# Remote IceGrid Administration via Glacier2

If you intend to administer IceGrid remotely via a Glacier2 router, you must define one of the following properties (or both), depending on whether you use user name and password authentication or a secure connection:

```
Glacier2.SessionManager=IceGrid/AdminSessionManager
Glacier2.SSLSessionManager=IceGrid/AdminSSLSessionManager
```

These session managers are accessible via the registry's administrative session manager endpoints, so the Glacier2 router must be authorized to establish a connection to these endpoints. Note that you must secure these endpoints, otherwise arbitrary clients can manipulate the session managers. An administrative session is allowed to access any object by default. To restrict access to the `IceGrid::AdminSession` object and the `IceGrid::Admin` object that is returned by the session's `getAdmin` operation, you must set the property [IceGrid.Registry.AdminSessionFilters](../icegrid-properties) to one.

# Resource Allocation using Glacier2 and IceGrid

To allocate servers and objects, a program can establish a client session via Glacier2. Depending on the authentication method, one or both of the following properties must be set in the Glacier2 configuration:

```
Glacier2.SessionManager=IceGrid/SessionManager
Glacier2.SSLSessionManager=IceGrid/SSLSessionManager
```

These session managers are accessible via the registry's session manager endpoints, so the Glacier2 router must be authorized to establish a connection to these endpoints.

A client session is allowed to access any object by default. To restrict access to the `IceGrid::Session` and `IceGrid::Query` objects, you must set the property [IceGrid.Registry.SessionFilters](../icegrid-properties) to one. However, you can use the allocation mechanism to access additional objects and adapters. IceGrid adds an identity filter when a client allocates an object and removes that filter again when the object is released. When a client allocates a server, IceGrid adds an adapter identity filter for the server's indirect adapters and removes that filter again when the server is released.

# Session Considerations for Glacier2 and IceGrid

Providing access to [administrative sessions](../icegrid-administrative-sessions) and [client sessions](../resource-allocation-using-icegrid-sessions) both require that you define at least one of the properties [Glacier2.SessionManager](../glacier2-properties) and [Glacier2.SSLSessionManager](../glacier2-properties), which presents a potential problem if you intend to access both types of sessions via the same Glacier2 router.

The simplest solution is to dedicate a router instance to each type of session. However, if you need to access both types of sessions from a single router, you can accomplish it only if you use a different authentication mechanism for each type of session. For example, you can configure the router as follows:

```
Glacier2.SessionManager=IceGrid/SessionManager
Glacier2.SSLSessionManager=IceGrid/AdminSSLSessionManager
```

This configuration uses user name and password authentication for client sessions, and SSL authentication for administrative sessions. If this restriction is too limiting, you must use two router instances.

# Deploying Glacier2 with IceGrid

The Ice distribution includes [default server templates](../icegrid-templates) for Ice services such as IceStorm and Glacier2 that simplify the task of deploying these servers in an IceGrid domain.

The relevant portion from the file `config/template.xml` for Glacier2 is shown below:

```xml
<!-- Creates a Glacier2 router with activation mode "always" -->
<server-template id="Glacier2">
   <parameter name="instance-name" default="${application}.Glacier2"/>
   <parameter name="client-endpoints"/>
   <parameter name="server-endpoints" default=""/>

   <server id="${instance-name}" exe="glacier2router" activation="always">
      <description>A Glacier2 router with activation mode "always".</description>
      <properties>
         <property name="Glacier2.Client.Endpoints" value="${client-endpoints}"/>
         <property name="Glacier2.Server.Endpoints" value="${server-endpoints}"/>
         <property name="Glacier2.InstanceName" value="${instance-name}"/>
      </properties>
   </server>
</server-template>
```

Notice that the server's pathname is `glacier2router`, meaning the program must be present in the node's executable search path.

The template defines only a few properties; if you want to set additional properties, you can define them in the server instance property set.

Of interest is the `instance-name` parameter, which allows you to configure the [Glacier2.InstanceName](../glacier2-properties) property. The parameter's default value includes the name of the application in which the template is used. This parameter also affects the [identities](../getting-started-with-glacier2) of the objects implemented by the router.

Consider the following sample application:

```
<icegrid>
    <application name="Glacier2Demo">
        <node name="Node">
            <server-instance template="Glacier2"
                client-endpoints="tcp -h 5.6.7.8 -p 8000"
                server-endpoints="tcp -h 10.0.0.1"/>
            ...
        </node>
    </application>
</icegrid>
```

Instantiating the `Glacier2` template creates a server identified as `Glacier2Demo.Glacier2` (as determined by the default value for the `instance-name` parameter). The router's objects use this value as the category in their identities, such as `Glacier2Demo.Glacier2/router`. The router proxy used by clients must contain a matching identity.

{% callout type="info" %}
We recommend you keep the default instance name (Glacier2) unless you find yourself in the unusual situation where the same program needs to communicate with multiple Glacier2 routers.
{% /callout %}

In order to refer to the `Glacier2` template in your application, you must have already configured the registry to use the `config/templates.xml` file as your [default templates](../icegrid-templates), or copied the template into the XML file describing your application.

Note that IceGrid cannot start a Glacier2 router if the router's security configuration requires that a passphrase be entered. In this situation, you have no choice but to start the router yourself so that you can provide the passphrase when prompted.

##### See Also

- [Glacier2](../glacier2)
- [IceGrid Templates](../icegrid-templates)
- [Getting Started with Glacier2](../getting-started-with-glacier2)
- [Glacier2.*](../glacier2-properties)
- [IceGrid.*](../icegrid-properties)
