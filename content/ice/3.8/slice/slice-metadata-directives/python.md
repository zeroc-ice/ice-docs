{% language-section name="language-specific-metadata-directives" %}

Python metadata directives use the `python` prefix.

### python:array.array

`["python:array.array"]`. Applies to sequences of `bool`, `byte`, `short`, `int`, `long`, `float`, and `double`.

This directive instructs the Ice for Python runtime to unmarshal the sequence as a Python `array.array`. See
[Python mapping for sequences](../user-defined-types/sequences).

### python:identifier

`["python:identifier:name"]`. Applies to any definition, parameter, or field.

This directive maps the Slice construct to the Python identifier `name`. For example:

```slice
enum Color
{
    ["python:identifier:RED"]
    Red,

    ["python:identifier:GREEN"]
    Green,

    ["python:identifier:BLUE"]
    Blue
}
```

The enumerators `Red`, `Green`, and `Blue` map to `RED`, `GREEN`, and `BLUE`, per Python’s usual conventions, instead of
the default mapping (`Red`, `Green`, and `Blue`).

### python:list

`["python:list"]`. Applies to sequences.

This directive instructs the Ice for Python runtime to unmarshal the sequence as a list.

### python:memoryview

`["python:memoryview:factory"]` or `["python:memoryview:factory:type-hint"]`. Applies to sequences of `bool`, `byte`,
`short`, `int`, `long`, `float`, and `double`.

This directive instructs the Ice for Python runtime to unmarshal the sequence as a custom Python type that the function
`factory` creates from a Python memoryview object; `type-hint` is the type of the result in the generated type hints.
See [Python mapping for sequences](../user-defined-types/sequences).

### python:numpy.ndarray

`["python:numpy.ndarray"]`. Applies to sequences of `bool`, `byte`, `short`, `int`, `long`, `float`, and `double`.

This directive instructs the Ice for Python runtime to unmarshal the sequence as a Python `numpy.ndarray`. See
[Python mapping for sequences](../user-defined-types/sequences).

### python:tuple

`["python:tuple"]`. Applies to sequences.

This directive instructs the Ice for Python runtime to unmarshal the sequence as a Python tuple.

{% /language-section %}
