---
id: well-known-registry-objects
title: Well-Known Registry Objects
---

# Default Identities of Registry Objects

The IceGrid registry hosts several [well-known objects](../well-known-objects). The following table shows the default
identities of these objects and their corresponding Slice interfaces:

| **Default Identity**                        | **Interface**                 |
| ------------------------------------------- | ----------------------------- |
| `IceGrid/AdminSessionManager`               | `Glacier2::SessionManager`    |
| `IceGrid/AdminSessionManager-replica`       | `Glacier2::SessionManager`    |
| `IceGrid/AdminSSLSessionManager`            | `Glacier2::SSLSessionManager` |
| `IceGrid/AdminSSLSessionManager-replica`    | `Glacier2::SSLSessionManager` |
| `IceGrid/Locator`                           | `Ice::Locator`                |
| `IceGrid/Query`                             | `IceGrid::Query`              |
| `IceGrid/Registry`                          | `IceGrid::Registry`           |
| `IceGrid/Registry-replica`                  | `IceGrid::Registry`           |
| `IceGrid/RegistryUserAccountMapper`         | `IceGrid::UserAccountMapper`  |
| `IceGrid/RegistryUserAccountMapper-replica` | `IceGrid::UserAccountMapper`  |
| `IceGrid/SessionManager`                    | `Glacier2::SessionManager`    |
| `IceGrid/SSLSessionManager`                 | `Glacier2::SSLSessionManager` |
| `Ice/LocatorFinder`                         | `Ice::LocatorFinder`          |

You can assign unique identities to these objects by configuring the [IceGrid.InstanceName](../icegrid-properties)
property, as shown in the following example:

```
IceGrid.InstanceName=MP3Grid
```

This property changes the identities of the well-known objects to use `MP3Grid` instead of `IceGrid` as the identity
category. For example, the identity of the locator becomes `MP3Grid/Locator`.

{% callout type="info" %}

Changes to `IceGrid.InstanceName` do not affect the identity of the `Ice/LocatorFinder` object. See the next section for
more information.

{% /callout %}

The client's configuration must also be changed to reflect the new identity:

```
Ice.Default.Locator=MP3Grid/Locator:tcp -h registryhost -p 4061
```

Furthermore, any uses of these identities in application code must be updated as well.

# Using the `LocatorFinder` Interface

Ice requires all locator implementations to support the `Ice::LocatorFinder` interface:

```slice
module Ice
{
    interface LocatorFinder
    {
        Locator* getLocator();
    }
}
```

An object supporting this interface must be available with the identity `Ice/LocatorFinder`. By knowing the host and
port of a locator's client endpoints, a client can discover the locator's proxy at run time with a call to `getLocator`:

```cpp
Ice::LocatorFinderPrx finder{
    communicator,
    "Ice/LocatorFinder:tcp -p 4061 -h gridhost");

auto locator = finder.getLocator();
communicator->setDefaultLocator(locator);
```

##### See Also

- [Well-Known Objects](../well-known-objects)
