{% language-section name="lang-1" %}

A Slice identifier maps to an identical Swift identifier. For example, the Slice identifier `Clock` becomes the Swift
identifier `Clock`.

A single Slice identifier often results in several Swift identifiers. For example, for a Slice interface named
`Greeter`, the generated Swift code uses the identifiers `Greeter` and `GreeterPrx` (among others).

You can change this mapping and specify your own Swift identifier with the `swift:identifier` metadata directive. For
example, we can remap `Greeter` to `Receptionist` as follows:

```
["swift:identifier:Receptionist"]
interface Greeter { ... }
```

The resulting Swift interfaces are `Receptionist` and `ReceptionistPrx`.

{% callout type="warning" %}

When you use a Swift keyword such as `protocol` as a Slice identifier, use `swift:identifier` to remap this identifier
in the generated Swift code. Without this remapping, the generated Swift code won’t compile.

{% /callout %}

{% /language-section %}
