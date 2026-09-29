{% language-section name="lang-1" %}

A Slice identifier maps to an identical MATLAB identifier, or a MATLAB identifier derived from this Slice identifier.
For example, Slice interface `Greeter` is mapped to the MATLAB class `GreeterPrx`.

You can change this mapping and specify your own MATLAB identifier with the `matlab:identifier` metadata directive. For
example, we can remap `Greeter` to `Receptionist` as follows:

```slice
["matlab:identifier:Receptionist"]
interface Greeter { ... }
```

The resulting MATLAB class is `ReceptionistPrx`.

{% callout type="warning" %}

When you use a MATLAB keyword such as `classdef` as a Slice identifier, use `matlab:identifier` to remap this identifier
in the generated MATLAB code. Without this remapping, the generated MATLAB code may be invalid.

{% /callout %}

{% /language-section %}
