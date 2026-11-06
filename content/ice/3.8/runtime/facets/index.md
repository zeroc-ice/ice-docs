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

An Ice object has one or more facets. Each facet has a name that is unique within this Ice object, and the default facet
has the empty name. All the facets of an Ice object share its identity, and each facet implements its own Slice
interface. An Ice object usually has a default facet, but it can also consist of named facets only.

A servant incarnates a facet of an Ice object in an object adapter. [`addFacet`](api:Ice/ObjectAdapter.addFacet)
associates a servant with an identity and a facet name, and [`add`](api:Ice/ObjectAdapter.add) associates a servant with
an identity and the default facet. The object adapter dispatches each request to the servant associated with the
identity and facet name carried by the request.

A [default servant](../dispatch/default-servants) receives the requests for all the facets of the identities it handles:
it gets the facet name from the `Current` parameter of the dispatch.

## See Also

- [Syntax for Stringified Proxies](../invocation/syntax-for-stringified-proxies)
- [Versioning](../../versioning#adding-facets)
- [Administrative Facility](../../administration/administrative-facility)
