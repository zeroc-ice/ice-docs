---
title: IceGrid and the Administrative Facility
---

The Ice [administrative facility](../administrative-facility) provides a general purpose solution for administering
individual Ice programs. IceGrid extends this functionality in several convenient ways:

- IceGrid automatically enables the facility in deployed servers, in its nodes and in its registry replicas.
- IceGrid uses the [Process facet](../the-process-facet) to terminate an active server, giving it an opportunity to
  perform an orderly shutdown.
- IceGrid provides a secure mechanism for invoking administrative operations on deployed servers, IceGrid nodes and
  IceGrid registry replicas.

The IceGrid administrative tools in turn use IceGrid's extended administrative facility to:

- display the [properties](../the-properties-facet) of servers and services.
- attach remote loggers to the [Logger](../logger-facility) of servers, services, nodes and registry replicas.
- manipulate and monitor [IceBox](../icebox) services.

We discuss each of these items in separate sections below.

# Enabling the Administrative Facility for a Deployed Server, Node or Registry Replica

As we saw in our [deployment example](../using-icegrid-deployment), the configuration properties for a deployed server
include definitions for the following properties:

- [Ice.Admin.Endpoints](../ice-admin-properties)
- [Ice.Admin.ServerId](../ice-admin-properties)

The definition of `Ice.Admin.Endpoints` enables the [Administrative Facility](../administrative-facility).

## Ice.Admin.Endpoints for Servers

If a server's descriptor does not set [Ice.Admin.Enabled](../ice-admin-properties) and does not supply a value for
`Ice.Admin.Endpoints`, IceGrid supplies a default value for `Ice.Admin.Endpoints` as shown below:

```config
Ice.Admin.Endpoints=tcp -h 127.0.0.1
```

For [security reasons](../security-considerations-for-administrative-facets), IceGrid specifies the local host interface
(`127.0.0.1`) so that administrative access is limited to clients running on the same host. This configuration permits
the IceGrid node to invoke operations on the server's [admin object](../the-admin-object), but prevents remote access
unless the client establishes an [IceGrid administrative session](../icegrid-administrative-sessions).

Specifying a fixed port is unnecessary because the server registers its endpoints with IceGrid upon each new activation.

## admin Objects in Nodes and Registry Replicas

Each IceGrid node and IceGrid registry replica provides by default an [admin object](../the-admin-object) hosted in the
`IceGrid.Node` object adapter (for nodes) or in the `IceGrid.Registry.Internal` object adapter (for registry replicas).
If you don't want to an admin object in a node or registry replica, set [Ice.Admin.Enabled](../ice-admin-properties) to
0 or a negative value in this node or registry's configuration.

