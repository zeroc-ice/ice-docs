---
id: lexical-rules
language: cpp
---

{% language-section name="lang-1" %}

A Slice identifier maps to an identical C++ identifier. For example, the Slice identifier `Clock` becomes the C++
identifier `Clock`.

A single Slice identifier often results in several C++ identifiers. For example, for a Slice interface named `Greeter`,
the generated C++ code uses the identifiers `Greeter` and `GreeterPrx` (among others).

You can change this mapping and specify your own C++ identifier with the `cpp:identifier` metadata directive. For
example, we can remap `Greeter` to `Receptionist` as follows:

```
["cpp:identifier:Receptionist"]
interface Greeter { ... }
```

The resulting C++ classes are `Receptionist` and `ReceptionistPrx`.

{% callout type="warning" %}

When you use a C++ keyword such as `template` as a Slice identifier, use `cpp:identifier` to remap this identifier in
the generated C++ code. Without this remapping, the generated C++ code won’t compile.

{% /callout %}

{% /language-section %}
