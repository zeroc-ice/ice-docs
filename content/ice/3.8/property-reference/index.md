---
title: Property Reference
---

This section provides a reference for all properties used by the Ice runtime and its services.

The description of each property states its default value; where it does not, the default is the empty string, which a
property with a numeric value interprets as zero.

The Ice runtime reads its own properties with `getIceProperty`, `getIcePropertyAsInt` and `getIcePropertyAsList`, which
return that default when the property is not set. The plain `getProperty`, `getPropertyAsInt` and `getPropertyAsList`
return the empty string, zero and an empty list instead, whatever default this reference states; see
[the Properties class](../the-properties-class). Where an entry gives a default derived from another property, that
default is the work of the subsystem reading the property, not of these methods.

Note that Ice reads properties that control the runtime and its services only once on start-up, when you create a
communicator. This means that you must set Ice-related properties to their correct values before you create a
communicator. If you change the value of an Ice-related property after that point, it is likely that the new setting
will simply be ignored.
