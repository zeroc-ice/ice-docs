---
title: Property Set Descriptor
---

A Property Set defines a set of Ice properties. IceGrid GUI supports two kinds of Property Sets:

- **Named Property Set** A property set defined within an [application](../application-descriptor) or within a
  [node](../node-descriptor). Server and service definitions refer to such property sets to "include" the corresponding
  properties.
- **Service-Instance Property Set** A property set defined as a child of an
  [IceBox server instance](../server-descriptor). Such a property set provides properties to a service instance within a
  concrete IceBox server.

# Properties

The Property Set Properties panel offers the following fields:

- **ID**(Named Property Set only) The ID of a named property set.
- **Service Name**(Service Instance property set) The service name.
- **Property Sets** List of Property Set IDs. The corresponding property sets are "included" in this property set.
- **Properties** Ice properties private to this Property Set
