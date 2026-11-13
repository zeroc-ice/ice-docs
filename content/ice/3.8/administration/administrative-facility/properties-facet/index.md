---
title: The Properties Facet
sidebarLabel: Properties Facet
---

The `Properties` facet lets an administrative client read and update the
[configuration properties](../../../runtime/properties-and-configuration) of a running program's communicator. It
implements the [`Ice::PropertiesAdmin`](api:Ice/PropertiesAdminPrx) interface.

## Reading and Updating Properties

An administrative client reads properties with `getProperty` and `getPropertiesForPrefix`, and updates them with
`setProperties`. `setProperties` merges the properties it receives into the communicator's properties: it adds or
changes each property that has a value, and removes each property whose value is empty. The other properties keep their
values.

`setProperties` applies
[property validation](../../../runtime/properties-and-configuration/properties-overview#property-validation) to each
property it adds, changes or removes. The update is not all or nothing: when validation rejects a property, the
properties that `setProperties` applied before it keep their new values. Set
[Ice.Trace.Admin.Properties](../../../property-reference/ice-trace-properties#ice.trace.admin.properties) to trace the
changes that `setProperties` makes.

{% callout type="note" %}

Changing a property generally does not reconfigure an initialized Ice component. When the Metrics facet is also enabled,
updates to `IceMX.Metrics.*` through this facet reconfigure the metrics views. Application properties take effect when
the application reads them again or handles a property update callback.

{% /callout %}

{% iflang langs="cpp,csharp,java,python,swift" %}

## Receiving Property Updates

An application can register callbacks that the `Properties` facet calls after each successful `setProperties` call. A
callback receives the added and changed properties with their new values, and the removed properties with empty values;
the dictionary is empty when the call changed nothing. Direct calls to `Properties.setProperty` do not invoke these
callbacks.

{% /iflang %}

{% language-section name="mapping" /%}

## See Also

- [Properties and Configuration](../../../runtime/properties-and-configuration)
- [IceGrid](../../../services/icegrid)
- [Using the admin Object](../using-the-admin-object)
