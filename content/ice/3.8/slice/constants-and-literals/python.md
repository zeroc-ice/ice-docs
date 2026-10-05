{% language-section name="language-mapping-2" %}

Here are the constant definitions once more:

```slice
const bool AppendByDefault = true;
const byte LowerNibble = 0x0f;
const string Advice = "Don't Panic!";
const short TheAnswer = 42;
const double PI = 3.1416;

enum Fruit { Apple, Pear, Orange }
const Fruit FavoriteFruit = Pear;
```

The generated definitions for these constants are shown below:

```py
AppendByDefault = True
LowerNibble = 15
Advice = "Don't Panic!"
TheAnswer = 42
PI = 3.1416
FavoriteFruit = Fruit.Pear
```

As you can see, each Slice constant is mapped to a Python attribute with the same name as the constant.

Slice string literals that contain non-ASCII characters or universal character names are mapped to Python string
literals with `\u` or `\U` escape sequences. For example:

```slice
const string Egg = "œuf";
const string Heart = "c\u0153ur";
const string Banana = "\U0001F34C";
```

is mapped to:

```py
Egg = "\u0153uf"
Heart = "c\u0153ur"
Banana = "\U0001F34C"
```

{% /language-section %}
