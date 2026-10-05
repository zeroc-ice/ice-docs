{% language-section name="mapping" %}

A Slice identifier maps to an identical PHP identifier, or a PHP identifier derived from this Slice identifier. For
example, Slice interface `Greeter` is mapped to the PHP class `GreeterPrx`.

You can change this mapping and specify your own PHP identifier with the `php:identifier` metadata directive. For
example, we can remap `Greeter` to `Receptionist` as follows:

```slice
["php:identifier:Receptionist"]
interface Greeter { ... }
```

The resulting PHP class is `ReceptionistPrx`.

{% callout type="warning" %}

When you use a PHP keyword such as `namespace` as a Slice identifier, use `php:identifier` to remap this identifier in
the generated PHP code. Without this remapping, the generated PHP code may be invalid.

{% /callout %}

{% /language-section %}
