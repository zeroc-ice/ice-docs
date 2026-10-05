{% language-section name="mapping" %}

The Slice built-in types are mapped to Ruby types as shown in this table:

| **Slice** | **Ruby**             |
| --------- | -------------------- |
| `bool`    | `true` or `false`    |
| `byte`    | `Fixnum`             |
| `short`   | `Fixnum`             |
| `int`     | `Fixnum` or `Bignum` |
| `long`    | `Fixnum` or `Bignum` |
| `float`   | `Float`              |
| `double`  | `Float`              |
| `string`  | `String`             |

Although Ruby supports arbitrary precision in its integer types, the Ice runtime validates integer values to ensure they
have valid ranges for their declared Slice types.

{% /language-section %}
