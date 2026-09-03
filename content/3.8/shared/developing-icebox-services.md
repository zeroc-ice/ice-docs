---
id: developing-icebox-services
title: Developing IceBox Services
---

# The IceBox `Service` Interface

Writing an IceBox service requires implementing the [IceBox Service](https://code.zeroc.com/manual/IceBox/Service) interface or abstract base class.

Your service needs to implement only two methods, `start` and `stop`. These methods are invoked by the IceBox server: `start` is called after the service is loaded, and `stop` is called when the IceBox server is shutting down.

The `start` method is the service's opportunity to initialize itself; this typically includes creating an object adapter and servants. The `name` and `args` parameters supply information from the service's [configuration](../configuring-icebox-services), and the `communicator` parameter is a communicator created by the IceBox server for use by the service. Depending on the service configuration, this communicator instance may be [shared by other services](../configuring-icebox-services) in the same IceBox server, therefore care should be taken to ensure that items such as object adapters are given unique names.

The `stop` method must reclaim any resources used by the service. Generally, a service deactivates its object adapter, and may also need to invoke `waitForDeactivate` on the object adapter in order to ensure that all pending requests have been completed before the clean up process can proceed. The server (not the service) is responsible for destroying the communicator instance that was passed to `start`.

Whether the service's implementation of `stop` should explicitly destroy its object adapter depends on other factors. For example, the adapter should be destroyed if the service uses a shared communicator, especially if the service could eventually be restarted. In other circumstances, the service can allow its adapter to be destroyed as part of the communicator's destruction.

# IceBox Service Example

{% language-section name="lang-1" /%}

[Configuring IceBox Services](../configuring-icebox-services) provides more information on entry points and describes how to configure your service into an IceBox server.

# IceBox Service Failures

A service implementation can indicate a failure by throwing any exception.

When a service implementation throws an exception from its entry point, or from its `start` or `stop` methods, IceBox logs a message and exits.

##### See Also

- [Configuring IceBox Services](../configuring-icebox-services)
- [Starting the IceBox Server](../starting-the-icebox-server)
