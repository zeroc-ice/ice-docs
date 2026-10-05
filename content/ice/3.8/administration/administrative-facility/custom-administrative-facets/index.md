---
title: Custom Administrative Facets
---

{% iflang langs="cpp,csharp,java,python,swift" %}

An application can add, remove, and find administrative facets by calling the following methods on the
[Communicator](api:Ice/Communicator):

- `addAdminFacet` installs a new facet with the given name, or throws `AlreadyRegisteredException` if a facet already
  exists with the same name.
- `removeAdminFacet` removes and returns the facet with the given name, or throws `NotRegisteredException` if no
  matching facet is found.
- `findAdminFacet` returns the facet with the given name, or null if no matching facet is found.
- `findAllAdminFacets` returns all the facets, keyed by facet name.

You can call these methods before or after the creation of the [admin object](../creating-the-admin-object). The
communicator keeps the facets added before this creation and hosts the enabled ones in the admin object when it creates
it.

The mechanism for [filtering administrative facets](../filtering-administrative-facets) also applies to
application-defined facets. If you call `addAdminFacet` while a filter is in effect, and the name of your custom facet
does not match the filter, the communicator will not expose your facet but instead keeps a reference to it:
`findAdminFacet`, `findAllAdminFacets`, and `removeAdminFacet` still find it.

{% /iflang %}

{% iflang langs="python" %}

`findAdminFacet` and `findAllAdminFacets` return only the facets implemented in Python and the built-in `Properties`
facet. For the built-in `Process`, `Logger`, and `Metrics` facets, `findAdminFacet` returns `None`, and
`findAllAdminFacets` omits them. `removeAdminFacet` returns `None` for every built-in facet, including `Properties`.

{% /iflang %}

{% iflang langs="swift" %}

For the built-in `Logger` and `Metrics` facets, `findAdminFacet`, `findAllAdminFacets`, and `removeAdminFacet` return a
placeholder dispatcher that implements neither `LoggerAdmin` nor `MetricsAdmin`.

{% /iflang %}

{% iflang langs="js,matlab,php,ruby" %}

{% callout type="note" %}

The `Communicator` of Ice for JavaScript, MATLAB, PHP, and Ruby provides none of these methods, so an application
written in these languages cannot install custom administrative facets.

{% /callout %}

{% /iflang %}

{% iflang langs="cpp,csharp,java,python,swift" %}

We provide an example of using these communicator methods in our discussion of the [Process](../process-facet) facet.

{% /iflang %}

## See Also

- [Filtering Administrative Facets](../filtering-administrative-facets)
- [The Process Facet](../process-facet)
