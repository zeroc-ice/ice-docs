---
title: The Properties Facet
---

## The `PropertiesAdmin` Interface

An administrator may find it useful to be able to view or modify the configuration properties of a remote Ice
application. For example, the [IceGrid](../../../services/icegrid) administrative tools allow you to query and update
the properties of active servers. The `Properties` facet supplies this functionality.

The `Ice::PropertiesAdmin` interface provides access to the communicator's
[configuration properties](../../../runtime/properties-and-configuration):

```slice
module Ice
{
    interface PropertiesAdmin
    {
        string getProperty(string key);
        PropertyDict getPropertiesForPrefix(string prefix);
        void setProperties(PropertyDict newProperties);
    }
}
```

The `getProperty` operation retrieves the value of a single property, and the `getPropertiesForPrefix` operation returns
a dictionary of properties whose keys match the given prefix.

The `setProperties` operation merges the entries in `newProperties` with the communicator's existing properties. If an
entry in `newProperties` matches the name of an existing property, that property's value is replaced with the new value.
If the new value is an empty string, the property is removed. Any existing properties that are not modified or removed
by the entries in `newProperties` are retained with their original values. If the
[Ice.Trace.Admin.Properties](../../../property-reference/ice-trace-properties) property is enabled, Ice logs a message
if a call to `setProperties` results in any changes to the property set.

`setProperties` applies the usual
[property validation](../../../runtime/properties-and-configuration/properties-overview#property-validation) when
adding, changing, or removing an entry. A rejected entry makes the call fail, and the entries applied before it stay in
place.

{% callout type="info" %}

Changing a property generally does not reconfigure an initialized Ice component. When the Metrics facet is also enabled,
updates to `IceMX.Metrics.*` through this facet reconfigure the metrics views. Application properties take effect when
the application reads them again or handles a property update callback.

{% /callout %}

{% language-section name="lang-1" /%}

## See Also

- [Properties and Configuration](../../../runtime/properties-and-configuration)
- [Versioning](../../../versioning)
- [IceGrid](../../../services/icegrid)
