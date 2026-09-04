---
id: modules
language: python
---

{% language-section name="lang-1" %}

A Slice module maps to a Python package with the same name. The mapping preserves the nesting of the Slice definitions.
For example:

```slice
module M1::M2
{
    // ...
}

// ...

module M1    // Reopen M1
{
    // ...
}
```

This definition maps to the corresponding Python definitions:

```
M1/__init__.py
M2/M2/__init__.py
```

If a Slice module is reopened, the corresponding PHP namespace is reopened as well.

### Custom Mapping

The `python:identifier` metadata directive allows you to map a module to a Python package or sub-package of your choice.
For example:

```slice
// module Time becomes package Remote.Clock in Python.
["python:identifier:Remote\Clock"]
module Time
{
    // ...
}
```

You can only use `python:identifier` on a module with a simple name - this metadata directive is not compatible with the
nested module syntax.

{% /language-section %}
