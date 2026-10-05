---
title: Creating the admin Object
---

The administrative facility is disabled by default. To enable it, you must set the property
[Ice.Admin.Enabled](../../../property-reference/ice-admin-properties) to a numeric value greater than 0, or leave
[Ice.Admin.Enabled](../../../property-reference/ice-admin-properties) unset and specify endpoints for the `Ice.Admin`
administrative object adapter using the property
[Ice.Admin.Endpoints](../../../property-reference/ice-admin-properties). When
[Ice.Admin.Enabled](../../../property-reference/ice-admin-properties) is set to 0 or a negative value, the
administrative facility is disabled, and `Ice.Admin.Endpoints` is ignored.

Ice creates automatically the admin object during communicator initialization, and hosts all its
[enabled facets](../filtering-administrative-facets) in the built-in `Ice.Admin` object adapter, when:

- The administrative facility is enabled,
- The [Ice.Admin.Endpoints](../../../property-reference/ice-admin-properties) property specifies endpoints for the
  Ice.Admin object adapter, and
- The [Ice.Admin.DelayCreation](../../../property-reference/ice-admin-properties) property is not set, or is set to 0 or
  a negative value.

This admin object and its facets are created at the end of communicator initialization, after the initialization of all
plugins. Ice gives this object the identity `instance-name`/admin, where _instance-name_ is the value of the
[Ice.Admin.InstanceName](../../../property-reference/ice-admin-properties) property. If `Ice.Admin.InstanceName` is not
set or empty, Ice generates a UUID for _instance-name_.

If Ice does not create the admin object during communicator initialization as described above, you need to create the
admin object after communicator initialization by calling `getAdmin` or `createAdmin` on the
[Communicator](api:Ice/Communicator):

`getAdmin` is typically used to create the admin object when both `Ice.Admin.Endpoints` and `Ice.Admin.DelayCreation`
are set. The resulting admin object's [enabled facets](../filtering-administrative-facets) are hosted in the `Ice.Admin`
object adapter. The identity of this admin object is `instance-name`/admin, where _instance-name_ corresponds to the
value of `Ice.Admin.InstanceName` or a UUID, as described above.

`createAdmin` is used to create the admin object and host all its [enabled facets](../filtering-administrative-facets)
in the object adapter of your choice.

The administrative facility introduces additional
[security considerations](../security-considerations-for-administrative-facets), therefore the endpoints for the object
adapter where the admin object's facets are hosted must be chosen with caution.

## See Also

- [Ice.Admin.*](../../../property-reference/ice-admin-properties)
- [IceGrid and the Administrative Facility](../../../services/icegrid/icegrid-and-the-administrative-facility)
- [Security Considerations for Administrative Facets](../security-considerations-for-administrative-facets)
- [Using the admin Object](../using-the-admin-object)
