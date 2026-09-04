---
id: filtering-administrative-facets
title: Filtering Administrative Facets
---

A communicator enables all of its built-in [administrative facets](../the-admin-object) by default, and an application
may install its own [custom facets](../custom-administrative-facets). You can control which facets a communicator
enables using the [Ice.Admin.Facets](../ice-admin-properties) property. For example, the following property definition
enables the `Properties` facet and leaves the `Process` facet (and any application-defined facets) disabled:

```
Ice.Admin.Facets=Properties
```

To specify more than one facet, separate them with a comma or white space. A facet whose name contains white space must
be enclosed in single or double quotes.

{% callout type="info" %}

The communicator creates only the built-in administrative facets that are enabled. Disabled built-in facets are not
created at all.

{% /callout %}

##### See Also

- [The Process Facet](../the-process-facet)
- [The Properties Facet](../the-properties-facet)
- [The Metrics Facet](../the-metrics-facet)
- [Custom Administrative Facets](../custom-administrative-facets)
- [Ice.Admin.*](../ice-admin-properties)
