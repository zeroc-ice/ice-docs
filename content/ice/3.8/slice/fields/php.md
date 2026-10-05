{% language-section name="language-mapping-1" %}

A Slice field maps to a PHP public variable with the same name.

For example:

```slice
class Address { ... }

struct Person
{
    string name;
    Address address;
}
```

maps to:

```php
class Address extends \Ice\Value
{
    ...
}

class Person
{
    public $name;
    public $address;

    public function __construct($name='', $address=null)
    {
        $this->name = $name;
        $this->address = $address;
    }
    ...
}
```

### Optional Fields {% id="language-mapping-optional-fields" %}

An optional field maps to a PHP public variable with the same name. Tag values are not mapped to PHP.

For example:

```slice
class C
{
    optional(2) string alternateName;
    optional(5) int overrideCode;
    optional(1) Widget* favoriteWidgetProxy;
}
```

maps to:

```php
class C extends \Ice\Value
{
    public $alternateName;
    public $overrideCode;
    public $favoriteWidgetProxy;

    public function __construct($alternateName=\Ice\None, $overrideCode=\Ice\None, $favoriteWidgetProxy=\Ice\None)
    {
        $this->alternateName = $alternateName;
        $this->overrideCode = $overrideCode;
        $this->favoriteWidgetProxy = $favoriteWidgetProxy;
    }
    ...
}
```

The default value for optional fields is `\Ice\None`; it represents the “not set” value.

### Default Values {% id="language-mapping-default-values" %}

Slice default values map to default values in the constructor of the mapped class.

For example:

```slice
struct Location
{
    string name;
    Point point;
    bool display = true;
    string source = "GPS";
}
```

maps to:

```php
class Location
{
    public $name;
    public $point;
    public $display;
    public $source;

    public function __construct($name='', $point=null, $display=true, $source="GPS")
    {
        $this->name = $name;
        $this->point = is_null($point) ? new \Example\Point : $point;
        $this->display = $display;
        $this->source = $source;
    }
    ...
}
```

When you don’t define a default value in Slice, and you initialize a field without providing a value for this field, the
generated code uses the following default:

| **Optional Field?** | **Slice Field Type**                     | **Default PHP Value**                 |
| ------------------- | ---------------------------------------- | ------------------------------------- |
| No                  | `string`                                 | Empty string                          |
|                     | `enum`                                   | First enumerator in enumeration       |
|                     | `struct`                                 | New instance created with no argument |
|                     | Numeric                                  | `0`                                   |
|                     | `bool`                                   | `false`                               |
|                     | `sequence`, `dictionary`, `class`, proxy | `null`                                |
| Yes                 | Any                                      | `\Ice\None`                           |

{% /language-section %}
