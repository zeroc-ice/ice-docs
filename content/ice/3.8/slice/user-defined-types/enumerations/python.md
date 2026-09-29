{% language-section name="lang-1" %}

A Slice enumeration maps to a Python enum.Enum class. The Slice enum name becomes the Python class name, and each
enumerator becomes a class attribute with the same name.

For example:

```slice
enum Fruit { Apple, Pear, Orange }
```

Generates:

```py
from enum import Enum

class Fruit(Enum):

    Apple = 0
    Pear = 1
    Orange = 2
```

Each enum member has:

- `value` — the underlying Slice integer value.
- `name` — the enumerator’s name as a string.

### Usage

```py
>>> Fruit.Apple.value == 0
True
>>> Fruit(0) == Fruit.Apple
True
>>> Fruit.Apple == 0
False
>>> Fruit.Pear.value
1
>>> Fruit.Pear.name
'Pear'
```

- To get a enumerator from its **value**, use the constructor: `Fruit(0)`. If the value is invalid, Python raises
  `ValueError`.
- To get a member from its **name**, use item access: `Fruit['Apple']`. If the name is invalid, Python raises
  `KeyError`.

For additional details, see the official
[Python enum documentation.](https://docs.python.org/3/library/enum.html#enum.Enum)

{% /language-section %}
