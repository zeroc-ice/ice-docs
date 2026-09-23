{% language-section name="lang-1" %}

A Slice enumeration is mapped to a PHP class: the name of the Slice enumeration becomes the name of the PHP class; for
each enumerator, the class contains a constant with the same name as the enumerator. For example:

```slice
enum Fruit { Apple, Pear, Orange }
```

The generated PHP class looks as follows:

```php
class Fruit
{
    const Apple = 0;
    const Pear = 1;
    const Orange = 2;
}
```

Suppose we modify the Slice definition to include a custom enumerator value:

```slice
enum Fruit { Apple, Pear = 3, Orange }
```

The generated PHP class changes accordingly:

```php
class Fruit
{
    const Apple = 0;
    const Pear = 3;
    const Orange = 4;
}
```

Since enumerated values are mapped to integer constants, application code is not required to use the generated
constants. When an enumerated value enters the Ice runtime, Ice validates that the given integer is a valid value for
the enumeration. However, to minimize the potential for defects in your code, we recommend using the generated constants
instead of literal integers.

{% /language-section %}
