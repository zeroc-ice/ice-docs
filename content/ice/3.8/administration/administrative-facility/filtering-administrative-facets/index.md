---
title: Filtering Administrative Facets
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

A communicator enables all of its built-in [administrative facets](../admin-object) by
default{% iflang langs="cpp,csharp,java,python,swift" %}, and an application may install its own
[custom facets](../custom-administrative-facets){% /iflang %}. You can control which facets a communicator enables using
the [Ice.Admin.Facets](../../../property-reference/ice-admin-properties) property. For example, the following property
definition enables the `Properties` facet and leaves the `Process` facet (and any application-defined facets) disabled:

```config
Ice.Admin.Facets=Properties
```

The communicator reads this property during its initialization. The value of this property is a list of facet names, in
the format accepted by [getPropertyAsList](../../../runtime/properties-and-configuration/properties-class).

{% callout type="note" %}

The communicator creates only the built-in administrative facets that are enabled. Disabled built-in facets are not
created at all.

{% /callout %}

## See Also

- [The Process Facet](../process-facet)
- [The Properties Facet](../properties-facet)
- [The Metrics Facet](../metrics-facet)
- [Custom Administrative Facets](../custom-administrative-facets)
- [Ice.Admin.*](../../../property-reference/ice-admin-properties)
