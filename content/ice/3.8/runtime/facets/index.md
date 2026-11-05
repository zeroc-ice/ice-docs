---
title: Facets
---

A _facet_ lets an Ice object implement several Slice interfaces under a single identity, so you can add an interface to
an existing Ice object without changing the interface it already implements.

For example, a printer can implement a `Printer` interface for printing documents and a `PrinterAdmin` interface for its
administrative operations, as two facets of the Ice object with the identity `printer1`:

![The Ice object printer1 has two facets: the default facet, which implements Printer, and the facet admin, which implements PrinterAdmin.](/images/ice/3.8/facets/facets.svg)

A proxy selects a facet by its facet name:

```text
printer1:tcp -h localhost -p 4061
printer1 -f admin:tcp -h localhost -p 4061
```

The first proxy has an empty facet name, so it selects the _default facet_, which implements `Printer`. The second
selects the facet named `admin`, which implements `PrinterAdmin`. [`ice_facet`](api:Ice/ObjectPrx.ice_facet) returns a
proxy for the facet with the given name: a copy of this proxy that differs only in its facet name.

The [Administrative Facility](../../administration/administrative-facility) works the same way: the admin object of an
Ice application provides each administrative capability, such as `Process` and `Properties`, as a facet.

## Facet Names and Servants

A facet name is a string that is unique within an Ice object; the default facet has the empty name. All the facets of an
Ice object share its identity, and each facet implements its own Slice interface. An Ice object usually has a default
facet, but it can also consist of named facets only.

Each facet has its own servant: [`addFacet`](api:Ice/ObjectAdapter.addFacet) registers the servant of a named facet with
an object adapter, and [`add`](api:Ice/ObjectAdapter.add) registers the servant of the default facet. The object adapter
dispatches each request to the servant registered for the identity and facet name carried by the request.

## See Also

- [Syntax for Stringified Proxies](../invocation/syntax-for-stringified-proxies)
- [Versioning with Facets](../../versioning/versioning-with-facets)
- [Administrative Facility](../../administration/administrative-facility)
