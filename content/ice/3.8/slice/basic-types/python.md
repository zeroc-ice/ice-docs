{% language-section name="mapping" %}

The Slice basic types map to Python types as shown in this table:

| **Slice** | **Python** |
| --------- | ---------- |
| `bool`    | `bool`     |
| `byte`    | `int`      |
| `short`   | `int`      |
| `int`     | `int`      |
| `long`    | `int`      |
| `float`   | `float`    |
| `double`  | `float`    |
| `string`  | `str`      |

The Python `int` type is unbounded, but a value for a Slice integer type must fit the range of that type. The Python
mapping uses the unsigned range for `byte`, 0 to 255.

{% /language-section %}
