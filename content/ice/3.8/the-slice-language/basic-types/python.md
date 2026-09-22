---
id: basic-types
language: python
---

{% language-section name="lang-1" %}

The Slice built-in types are mapped to Python types as shown in this table:

| **Slice** | **Python** |
| --------- | ---------- |
| `bool`    | `bool`     |
| `short`   | `int`      |
| `int`     | `int`      |
| `long`    | `int`      |
| `float`   | `float`    |
| `double`  | `float`    |
| `string`  | `str`      |

Although Python supports arbitrary precision in its integer types, the Ice runtime validates integer values to ensure
they have valid ranges for their declared Slice types.

{% /language-section %}
