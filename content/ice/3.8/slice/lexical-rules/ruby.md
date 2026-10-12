{% language-section name="mapping" %}

A Slice identifier maps to a Ruby identifier with the same name, or a Ruby identifier derived from this Slice
identifier. For example, Slice interface `Greeter` is mapped to the Ruby class `GreeterPrx`.

The Ruby mapping adjusts the case of the first letter of some identifiers:

- It capitalizes the first letter of the name of a module, interface, class, exception, structure, enumeration,
  enumerator, or constant, because Ruby requires a constant, class, or module name to start with an uppercase letter.
  For example, the Slice enumerator `red` maps to the Ruby constant `Red`.
- It lowercases the first letter of the name of an operation parameter.

The mapping keeps the name of an operation or a field unchanged.

You can change this mapping and specify your own Ruby identifier with the `ruby:identifier` metadata directive. For
example, we can remap `Greeter` to `Receptionist` as follows:

```slice
["ruby:identifier:Receptionist"]
interface Greeter { ... }
```

The resulting Ruby class is `ReceptionistPrx`. The mapping uses the identifier you specify with `ruby:identifier`
without changing its case.

{% callout type="warning" %}

When you use a Ruby keyword such as `retry` as a Slice identifier, use `ruby:identifier` to remap this identifier in the
generated Ruby code. Without this remapping, the generated Ruby code may be invalid.

{% /callout %}

{% /language-section %}
