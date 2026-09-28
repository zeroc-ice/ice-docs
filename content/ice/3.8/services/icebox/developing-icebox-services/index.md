---
title: Developing IceBox Services
---

# The IceBox `Service` Interface

Writing an IceBox service requires implementing the [IceBox Service](https://code.zeroc.com/manual/IceBox/Service)
interface or abstract base class.

Your service implements two methods, `start` and `stop`. IceBox calls `start` after loading the service and `stop` when
shutting down a running service. An administrator can also stop and restart the service through the
[service manager](../icebox-administration). IceBox reuses the same service object, communicator, and arguments for each
restart, whether the communicator belongs to one service or is shared by several services.

The `start` method initializes the service, typically by creating an object adapter and servants. The `name` and `args`
parameters supply information from the service's [configuration](../configuring-icebox-services), and the `communicator`
parameter supplies a communicator that IceBox creates for the service. Services that
[share a communicator](../configuring-icebox-services) must use distinct names for their object adapters.

`start` must return once the service is initialized, because IceBox waits for it before starting the next service and
before activating its admin object.

The `stop` method must release the resources owned by the service, including the
[object adapters](../object-adapter-activation-and-deactivation) it created. An administrative stop calls `stop` and
nothing else, so an adapter left behind keeps dispatching to a service that IceBox records as stopped. Destroy each
adapter rather than deactivating it: `destroy` waits for pending requests and releases the adapter's name, while a
deactivated adapter keeps its name registered with the communicator, so a later `start` that recreates it raises
`AlreadyRegisteredException`.

IceBox destroys the service communicators when the server shuts down. An administrative stop keeps the communicator
available for the next `start`.

# IceBox Service Example

{% language-section name="lang-1" /%}

[Configuring IceBox Services](../configuring-icebox-services) provides more information on entry points and describes
how to configure your service into an IceBox server.

# IceBox Service Failures

A service implementation can indicate a failure by throwing an exception. IceBox handles the exception according to when
it occurs:

- **Initial startup:** If the service's entry point or initial `start` call throws, IceBox logs an error, stops the
  services that have already started in reverse startup order, destroys the service communicators, and exits.
- **Administrative start:** If `start` throws during `ServiceManager.startService`, IceBox logs a warning, records the
  service as stopped, and returns normally from `startService`.
- **Administrative stop:** If `stop` throws during `ServiceManager.stopService`, IceBox logs a warning, records the
  service as started, and returns normally from `stopService`.
- **Server shutdown:** If `stop` throws, IceBox logs a warning and continues stopping the remaining services and
  destroying their communicators.

After an administrative start or stop, use `ServiceManager.isServiceRunning` to check whether IceBox records the service
as started. A `start` or `stop` call that throws may have changed some resources before failing, so the recorded state
does not show whether the service works.

If `start` fails, the service must release resources it acquired during that attempt before propagating the exception.
IceBox calls `stop` only for services it records as started.

##### See Also

- [Configuring IceBox Services](../configuring-icebox-services)
- [Starting the IceBox Server](../starting-the-icebox-server)
