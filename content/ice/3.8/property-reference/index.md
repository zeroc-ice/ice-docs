---
title: Property Reference
---

This section provides a reference for all properties used by the Ice runtime and its services.

Unless the description of a property says otherwise, its default value is the empty string. For a numeric property, that
means 0. The `getIceProperty` methods return a property's built-in default when the property is not set, while the plain
`getProperty` methods return the empty string, 0, or an empty list; see [the Properties class](../the-properties-class).

Note that Ice reads properties that control the runtime and its services only once on start-up, when you create a
communicator. This means that you must set Ice-related properties to their correct values before you create a
communicator. If you change the value of an Ice-related property after that point, it is likely that the new setting
will simply be ignored.
