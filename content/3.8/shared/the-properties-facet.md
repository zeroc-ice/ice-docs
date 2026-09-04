---
id: the-properties-facet
title: The Properties Facet
---

# The `PropertiesAdmin` Interface

An administrator may find it useful to be able to view or modify the configuration properties of a remote Ice
application. For example, the [IceGrid](../icegrid) administrative tools allow you to query and update the properties of
active servers. The `Properties` facet supplies this functionality.

The `Ice::PropertiesAdmin` interface provides access to the communicator's
[configuration properties](../properties-and-configuration):

```slice
module Ice
{
    interface PropertiesAdmin 
    {
        string getProperty(string key);
        PropertyDict getPropertiesForPrefix(string prefix);
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
[Ice.Trace.Admin.Properties](../ice-trace-properties) property is enabled, Ice logs a message if a call to
`setProperties` results in any changes to the property set.

{% callout type="info" %}

Modifying a program's configuration properties at runtime may not have an effect on the program. For example, many of
Ice's standard configuration properties are read once during communicator initialization, and never again.

{% /callout %}

{% language-section name="lang-1" /%}

##### See Also

- [Properties and Configuration](../properties-and-configuration)
- [Versioning](../versioning-your-application)
- [IceGrid](../icegrid)
