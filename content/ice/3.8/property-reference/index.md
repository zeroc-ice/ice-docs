---
title: Property Reference
---

This section provides a reference for all properties used by the Ice runtime and its services.

Unless stated otherwise in the description of an individual property, its default value is the empty string. If a
property takes a numeric value, the empty string is interpreted as zero.

Note that Ice reads properties that control the runtime and its services only once on start-up, when you create a
communicator. This means that you must set Ice-related properties to their correct values before you create a
communicator. If you change the value of an Ice-related property after that point, it is likely that the new setting
will simply be ignored.
