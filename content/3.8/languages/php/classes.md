---
id: classes
language: php
---

{% language-section name="language-mapping" %}

## Mapping for Classes

# Class Mapping

A Slice class maps to a PHP class with the same name. For each Slice field, the generated class contains a public variable, just as for structures and exceptions. Consider the following class definition:

```slice
class TimeOfDay
{
    short hour;         // 0 - 23
    short minute;       // 0 - 59
    short second;       // 0 - 59
}
```

The PHP mapping generates the following code for this definition:

```php
class TimeOfDay extends \Ice\Value
{
    public $hour;
    public $minute;
    public $second;

    public function __construct($hour=0, $minute=0, $second=0)
    {
        $this->hour = $hour;
        $this->minute = $minute;
        $this->second = $second;
    }
}
```

There are a number of things to note about the generated code:

1. The generated class `TimeOfDay` inherits from `\Ice\Value`. This reflects the semantics of Slice classes in that all classes implicitly inherit from `\Ice\Value`, which is the ultimate ancestor of all classes.
2. The constructor initializes an instance variable for each Slice field.

## Generated Constructor

The generated constructor has one parameter for each field. This allows you to construct and initialize an instance in a single statement (instead of first having to construct the instance and then assign to its variables).

All these parameters have also default values (see [Fields](../fields)).

For derived classes, the constructor has one parameter for each of the base class's fields, plus one parameter for each of the derived class's fields, in base-to-derived order.
{% /language-section %}
