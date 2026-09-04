---
id: enumerations
language: python
---

{% language-section name="mapping" %}

## Python mapping

A Slice enumeration maps to a Python `enum.IntEnum` subclass:

```python
class Fruit(enum.IntEnum):
    Apple = 0
    Pear = 1
    Orange = 2
```

Because it derives from `IntEnum`, an enumerator compares equal to its integer value. This snippet is pulled from a
compilable example:

{% snippet file="examples/python/enumerations.py" name="fruit-usage" /%}

{% /language-section %}
