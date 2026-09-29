{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

The metadata directives for Python uses the `python` prefix.

### `python:array.array`

Instructs the Ice for Python runtime to unmarshal a sequence as a Python array.array type. This directive applies to
integral built-in types. See [Python mapping for sequences.](../sequences).

### `python:identifier:<identifier>`

This directive applies to all Slice constructs, and instructs the Slice compiler to use the specified
`python-identifier`.

For example:

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

The `python:identifier` directives in this example ensure the enumerators `Red`, `Green`, and `Blue` are mapped to
`RED`, `GREEN`, and `BLUE`, per Python’s usual conventions, instead of the default mapping (`Red`, `Green`, and `Blue`).

### `python:list`

Instruct the Ice for Python runtime to unmarshal a sequence as a list.

### `python:memoryview:<factory>(:type-hint)`

Instructs the Ice for Python runtime to unmarshal a sequence as a custom Python type created from a Python memoryview
object. See [Python mapping for sequences.](../sequences).

### `python:numpy.ndarray`

Instructs the Ice for Python runtime to unmarshal a sequence as a Python numpy.ndarray type. This directive applies to
integral built-in types. See [Python mapping for sequences.](../sequences).

### `python:tuple`

Instructs the Ice for Python runtime to unmarshal a sequence as a Python tuple.

{% /language-section %}
