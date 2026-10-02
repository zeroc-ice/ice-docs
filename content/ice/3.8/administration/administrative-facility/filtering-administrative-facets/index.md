---
title: Filtering Administrative Facets
---

A communicator enables all of its built-in [administrative facets](administration/administrative-facility/admin-object)
by default, and an application may install its own
[custom facets](administration/administrative-facility/custom-administrative-facets). You can control which facets a
communicator enables using the [Ice.Admin.Facets](property-reference/ice-admin-properties) property. For example, the
following property definition enables the `Properties` facet and leaves the `Process` facet (and any application-defined
facets) disabled:

```config
Ice.Admin.Facets=Properties
```

To specify more than one facet, separate them with a comma or white space. A facet whose name contains white space must
be enclosed in single or double quotes.

{% callout type="info" %}

The communicator creates only the built-in administrative facets that are enabled. Disabled built-in facets are not
created at all.

{% /callout %}

## See Also

- [The Process Facet](administration/administrative-facility/process-facet)
- [The Properties Facet](administration/administrative-facility/properties-facet)
- [The Metrics Facet](administration/administrative-facility/metrics-facet)
- [Custom Administrative Facets](administration/administrative-facility/custom-administrative-facets)
- [Ice.Admin.*](property-reference/ice-admin-properties)
