---
id: lexical-rules
language: java
---

{% language-section name="lang-1" %}

A Slice identifier maps to an identical Java identifier. For example, the Slice identifier `Clock` becomes the Java
identifier `Clock`.

A single Slice identifier often results in several Java identifiers. For example, for a Slice interface named `Greeter`,
the generated Java code uses the identifiers `Greeter` and `GreeterPrx` (among others).

You can change this mapping and specify your own Java identifier with the `java:identifier` metadata directive. For
example, we can remap `Greeter` to `Receptionist` as follows:

```
["java:identifier:Receptionist"]
interface Greeter { ... }
```

The resulting Java interfaces are `Receptionist` and `ReceptionistPrx`.

{% callout type="warning" %}

When you use a Java keyword such as `synchronized` as a Slice identifier, use `java:identifier` to remap this identifier
in the generated Java code. Without this remapping, the generated Java code won’t compile.

{% /callout %}

{% /language-section %}
