{% language-section name="mapping" %}

A Slice dictionary maps to a native PHP associative array: a dictionary whose key type is an enumeration or one of
`bool`, `byte`, `short`, `int`, or `long` maps to an array with integer keys, and a dictionary with a `string` key type
maps to an array with string keys.

Ice for PHP does not support dictionaries whose key type is a structure.

{% callout type="note" %}

Boolean values are treated as integers, with false equivalent to 0 (zero) and true equivalent to 1 (one).

{% /callout %}

Here is the definition of our EmployeeMap:

```slice
dictionary<long, Employee> EmployeeMap;
```

You can create an instance of this dictionary as shown below:

```php
$e1 = new Employee;
$e1->number = 42;
$e1->firstName = "Stan";
$e1->lastName = "Lippman";

$e2 = new Employee;
$e2->number = 77;
$e2->firstName = "Herb";
$e2->lastName = "Sutter";

$em = [$e1->number => $e1, $e2->number => $e2];
```

{% /language-section %}
