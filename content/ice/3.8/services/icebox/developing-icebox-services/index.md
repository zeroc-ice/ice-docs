---
title: Developing IceBox Services
---

## The IceBox `Service` Interface

Writing an IceBox service requires implementing the [IceBox Service](api:IceBox/Service) interface or abstract base
class.

Your service implements two methods, `start` and `stop`. IceBox calls `start` after loading the service and `stop` when
shutting down a running service. An administrator can also stop and restart the service through the
[service manager](../icebox-administration). IceBox reuses the same service object, communicator, and arguments for each
restart.

The `start` method initializes the service, typically by creating an object adapter and servants. The `name` and `args`
parameters supply information from the service's [configuration](../configuring-icebox-services), and the `communicator`
parameter supplies a communicator that IceBox creates for the service. Services that
[share a communicator](../configuring-icebox-services) must use distinct names for their object adapters.

`start` must return once the service is initialized, because IceBox waits for it before starting the next service and
before activating its admin object.

The `stop` method must release the resources owned by the service and destroy the
[object adapters](../../../runtime/dispatch/object-adapter-activation-and-deactivation) it created.

IceBox owns the communicator it passes to `start` and destroys it when the server shuts down.

## IceBox Service Example

{% language-section name="mapping" /%}

[Configuring IceBox Services](../configuring-icebox-services) provides more information on entry points and describes
how to configure your service into an IceBox server.

## IceBox Service Failures

A service implementation can indicate a failure by throwing an exception. IceBox handles the exception according to when
it occurs:

- **Initial startup:** If the service's entry point or initial `start` call throws, the server terminates as described
  in [Starting the IceBox Server](../starting-the-icebox-server#icebox-server-failures).
- **Administrative start:** If `start` throws during `ServiceManager.startService`, IceBox logs a warning, records the
  service as stopped, and returns normally from `startService`.
- **Administrative stop:** If `stop` throws during `ServiceManager.stopService`, IceBox logs a warning, records the
  service as started, and returns normally from `stopService`.
- **Server shutdown:** If `stop` throws, IceBox logs a warning and continues stopping the remaining services and
  destroying their communicators.

Because `startService` and `stopService` return normally in these cases, use `ServiceManager.isServiceRunning` to check
whether the service started or stopped.

If `start` fails, the service must release resources it acquired during that attempt before propagating the exception.
IceBox calls `stop` only for services it records as started.

## See Also

- [Configuring IceBox Services](../configuring-icebox-services)
- [Starting the IceBox Server](../starting-the-icebox-server)
