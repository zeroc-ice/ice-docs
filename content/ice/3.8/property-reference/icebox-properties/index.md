---
title: IceBox.*
---

## IceBox.InheritProperties

### Synopsis {% id="icebox.inheritproperties-synopsis" %}

`IceBox.InheritProperties=num`

### Description {% id="icebox.inheritproperties-description" %}

If `num` is set to a value larger than zero, each service
[inherits the configuration properties](../configuring-icebox-services) of the IceBox server's communicator, except the
properties whose names start with `IceBox.` or `Ice.Admin.`. Properties set by the service arguments in
[IceBox.Service.name](../icebox-properties#icebox.service.name) override inherited properties. If not defined, the
default value is zero.

## IceBox.LoadOrder

### Synopsis {% id="icebox.loadorder-synopsis" %}

`IceBox.LoadOrder=names`

### Description {% id="icebox.loadorder-description" %}

Determines the [order](../configuring-icebox-services) in which services are loaded. The service manager loads the
services in the order they appear in `names`, where each service name is separated by a comma or white space. Each name
must have a matching `IceBox.Service.name` property. Any services not mentioned in `names` are loaded afterward, in an
undefined order.

## IceBox.PrintServicesReady

### Synopsis {% id="icebox.printservicesready-synopsis" %}

`IceBox.PrintServicesReady=token`

### Description {% id="icebox.printservicesready-description" %}

If this property is set, the service manager prints "`token` ready" on standard output once initialization of all the
services is complete. This is useful for scripts that need to wait until all services are ready to be used.

## IceBox.Service._name_

### Synopsis {% id="icebox.service.name-synopsis" %}

`IceBox.Service.name=entry_point [args]`

### Description {% id="icebox.service.name-description" %}

Defines a [service](../configuring-icebox-services) to be loaded during IceBox initialization. The service manager
examines the arguments that follow the entry point. An argument of the form `--prefix.key=value`, where `prefix` is one
of the [reserved prefixes](../properties-overview) such as `Ice`, or the service `name`, sets a property in the
communicator that the service manager passes to the service `start` method; `--Ice.Config=file` loads a configuration
file into that communicator. The service manager passes all remaining arguments to the `start` method in the `args`
parameter. Whitespace separates the arguments, and any arguments that contain whitespace must be enclosed in quotes.

{% language-section name="lang-1" /%}

## IceBox.Trace.ServiceObserver

### Synopsis {% id="icebox.trace.serviceobserver-synopsis" %}

`IceBox.Trace.ServiceObserver=num`

### Description {% id="icebox.trace.serviceobserver-description" %}

If `num` is set to a value larger than zero, the service manager traces the registration and removal of service
observers. If not defined, the default value is zero.

## IceBox.UseSharedCommunicator._name_

### Synopsis {% id="icebox.usesharedcommunicator.name-synopsis" %}

`IceBox.UseSharedCommunicator.name=num`

### Description {% id="icebox.usesharedcommunicator.name-description" %}

If `num` is set to a value larger than zero, the service manager supplies the service `name` with a communicator that
might be [shared by other services](../configuring-icebox-services). If the
[IceBox.InheritProperties](../icebox-properties#icebox.inheritproperties) property is also defined, the shared
communicator inherits the properties of the IceBox server. If not defined, the default value is zero.
