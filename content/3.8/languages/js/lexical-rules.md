---
id: lexical-rules
language: js
---

{% language-section name="lang-1" %}
A Slice identifier maps to an identical JavaScript identifier. For example, the Slice identifier `Clock` becomes the JavaScript identifier `Clock`.

A single Slice identifier often results in several JavaScript identifiers. For example, for a Slice interface named `Greeter`, the generated JavaScript code uses the identifiers `Greeter` and `GreeterPrx`.

You can change this mapping and specify your own JavaScript identifier with the `js:identifier` metadata directive. For example, we can remap `Greeter` to `Receptionist` as follows:

```
["js:identifier:Receptionist"]
interface Greeter { ... }
```

The resulting JavaScript symbols are `Receptionist` and `ReceptionistPrx`.

{% callout type="warning" %}
When you use a JavaScript reserved word such as `export` as a Slice identifier, use `js:identifier` to remap this identifier in the generated JavaScript code. Without this remapping, the generated JavaScript code is invalid.
{% /callout %}
{% /language-section %}
