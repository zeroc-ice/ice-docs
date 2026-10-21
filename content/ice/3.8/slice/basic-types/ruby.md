{% language-section name="mapping" %}

The Slice basic types map to Ruby types as shown in this table:

| **Slice** | **Ruby**          |
| --------- | ----------------- |
| `bool`    | `true` or `false` |
| `byte`    | `Integer`         |
| `short`   | `Integer`         |
| `int`     | `Integer`         |
| `long`    | `Integer`         |
| `float`   | `Float`           |
| `double`  | `Float`           |
| `string`  | `String`          |

The Ruby `Integer` type is unbounded, but a value for a Slice integer type must fit the range of that type. The Ruby
mapping uses the unsigned range for `byte`, 0 to 255.

{% /language-section %}
