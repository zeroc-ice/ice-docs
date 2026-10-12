---
title: Creating the admin Object
languages:
  - cpp
  - csharp
  - java
  - matlab
  - php
  - python
  - ruby
  - swift
---

The administrative facility is disabled by default. To enable it, you must set the property
[Ice.Admin.Enabled](../../../property-reference/ice-admin-properties) to 1, or leave
[Ice.Admin.Enabled](../../../property-reference/ice-admin-properties) unset and specify endpoints for the `Ice.Admin`
administrative object adapter using the property
[Ice.Admin.Endpoints](../../../property-reference/ice-admin-properties). When
[Ice.Admin.Enabled](../../../property-reference/ice-admin-properties) is set to 0, the administrative facility is
disabled, and `Ice.Admin.Endpoints` is ignored.

Ice creates the admin object during communicator initialization, and hosts all its
[enabled facets](../filtering-administrative-facets) in the built-in `Ice.Admin` object adapter, when:

- The administrative facility is enabled,
- The [Ice.Admin.Endpoints](../../../property-reference/ice-admin-properties) property specifies endpoints for the
  Ice.Admin object adapter, and
- The [Ice.Admin.DelayCreation](../../../property-reference/ice-admin-properties) property is not set, or is set to 0.

Ice gives this object the identity `instance-name`/admin, where _instance-name_ is the value of the
[Ice.Admin.InstanceName](../../../property-reference/ice-admin-properties) property. If `Ice.Admin.InstanceName` is not
set or empty, Ice generates a UUID for _instance-name_.

{% iflang langs="cpp,csharp,java,python,swift" %}

An application that needs to add or replace administrative facets before the admin object exposes them, such as the
[Process](../process-facet) facet, sets `Ice.Admin.DelayCreation` to 1, with `Ice.Admin.Endpoints` set as above: the
communicator then creates the admin object when the application calls `getAdmin` on the
[Communicator](api:Ice/Communicator).

{% /iflang %}

The administrative facility introduces additional
[security considerations](../security-considerations-for-administrative-facets), therefore the endpoints for the object
adapter where the admin object's facets are hosted must be chosen with caution.

## See Also

- [Ice.Admin.*](../../../property-reference/ice-admin-properties)
- [IceGrid and the Administrative Facility](../../../services/icegrid/icegrid-and-the-administrative-facility)
- [Security Considerations for Administrative Facets](../security-considerations-for-administrative-facets)
- [Using the admin Object](../using-the-admin-object)
