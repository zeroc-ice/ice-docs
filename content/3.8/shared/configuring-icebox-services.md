---
id: configuring-icebox-services
title: Configuring IceBox Services
---

# Installing an IceBox Service

A service is configured into an IceBox server using a single [IceBox.Service](../icebox-properties) property. This
property serves several purposes: it defines the name of the service, it provides the server with the service entry
point, and it defines properties and arguments for the service.

The format of the property is shown below:

```
IceBox.Service.name=entry_point [args]
```

The `name` component of the property key is the service name. This name is passed to the service's `start` operation,
and must be unique among all services configured in the same IceBox server. It is possible, though rarely necessary, to
load two or more instances of the same service under different names.

The first argument in the property value is the entry point specification. Any arguments following the entry point
specification are examined. If an argument has the form `--name=value`, then it is interpreted as a property definition
that appears in the property set of the communicator passed to the service `start` operation. These arguments are
removed, and any remaining arguments are passed to the `start` operation in the `args` parameter.

# IceBox Service Configuration

{% language-section name="lang-1" /%}

You can use a configuration file to configure your IceBox service by specifying `--Ice.Config`. For example:

```
IceBox.Service.Greeter=<entry point> --Ice.Config=/etc/greeter.cfg
```

# Load Order for IceBox Services

By default, the server loads the configured services in an undefined order, meaning services in the same IceBox server
should not depend on one another. If services must be loaded in a particular order, the
[IceBox.LoadOrder](../icebox-properties) property can be used:

```
IceBox.LoadOrder=Service1,Service2
```

In this example, `Service1` is loaded first, followed by `Service2`. Any remaining services are loaded after `Service2`,
in an undefined order. Each service mentioned in `IceBox.LoadOrder` must have a matching `IceBox.Service` property.

During shutdown, services are stopped in the reverse of the order in which they were loaded.

# Using a Shared Communicator

IceBox creates a separate communicator instance for each service by default in order to minimize the chances of
accidental conflicts among services. You can optionally specify that certain services use a shared communicator instead
by setting [IceBox.UseSharedCommunicator._name_](../icebox-properties) properties in the server's configuration:

```
IceBox.Service.Hello=...
IceBox.Service.Printer=...
IceBox.UseSharedCommunicator.Hello=1
IceBox.UseSharedCommunicator.Printer=1
```

{% callout type="tip" %}

A common use case for sharing a communicator between two or more services is enabling the use of
[collocation optimizations](../collocated-invocation-and-dispatch) for invocations among those services. This
optimization is not possible with the default behavior that creates a new communicator for each service.

{% /callout %}

IceBox prepares the property set of this shared communicator as follows:

- If services [inherit the server's properties](../configuring-icebox-services), the property set initially contains the
  IceBox server's properties (excluding `Ice.Admin.Endpoints`), otherwise the property set starts out empty.
- For each service that uses the shared communicator:

  - Merge its properties into the shared property set, overwriting any existing properties with the same names
  - Remove any properties from the shared property set that the service explicitly clears. For example, the definition
    `Ice.Trace.Network=` clears any existing setting of `Ice.Trace.Network` in the shared property set.
  - Translate service-specific command-line settings into properties (e.g., `--Hello.Debug=1`)

Service properties are merged in the same order as the [services are loaded](../configuring-icebox-services). As a
result, the final value of a property that is defined by multiple services depends on the order in which those services
are loaded. Let's expand our example to demonstrate this behavior:

```
# File: server.cfg
IceBox.Service.Hello=... --Ice.Config=hello.cfg --Hello.Debug=1
IceBox.Service.Printer=... --Ice.Config=printer.cfg
IceBox.UseSharedCommunicator.Hello=1
IceBox.UseSharedCommunicator.Printer=1
IceBox.InheritProperties=1
IceBox.LoadOrder=Hello,Printer
Ice.Trace.Network=1

# File: hello.cfg
Ice.Trace.Network=2

# File: printer.cfg
Ice.Trace.Network=3
```

The two services `Hello` and `Printer` use the shared communicator, and all services inherit the server's properties. As
IceBox prepares the shared property set, the initial value of `Ice.Trace.Network` is `1` as defined in the (inherited)
server's configuration. The `IceBox.LoadOrder` property specifies that the `Hello` service should be loaded first,
therefore the `Ice.Trace.Network` property momentarily has the value `2` but ultimately has the value `3` after the
properties for the `Printer` service are merged.

If we change the value of `IceBox.LoadOrder` so that IceBox loads `Printer` first, the value for `Ice.Trace.Network` in
the shared communicator will be `2` instead because the setting in `hello.cfg` overrides all previous values.

# Inheriting Properties from the IceBox Server

By default, a service does not inherit the IceBox server's configuration properties. For example, consider the following
server configuration:

```
IceBox.Service.Weather=... --Ice.Config=svc.cfg
Ice.Trace.Network=1
```

The `Weather` service only receives the properties that are defined in its [IceBox.Service](../icebox-properties)
property. In the example above, the service's communicator is initialized with the properties from the file `svc.cfg`.

If services need to inherit the IceBox server's configuration properties, define the
[IceBox.InheritProperties](../icebox-properties) property in the IceBox server's configuration:

```
IceBox.Service.Weather=... --Ice.Config=svc.cfg
Ice.Trace.Network=1
IceBox.InheritProperties=1
```

All services inherit the server's properties when `IceBox.InheritProperties` is set to a non-zero value. The service
inherits all the properties of the IceBox servers, with the exception of properties whose names start with `Ice.Admin`.

{% callout type="info" %}

The properties of the [shared communicator](../configuring-icebox-services) are also affected by this setting.

{% /callout %}

# Logging Considerations for IceBox Services

The IceBox server only configures a logger for a service if that service has not already specified its own logger via
the [Ice.LogFile](../ice-properties) or [Ice.UseSyslog](../ice-properties) properties.

##### See Also

- [IceBox.*](../icebox-properties)
- [Developing IceBox Services](../developing-icebox-services)
- [IceStorm](../icestorm)
- [Collocated Invocation and Dispatch](../collocated-invocation-and-dispatch)
- [Miscellaneous Ice.* Properties](../ice-properties)
