{% language-section name="mapping" %}

A Slice identifier maps to an identical C++ identifier. For example, the Slice identifier `Clock` becomes the C++
identifier `Clock`. A single Slice identifier often results in several C++ identifiers: for a Slice interface named
`Greeter`, the generated C++ code uses the identifiers `Greeter`, `GreeterPrx`, `GreeterPtr`, `AsyncGreeter`, and
`AsyncGreeterPtr`.

A Slice identifier that is a C++ keyword keeps its name in the generated C++ code, which then does not compile. Give
this identifier a C++ name of your choice with the `cpp:identifier` metadata directive. For example, `template` is a C++
keyword but a valid Slice identifier:

```slice
struct Document
{
    ["cpp:identifier:documentTemplate"]
    string template;
}
```

In the generated C++ code, the field `template` becomes `documentTemplate`.

{% /language-section %}
