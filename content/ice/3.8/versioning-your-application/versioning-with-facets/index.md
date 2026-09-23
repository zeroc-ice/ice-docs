---
title: Versioning with Facets
---

In the most general sense, facets provide a mechanism for implementing multiple interfaces for a single object. The key
point is that, to add a new interface to an object, none of the existing definitions have to be touched, so no
compatibility issues can arise. More importantly, the decision as to which facet to use is made at runtime instead of at
compile time.

Used judiciously, facets can handle versioning requirements when the incremental updates approach described earlier is
no longer sufficient.
