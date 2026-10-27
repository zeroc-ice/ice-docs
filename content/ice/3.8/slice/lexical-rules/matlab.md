{% language-section name="mapping" %}

A Slice identifier maps to an identical MATLAB identifier, or a MATLAB identifier derived from this Slice identifier.
For example, Slice interface `Greeter` is mapped to the MATLAB class `GreeterPrx`.

A Slice identifier that is a MATLAB keyword keeps its name in the generated MATLAB code, which is then invalid. Give
this identifier a MATLAB name of your choice with the `matlab:identifier` metadata directive. For example, `end` is a
MATLAB keyword but a valid Slice identifier:

```slice
struct Range
{
    ["matlab:identifier:last"]
    int end;
}
```

In the generated MATLAB code, the field `end` becomes `last`.

{% /language-section %}
