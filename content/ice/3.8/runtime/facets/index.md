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
selects the facet named `admin`, which implements `PrinterAdmin`.

The [Administrative Facility](../../administration/administrative-facility) works the same way: the admin object of an
Ice application provides each administrative capability, such as `Process` and `Properties`, as a facet.

## Facet Names and Servants

Each facet of an Ice object has a name that is unique within this object, and implements a Slice interface. All the
facets of an Ice object share its identity. An Ice object usually has a default facet, but it can also consist of named
facets only.

On the server, [`addFacet`](api:Ice/ObjectAdapter.addFacet) adds a servant for one facet of an Ice object to an object
adapter, and [`add`](api:Ice/ObjectAdapter.add) adds a servant for its default facet. The object adapter dispatches each
request to the servant registered for the identity and facet of the request, so each facet can have its own servant.

On the client, [`ice_facet`](api:Ice/ObjectPrx.ice_facet) returns a proxy for another facet of the same Ice object, with
the same identity and endpoints, and `checkedCast` and `uncheckedCast` accept a facet name.

## Facets, Separate Ice Objects, and Inheritance

You could also implement `PrinterAdmin` as a separate Ice object, with its own identity. Facets instead keep the two
interfaces under the identity of the printer: the administrative interface belongs to `printer1`, and a client that
holds a proxy for one facet reaches the other with `ice_facet`, without another identity or endpoints.

Facets also differ from [interface inheritance](../../slice/interfaces/interface-inheritance), which combines the
operations of `Printer` and the administrative operations into one derived interface that a single servant implements.
With facets, `Printer` and `PrinterAdmin` remain independent interfaces, each implemented by its own servant, and a
client selects one of them through the facet name of its proxy.

## See Also

- [Syntax for Stringified Proxies](../invocation/syntax-for-stringified-proxies)
- [Versioning with Facets](../../versioning/versioning-with-facets)
- [Administrative Facility](../../administration/administrative-facility)
