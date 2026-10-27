{% language-section name="mapping" %}

A Slice identifier maps to an identical Python identifier. For example, the Slice identifier `Clock` becomes the Python
identifier `Clock`. A single Slice identifier often results in several Python identifiers: for a Slice interface named
`Greeter`, the generated Python code uses the identifiers `Greeter` and `GreeterPrx`, among others.

A Slice identifier that is a Python keyword keeps its name in the generated Python code, which is then invalid. Give
this identifier a Python name of your choice with the `python:identifier` metadata directive. For example, `raise` is a
Python keyword but a valid Slice identifier:

```slice
struct Salary
{
    ["python:identifier:raiseAmount"]
    double raise;
}
```

In the generated Python code, the field `raise` becomes `raiseAmount`.

{% /language-section %}
