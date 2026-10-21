{% language-section name="mapping" %}

A Slice identifier maps to a Ruby identifier derived from it. For example, the Slice interface `Greeter` maps to the
Ruby class `GreeterPrx`.

The mapping changes the case of the first letter of some identifiers:

- It capitalizes the names of modules, interfaces, classes, exceptions, structures, enumerations, enumerators, and
  constants, as Ruby requires for constant, class, and module names. For example, the Slice enumerator `red` maps to the
  Ruby constant `Red`.
- It lowercases the first letter of parameter names.

Operation and field names keep their case.

You can change this mapping and specify your own Ruby identifier with the `ruby:identifier` metadata directive. For
example, we can remap `Greeter` to `Receptionist` as follows:

```slice
["ruby:identifier:Receptionist"]
interface Greeter { ... }
```

The resulting Ruby class is `ReceptionistPrx`. The mapping uses an identifier set with `ruby:identifier` as is.

{% callout type="warning" %}

When you use a Ruby keyword such as `retry` as a Slice identifier, use `ruby:identifier` to remap this identifier in the
generated Ruby code. Without this remapping, the generated Ruby code may be invalid.

{% /callout %}

{% /language-section %}
