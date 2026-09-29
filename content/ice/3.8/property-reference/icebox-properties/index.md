---
title: IceBox.*
---

# IceBox.InheritProperties

#### Synopsis

`IceBox.InheritProperties=num`

#### Description

If `num` is set to a value larger than zero, each service
[inherits the configuration properties](../configuring-icebox-services) of the IceBox server's communicator. If not
defined, the default value is zero.

# IceBox.LoadOrder

#### Synopsis

`IceBox.LoadOrder=names`

#### Description

Determines the [order](../configuring-icebox-services) in which services are loaded. The service manager loads the
services in the order they appear in `names`, where each service name is separated by a comma or white space. Any
services not mentioned in `names` are loaded afterward, in an undefined order.

# IceBox.PrintServicesReady

#### Synopsis

`IceBox.PrintServicesReady=token`

#### Description

If this property is set to a value greater than zero, the service manager prints "`token` ready" on standard output once
initialization of all the services is complete. This is useful for scripts that need to wait until all services are
ready to be used.

# IceBox.Service._name_

#### Synopsis

`IceBox.Service.name=entry_point [args]`

#### Description

Defines a [service](../configuring-icebox-services) to be loaded during IceBox initialization. Any arguments that follow
the entry point are examined; those matching the `--name=value` pattern are interpreted as property definitions and
appear in the property set of the communicator that is passed to the service `start` method, and all remaining arguments
are passed to the `start` method in the `args` parameter. Whitespace separates the arguments, and any arguments that
contain whitespace must be enclosed in quotes.

{% language-section name="lang-1" /%}

# IceBox.Trace.ServiceObserver

#### Synopsis

`IceBox.Trace.ServiceObserver=num`

#### Description

If `num` is set to a value larger than zero, the service manager traces the registration and removal of service
observers. If not defined, the default value is zero.

# IceBox.UseSharedCommunicator._name_

#### Synopsis

`IceBox.UseSharedCommunicator.name=num`

#### Description

If `num` is set to a value larger than zero, the service manager supplies the service `name` with a communicator that
might be [shared by other services](../configuring-icebox-services). If the
[IceBox.InheritProperties](../icebox-properties#icebox.inheritproperties) property is also defined, the shared
communicator inherits the properties of the IceBox server. If not defined, the default value is zero.
