{% language-section name="mapping" %}

A Slice identifier maps to an identical Swift identifier. For example, the Slice identifier `Clock` becomes the Swift
identifier `Clock`. A single Slice identifier often results in several Swift identifiers: for a Slice interface named
`Greeter`, the generated Swift code uses the identifiers `Greeter` and `GreeterPrx`, among others.

A Slice identifier that is a Swift keyword keeps its name in the generated Swift code, which then does not compile. Give
this identifier a Swift name of your choice with the `swift:identifier` metadata directive. For example, `protocol` is a
Swift keyword but a valid Slice identifier:

```slice
struct Endpoint
{
    ["swift:identifier:protocolName"]
    string protocol;
}
```

In the generated Swift code, the field `protocol` becomes `protocolName`.

{% /language-section %}
