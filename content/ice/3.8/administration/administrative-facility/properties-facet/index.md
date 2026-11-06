---
title: The Properties Facet
sidebarLabel: Properties Facet
---

The `Properties` facet lets an administrative client read and update the
[configuration properties](../../../runtime/properties-and-configuration) of a running program's communicator. It
implements the [`Ice::PropertiesAdmin`](api:Ice/PropertiesAdminPrx) interface.

## Reading and Updating Properties

`PropertiesAdmin` provides three operations:

- `getProperty` returns the value of a property, or an empty string when the property is not set.
- `getPropertiesForPrefix` returns the properties whose names start with the given prefix; an empty prefix returns all
  the properties.
- `setProperties` merges the given properties into the communicator's properties: it adds or changes each property with
  a value, and removes each property with an empty value. The other properties keep their values.

`setProperties` applies the usual
[property validation](../../../runtime/properties-and-configuration/properties-overview#property-validation) when
adding, changing, or removing an entry. A rejected entry makes the call fail, and the entries applied before it stay in
place. Set [Ice.Trace.Admin.Properties](../../../property-reference/ice-trace-properties#ice.trace.admin.properties) to
trace the changes that `setProperties` makes.

{% callout type="note" %}

Changing a property generally does not reconfigure an initialized Ice component. When the Metrics facet is also enabled,
updates to `IceMX.Metrics.*` through this facet reconfigure the metrics views. Application properties take effect when
the application reads them again or handles a property update callback.

{% /callout %}

{% language-section name="mapping" /%}

{% iflang langs="cpp,csharp,java,python,swift" %}

The callback receives the added and changed properties with their new values, and the removed properties with empty
values. A successful `setProperties` call invokes the registered callbacks even when it changed nothing; the dictionary
is then empty. Direct calls to `Properties.setProperty` do not invoke these callbacks.

{% /iflang %}

## See Also

- [Properties and Configuration](../../../runtime/properties-and-configuration)
- [IceGrid](../../../services/icegrid)
- [Using the admin Object](../using-the-admin-object)