Each of these admin objects carries all the built-in facets, currently `Logger`, Metrics, Process and Properties.
Proxies to these admin objects can be retrieved through the `getNodeAdmin` and `getRegistryAdmin` operations
[described below](../icegrid-and-the-administrative-facility#obtaining-a-proxy).

# Deactivating a Deployed Server

An IceGrid node uses the [Ice::Process interface](../the-process-facet) to gracefully deactivate a server. This
interface is implemented by the administrative facet named `Process`.

The Ice runtime registers an `Ice::Process` proxy with the IceGrid registry when properly configured. Registration
normally occurs during communicator initialization, but it can be delayed when a server needs to install its
[own administrative facets](../custom-administrative-facets).

When the node is ready to deactivate a server, it invokes the `shutdown` operation on the server's `Ice::Process` proxy.
If the server does not terminate in a timely manner, the node asks the operating system to terminate the process. Each
server can be configured with its own [deactivation timeout](../server-descriptor-element). If no timeout is configured,
the node uses the value of the property [IceGrid.Node.WaitTime](../icegrid-properties), which defaults to `60` seconds.

If a server does not register an `Ice::Process` proxy, the IceGrid node cannot request a graceful termination and must
resort instead to a more drastic, and potentially harmful, alternative by asking the operating system to terminate the
server's process. On Unix, the node sends the `SIGTERM` signal to the process and, if the server does not terminate
within the deactivation timeout period, sends the `SIGKILL` signal.

On Windows, the node first sends a `Ctrl+Break` event to the server and, if the server does not stop within the
deactivation timeout period, terminates the process immediately.

Servers that disable the `Process` facet can install a signal handler in order to intercept the node's notification
about pending deactivation. However, we recommend that servers be allowed to use the `Process` facet when possible.

# Routing Administrative Requests

IceGrid defaults to using the local host interface when defining the endpoints of a deployed server's
[administrative object adapter](../icegrid-and-the-administrative-facility). This configuration allows local clients
such as the IceGrid node to access the server's [admin object](../the-admin-object) while preventing direct invocations
from remote clients. A server's `admin` object may still be accessed remotely, but only by clients that establish an
[IceGrid administrative session](../icegrid-administrative-sessions). To facilitate these requests, IceGrid uses an
intermediary object that relays requests to the server via its node. For example, the following figure illustrates the
path of a `getProperty` invocation:

![An administrative client sends getProperty to the registry, which forwards the request through the node to the server.](/attachments/3.8/icegrid-and-the-administrative-facility/routing.svg)

## Obtaining a Proxy

During an [administrative session](../icegrid-administrative-sessions), a client has two ways of obtaining the
intermediary proxy for a server's [admin object](../the-admin-object):

```slice
module IceGrid
{
    interface Admin
    {
        idempotent string getServerAdminCategory();
        idempotent Object* getServerAdmin(string id)
            throws ServerNotExistException,
                   NodeUnreachableException,
                   DeploymentException;
        // ...
    }
}
```

If the client wishes to construct the proxy itself and already knows the server's ID, the client need only modify the
proxy of the `IceGrid::Admin` object with a new identity. The identity's category must be the return value of
`getServerAdminCategory`, while its name is the ID of the desired server. The example below demonstrates how to create
the proxy and access the [Properties facet](../the-properties-facet) of a server:

```cpp
IceGrid::AdminSessionPrx session = ...;
auto admin = session.getAdmin();
Ice::Identity serverAdminId;
serverAdminId.category = admin->getServerAdminCategory();
serverAdminId.name = "MyServerId";
auto props = admin->ice_identity(serverAdminId)
                   ->ice_facet<Ice::PropertiesAdminPrx>("Properties");
```

Alternatively, the `getServerAdmin` operation returns a proxy that refers to the `admin` object of the given server.
This operation performs additional validation and therefore may raise one of the exceptions shown in its signature
above.

A client can also obtain an intermediary proxy to the admin object of an IceGrid node or IceGrid registry replica by
calling `getNodeAdmin` or `getRegistryAdmin`:

```slice
module IceGrid
{
    interface Admin
    {
        idempotent Object* getNodeAdmin(string name)
            throws NodeNotExistException, NodeUnreachableException;

         idempotent Object* getRegistryAdmin(string name)
            throws RegistryNotExistException;
        // ...
    }
}
```

The name parameter corresponds to the node name or registry replica name. There is no operation comparable to
`getServerAdminCategory` for IceGrid nodes and IceGrid registry replicas.

## Callbacks without Glacier2

IceGrid also supports the relaying of callback requests from a back-end server to an administrative client over the
client's existing connection to the registry, which is especially important for a client using a network port that is
forwarded by a firewall or protected by a secure tunnel.

For this mechanism to work properly, a client that established its
[administrative session](../icegrid-administrative-sessions) directly with IceGrid and not via a
[Glacier2 router](../glacier2-integration-with-icegrid) must take additional steps to ensure that the proxies for its
callback objects contain the proper identities and endpoints. The `IceGrid::AdminSession` interface provides an
operation to help with the client's preparations:

```slice
module IceGrid
{
    interface AdminSession ...
    {
        idempotent Object* getAdminCallbackTemplate();
        // ...
    }
}
```

As its name implies, the `getAdminCallbackTemplate` operation returns a _template proxy_ that supplies the identity and
endpoints a client needs to configure its callback objects. The information contained in the template proxy is valid for
the lifetime of the administrative session. This operation returns a null proxy if the client's administrative session
was established via a Glacier2 router, in which case the client should use the callback strategy described in the next
section instead.

The endpoints contained in the template proxy are those of an object adapter in the IceGrid registry. The client must
transfer these endpoints to the proxies for its callback objects so that callback requests from a server are sent first
to IceGrid and then relayed over a [bidirectional connection](../bidirectional-connections) to the client, as shown
below:

![The server sends a callback to the registry, which forwards it to the administrative client over the existing client connection.](/attachments/3.8/icegrid-and-the-administrative-facility/routing2.svg)

Here is the complete list of steps:

1. Invoke `getAdminCallbackTemplate` to obtain the template proxy.
2. Extract the category from the template proxy's identity and use it in all callback objects.
3. Extract the endpoints from the template proxy and use them to establish the published endpoints of the callback
   object adapter.
4. Create the callback object adapter and associate it with the administrative session's connection, thereby
   establishing a bidirectional connection with IceGrid.
5. Add servants to the callback object adapter.

As an example, let us assume that we have deployed an IceBox server with the server id `icebox1` and our objective is to
register a [ServiceObserver](../icebox-administration) callback that monitors the state of the IceBox services. The
first step is to obtain a proxy for the administrative facet named `IceBox.ServiceManager`:

```cpp
IceGrid::AdminSessionPrx session = ...;
auto admin = session.getAdmin();
auto svcmgr = admin->getServerAdmin("icebox1")
                   ->ice_facet<IceBox::ServiceManagerPrx>("IceBox.ServiceManager");
```

Next, we retrieve the template proxy and compose the published endpoints for our callback object adapter:

```cpp
auto tmpl = admin->getAdminCallbackTemplate();
auto endpts = tmpl->ice_getEndpoints();
string publishedEndpoints;
for (const auto& endpoint : endpts)
{
    if (publishedEndpoints.empty())
    {
        publishedEndpoints = endpoint->toString();
    }
    else
    {
        publishedEndpoints += ":" + endpoint->toString();
    }
}
communicator->getProperties()->setProperty(
    "CallbackAdapter.PublishedEndpoints",
     publishedEndpoints);
```

The final steps involve creating the callback object adapter, adding a servant, establishing the bidirectional
connection and registering our callback with the service manager:

```cpp
auto callbackAdapter = communicator->createObjectAdapter("CallbackAdapter");
Ice::Identity cbid;
cbid.category = tmpl->ice_getIdentity().category;
cbid.name = "observer";
auto obs = make_shared<ObserverI>();
auto cb = callbackAdapter->add<IceBox::ServiceObserverPrx>(obs, cbid);
callbackAdapter->activate();
session->ice_getConnection()->setAdapter(callbackAdapter);
svcmgr->addObserver(cb);
```

At this point the client is ready to receive callbacks from the IceBox server whenever one of its services changes
state.

## Callbacks with Glacier2

A client that creates an [administrative session](../icegrid-administrative-sessions) via a
[Glacier2 router](../glacier2-integration-with-icegrid) already has a bidirectional connection over which callbacks from
administrative facets are relayed. The flow of requests is shown in the illustration below, which presents a simplified
view with the router and IceGrid services all running on the same host.

![The server sends a callback to Glacier2, which forwards it to the administrative client.](/attachments/3.8/icegrid-and-the-administrative-facility/routing3.svg)

To prepare for [receiving callbacks](../callbacks-through-glacier2), the client must perform the same steps as for any
router client:

1. Obtain a proxy for the router.
2. Retrieve the category to be used in callback objects.
3. Create the callback object adapter and associate it with the router, thereby establishing a bidirectional connection.
4. Add servants to the callback object adapter.

Repeating the example from the previous section, we assume that we have deployed an IceBox server with the server ID
`icebox1` and our objective is to register a [ServiceObserver](../icebox-administration) callback that monitors the
state of the IceBox services. The first step is to obtain a proxy for the administrative facet named
`IceBox.ServiceManager`:

```cpp
IceGrid::AdminSessionPrx session = ...;
auto admin = session.getAdmin();
auto obj =
auto svcmgr = admin->getServerAdmin("icebox1")
                    ->ice_facet<IceBox::ServiceManagerPrx>("IceBox.ServiceManager");
```

Now we are ready to create the object adapter and register the observer:

```cpp
auto router = communicator->getDefaultRouter();
auto callbackAdapter = communicator->createObjectAdapterWithRouter(
    "CallbackAdapter",
     router);

Ice::Identity cbid;
cbid.category = router->getCategoryForClient();
cbid.name = "observer";
auto obs = make_shared<ObserverI>();
auto cn = callbackAdapter->add<IceBox::ServiceObserverPrx>>(obs, cbid);
callbackAdapter->activate();
svcmgr->addObserver(cb);
```

At this point the client is ready to receive callbacks from the IceBox server whenever one of its services changes
state.

# Using the Administrative Facility in IceGrid Utilities

This section discusses the ways in which the [IceGrid utilities](../icegridadmin-command-line-tool) make use of the
administrative facility.

## Properties

The command line and graphical utilities allow you to explore the configuration properties of a server or service.

One property in particular, `BuildId`, is given special consideration by the graphical utility. Although it is not used
by the Ice run time, the `BuildId` property gives you the ability to describe the build configuration of your
application. The property's value is shown by the graphical utility in its own field in the attributes of a server or
service, as well as in the list of properties. You can also retrieve the value of this property using the command-line
utility with the following statement:

```shell
server property MyServerId BuildId
```

Or, for an IceBox service, with this command:

```shell
service property MyServerId MyService BuildId
```

The utilities use the [Properties facet](../the-properties-facet) to access these properties, via a proxy obtained as
described [above](../icegrid-and-the-administrative-facility).

## Administering IceBox Services

[IceBox](../icebox) provides an administrative facet that implements the `IceBox::ServiceManager` interface, which
supports operations for stopping an active service, and for starting a service that is currently inactive. These
operations are available in both the command line and graphical utilities.

IceBox also defines a [ServiceObserver](../icebox-administration) interface for receiving callbacks when services are
stopped or started. The graphical utility implements this interface so that it can present an updated view of the state
of an IceBox server. We presented [examples](../icegrid-and-the-administrative-facility) that demonstrate how to
register an observer with the IceBox administrative facet.

##### See Also

- [Administrative Facility](../administrative-facility)
- [The Process Facet](../the-process-facet)
- [The Properties Facet](../the-properties-facet)
- [Creating the admin Object](../creating-the-admin-object)
- [The admin Object](../the-admin-object)
- [Custom Administrative Facets](../custom-administrative-facets)
- [Security Considerations for Administrative Facets](../security-considerations-for-administrative-facets)
- [Bidirectional Connections](../bidirectional-connections)
- [Using IceGrid Deployment](../using-icegrid-deployment)
- [Glacier2 Integration with IceGrid](../glacier2-integration-with-icegrid)
- [IceGrid Administrative Sessions](../icegrid-administrative-sessions)
- [icegridadmin Command Line Tool](../icegridadmin-command-line-tool)
- [Callbacks through Glacier2](../callbacks-through-glacier2)
- [IceBox](../icebox)
- [IceBox Administration](../icebox-administration)
- [IceGrid.*](../icegrid-properties)
