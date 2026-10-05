---
title: Creating the admin Object
---

{% iflang langs="js" %}

{% callout type="note" %}

Ice for JavaScript does not provide the administrative facility. A JavaScript application can still
[administer a remote program](../using-the-admin-object) through a proxy for its admin object.

{% /callout %}

{% /iflang %}

The administrative facility is disabled by default. To enable it, you must set the property
[Ice.Admin.Enabled](../../../property-reference/ice-admin-properties) to a numeric value greater than 0, or leave
[Ice.Admin.Enabled](../../../property-reference/ice-admin-properties) unset and specify endpoints for the `Ice.Admin`
administrative object adapter using the property
[Ice.Admin.Endpoints](../../../property-reference/ice-admin-properties). When
[Ice.Admin.Enabled](../../../property-reference/ice-admin-properties) is set to 0 or a negative value, the
administrative facility is disabled, and `Ice.Admin.Endpoints` is ignored.

When the administrative facility is enabled, the communicator creates the servants of its
[enabled built-in facets](../filtering-administrative-facets) during initialization. The admin object, which hosts these
facets and any [custom facets](../custom-administrative-facets), is created separately.

Ice creates the admin object at the end of communicator initialization, and hosts all its
[enabled facets](../filtering-administrative-facets) in the built-in `Ice.Admin` object adapter, when:

- The administrative facility is enabled,
- The [Ice.Admin.Endpoints](../../../property-reference/ice-admin-properties) property specifies endpoints for the
  Ice.Admin object adapter, and
- The [Ice.Admin.DelayCreation](../../../property-reference/ice-admin-properties) property is not set, or is set to 0 or
  a negative value.

The communicator creates this admin object after loading its plug-ins and, when
[Ice.InitPlugins](../../../property-reference/ice-properties#ice.initplugins) is greater than 0 (the default), after
initializing them. Ice gives this object the identity `instance-name`/admin, where _instance-name_ is the value of the
[Ice.Admin.InstanceName](../../../property-reference/ice-admin-properties) property. If `Ice.Admin.InstanceName` is not
set or empty, Ice generates a UUID for _instance-name_.

{% iflang langs="cpp,csharp,java,python,swift" %}

If Ice does not create the admin object during communicator initialization as described above, you need to create the
admin object after communicator initialization by calling `getAdmin` or `createAdmin` on the
[Communicator](api:Ice/Communicator):

`getAdmin` returns a proxy for the admin object when this object already exists. Otherwise, when the administrative
facility is enabled and `Ice.Admin.Endpoints` is set, `getAdmin` creates the admin object, hosts its enabled facets in
the `Ice.Admin` object adapter, activates this object adapter, and returns a proxy for the new admin object. The
identity of this admin object is `instance-name`/admin, as described above. In all other cases, `getAdmin` returns a
null proxy. An application typically calls `getAdmin` to create the admin object when both `Ice.Admin.Endpoints` and
`Ice.Admin.DelayCreation` are set.

`createAdmin` creates the admin object with the identity you supply, and hosts its enabled facets in the object adapter
you supply; you activate this object adapter as you would any other. The identity must have a non-empty name. If you
pass a null object adapter, `createAdmin` uses the `Ice.Admin` object adapter and activates it, which requires
`Ice.Admin.Endpoints` to be set. `createAdmin` throws `InitializationException` when the administrative facility is
disabled, when the admin object already exists, or when the object adapter is null and `Ice.Admin.Endpoints` is not set.

{% /iflang %}

{% iflang langs="matlab,php,ruby" %}

{% callout type="note" %}

The `Communicator` of Ice for MATLAB, PHP, and Ruby provides neither `getAdmin` nor `createAdmin`. An application
written in these languages gets an admin object only when Ice creates it during communicator initialization, as
described above; setting `Ice.Admin.DelayCreation` to a value greater than 0 prevents this creation.

{% /callout %}

{% /iflang %}

The administrative facility introduces additional
[security considerations](../security-considerations-for-administrative-facets), therefore the endpoints for the object
adapter where the admin object's facets are hosted must be chosen with caution.

## See Also

- [Ice.Admin.*](../../../property-reference/ice-admin-properties)
- [IceGrid and the Administrative Facility](../../../services/icegrid/icegrid-and-the-administrative-facility)
- [Security Considerations for Administrative Facets](../security-considerations-for-administrative-facets)
- [Using the admin Object](../using-the-admin-object)
