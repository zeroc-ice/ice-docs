---
title: Facets
---

Facets provide a general-purpose mechanism for non-intrusively extending the type system of an application, by loosely
coupling new type instances to existing ones.

## Ice Objects as Collections of Facets

Up to this point, we have presented an Ice object as a single conceptual entity, that is, as an object with a single
most-derived interface and a single identity, with the object being implemented by a single servant. However, an Ice
object is more correctly viewed as a collection of one or more sub-objects known as facets, as shown below:

![One Ice object exposes five facets: the unnamed default facet, Facet 1, Facet 2, This Facet, and That Facet.](/attachments/3.8/facets/facets.svg)

_An Ice object with five facets sharing a single object identity._

The diagram above shows a single Ice object with five facets. Each facet has a name, known as the _facet name_. Within a
single Ice object, all facets must have unique names. Facet names are arbitrary strings that are assigned by the server
that implements an Ice object. A facet with an empty facet name is legal and known as the _default facet_. Unless you
arrange otherwise, an Ice object has a single default facet; by default, operations that involve Ice objects and
servants operate on the default facet.

Note that all the facets of an Ice object share the same single identity, but have different facet names.

Even though Ice objects usually consist of just the default facet, it is entirely legal for an Ice object to consist of
facets that all have non-empty names (that is, it is legal for an Ice object not to have a default facet).

Each facet has a single most-derived interface. There is no need for the interface types of the facets of an Ice object
to be unique. It is legal for two facets of an Ice object to implement the same most-derived interface.

Each facet is implemented by a servant. Typically, each facet of an Ice object has a separate servant, although, if two
facets of an Ice object have the same type, they can also be implemented by a single servant (for example, using a
default servant).
