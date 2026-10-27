{% language-section name="mapping" %}

A Slice identifier maps to an identical JavaScript identifier. For example, the Slice identifier `Clock` becomes the
JavaScript identifier `Clock`. A single Slice identifier often results in several JavaScript identifiers: for a Slice
interface named `Greeter`, the generated JavaScript code uses the identifiers `Greeter` and `GreeterPrx`.

A Slice identifier that is a JavaScript keyword keeps its name in the generated JavaScript code, which is then invalid.
Give this identifier a JavaScript name of your choice with the `js:identifier` metadata directive. For example, `export`
is a JavaScript keyword but a valid Slice identifier:

```slice
struct Settings
{
    ["js:identifier:exportEnabled"]
    bool export;
}
```

In the generated JavaScript code, the field `export` becomes `exportEnabled`.

{% /language-section %}
