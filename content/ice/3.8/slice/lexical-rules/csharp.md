{% language-section name="mapping" %}

A Slice identifier maps to an identical C# identifier. For example, the Slice identifier `Clock` becomes the C#
identifier `Clock`. A single Slice identifier often results in several C# identifiers: for a Slice interface named
`Greeter`, the generated C# code uses the identifiers `Greeter` and `GreeterPrx`, among others.

A Slice identifier that is a C# keyword keeps its name in the generated C# code, which then does not compile. Give this
identifier a C# name of your choice with the `cs:identifier` metadata directive. For example, `delegate` is a C# keyword
but a valid Slice identifier:

```slice
struct Meeting
{
    ["cs:identifier:delegateName"]
    string delegate;
}
```

In the generated C# code, the field `delegate` becomes `delegateName`.

{% /language-section %}
