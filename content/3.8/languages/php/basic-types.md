---
id: basic-types
language: php
---

{% language-section name="lang-1" %}
PHP has a limited set of primitive types: `boolean`, `integer`, `double`, and `string`. The Slice built-in types are mapped to PHP types as shown in the table below:

| **Slice** | **PHP** |
| --- | --- |
| `bool` | `true` or `false` |
| `byte` | `integer` |
| `short` | `integer` |
| `int` | `integer` |
| `long` | `integer` |
| `float` | `double` |
| `double` | `double` |
| `string` | `string` |

PHP's `integer` type may not accommodate the range of values supported by Slice's `long` type, therefore `long` values that are outside this range are mapped as strings. Scripts must be prepared to receive an integer or string from any operation that returns a `long` value.
{% /language-section %}
