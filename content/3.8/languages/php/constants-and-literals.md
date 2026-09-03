---
id: constants-and-literals
language: php
---

{% language-section name="lang-1" %}
A Slice constant maps to a PHP constant. Consider the following definitions:

```slice
module M
{
    const bool AppendByDefault = true;
    const byte LowerNibble = 0x0f;
    const string Advice = "Don't Panic!";
    const short TheAnswer = 42;
    const double PI = 3.1416;

    enum Fruit { Apple, Pear, Orange };
    const Fruit FavoriteFruit = Pear;
}
```

The mapping for these constants is shown below:

```php
namespace M
{
    define(__NAMESPACE__ . '\\AppendByDefault', true);
    define(__NAMESPACE__ . '\\LowerNibble', 15);
    define(__NAMESPACE__ . '\\Advice', "Don't Panic!");
    define(__NAMESPACE__ . '\\TheAnswer', 42);
    define(__NAMESPACE__ . '\\PI', 3.1416);
    define(__NAMESPACE__ . '\\FavoriteFruit', \M\Fruit::Pear);
}
```

Slice string literals that contain non-ASCII characters or universal character names are mapped to PHP string literals with these characters replaced by their UTF-8 encoding as octal escapes. For example:

```slice
module M
{
    const string Egg = "œuf";
    const string Heart = "c\u0153ur";
    const string Banana = "\U0001F34C";
}
```

is mapped to:

```php
namespace M
{
    define(__NAMESPACE__ . '\\Egg', "\305\223uf");
    define(__NAMESPACE__ . '\\Heart', "c\305\223ur");
    define(__NAMESPACE__ . '\\Banana', "\360\237\215\214");
}
```

Slice constants are mapped to PHP constants in the enclosing namespace:

```php
$ans = \M\TheAnswer;
```

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}
