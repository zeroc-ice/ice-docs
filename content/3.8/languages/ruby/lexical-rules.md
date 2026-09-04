---
id: lexical-rules
language: ruby
---

{% language-section name="lang-1" %}

A Slice identifier maps to an identical Ruby identifier, or a Ruby identifier derived from this Slice identifier. For
example, Slice interface `Greeter` is mapped to the Ruby class `GreeterPrx`.

You can change this mapping and specify your own Ruby identifier with the `ruby:identifier` metadata directive. For
example, we can remap `Greeter` to `Receptionist` as follows:

```
["ruby:identifier:Receptionist"]
interface Greeter { ... }
```

The resulting Ruby class is `ReceptionistPrx`.

{% callout type="warning" %}

When you use a Ruby keyword such as `retry` as a Slice identifier, use `ruby:identifier` to remap this identifier in the
generated Ruby code. Without this remapping, the generated Ruby code may be invalid.

{% /callout %}

{% /language-section %}
