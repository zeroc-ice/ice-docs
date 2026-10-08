---
title: IceBox.*
---

## IceBox.InheritProperties

{% property-synopsis %}

`IceBox.InheritProperties=num`

{% /property-synopsis %}

{% property-description %}

If `num` is set to a value larger than zero, each service
[inherits the configuration properties](../../services/icebox/configuring-icebox-services) of the IceBox server's
communicator, except the properties whose names start with `IceBox.` or `Ice.Admin.`. Properties set by the service
arguments in [IceBox.Service.name](#icebox.service.name) override inherited properties. If not defined, the default
value is zero.

{% /property-description %}

## IceBox.LoadOrder

{% property-synopsis %}

`IceBox.LoadOrder=names`

{% /property-synopsis %}

{% property-description %}

Determines the [order](../../services/icebox/configuring-icebox-services) in which services are loaded. The service
manager loads the services in the order they appear in `names`, where each service name is separated by a comma or white
space. Each name must have a matching `IceBox.Service.name` property. Any services not mentioned in `names` are loaded
afterward, in an undefined order.

{% /property-description %}

## IceBox.PrintServicesReady

{% property-synopsis %}

`IceBox.PrintServicesReady=token`

{% /property-synopsis %}

{% property-description %}

If this property is set, the service manager prints "`token` ready" on standard output once initialization of all the
services is complete. This is useful for scripts that need to wait until all services are ready to be used.

{% /property-description %}

## IceBox.Service._name_

{% property-synopsis %}

`IceBox.Service.name=entry_point [args]`

{% /property-synopsis %}

{% property-description %}

Defines a [service](../../services/icebox/configuring-icebox-services) to be loaded during IceBox initialization. The
service manager examines the arguments that follow the entry point. An argument of the form `--prefix.key=value`, where
`prefix` is one of the [reserved prefixes](../../runtime/properties-and-configuration/properties-overview) such as
`Ice`, or the service `name`, sets a property in the communicator that the service manager passes to the service `start`
method; `--Ice.Config=file` loads a configuration file into that communicator. The service manager passes all remaining
arguments to the `start` method in the `args` parameter. Whitespace separates the arguments, and any arguments that
contain whitespace must be enclosed in quotes.

{% /property-description %}

{% language-section name="mapping" /%}

## IceBox.Trace.ServiceObserver

{% property-synopsis %}

`IceBox.Trace.ServiceObserver=num`

{% /property-synopsis %}

{% property-description %}

If `num` is set to a value larger than zero, the service manager traces the registration and removal of service
observers. If not defined, the default value is zero.

{% /property-description %}

## IceBox.UseSharedCommunicator._name_

{% property-synopsis %}

`IceBox.UseSharedCommunicator.name=num`

{% /property-synopsis %}

{% property-description %}

If `num` is set to a value larger than zero, the service manager supplies the service `name` with a communicator that
might be [shared by other services](../../services/icebox/configuring-icebox-services). If the
[IceBox.InheritProperties](#icebox.inheritproperties) property is also defined, the shared communicator inherits the
properties of the IceBox server. If not defined, the default value is zero.

{% /property-description %}
