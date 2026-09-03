---
id: structures
language: php
---

{% language-section name="lang-1" %}
A Slice structure maps to a PHP class containing a public variable for each field of the structure. For example, here is our Employee structure once more:

```slice
struct Employee
{
    long number;
    string firstName;
    string lastName;
}
```

The PHP mapping generates the following definition for this structure:

```php
class Employee
{
    public $number;
    public $firstName;
    public $lastName;

    public function __construct($number=0, $firstName='', $lastName='');
    public function __toString();
}
```

The mapping includes a definition for the `__toString` magic method, which returns a string representation of the structure.

## Generated Constructor

The generated constructor has one parameter for each field. This allows you to construct and initialize an instance in a single statement (instead of first having to construct the instance and then assign to its variables).

All these parameters have also default values (see [Fields](../fields)).
{% /language-section %}
