{% language-section name="lang-1" %}

A Python identifier maps to an identical Python identifier. For example, the Python identifier `Clock` becomes the
Python identifier `Clock`.

A single Slice identifier often results in several Python identifiers. For example, for a Slice interface named
`Greeter`, the generated Python code uses the identifiers `Greeter` and `GreeterPrx` (among others).

You can change this mapping and specify your own Python identifier with the `python:identifier` metadata directive. For
example, we can remap `Greeter` to `Receptionist` as follows:

```
["python:identifier:Receptionist"]
interface Greeter { ... }
```

The resulting Python classes are `Receptionist` and `ReceptionistPrx`.

{% callout type="warning" %}

When you use a Python keyword such as `raise` as a Slice identifier, use `python:identifier` to remap this identifier in
the generated Python code. Without this remapping, the generated Python code may be invalid.

{% /callout %}

{% /language-section %}
