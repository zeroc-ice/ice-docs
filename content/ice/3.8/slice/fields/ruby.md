{% language-section name="lang-1" %}

A Slice field maps to a Ruby instance variable with the same name, plus accessors to read and write this instance
variable.

For example:

```
class Address { ... }

struct Person
{
    string name;
    Address address;
}
```

maps to:

```ruby
class Address < Ice::Value
    ...
end

class Person
    attr_accessor :name, :address

    def initialize(name='', address=nil)
        @name = name
        @address = address
    end
    ...
end
```

## Optional Fields

An optional field maps to a Ruby instance variable and accessors, just like a non-optional field. Tag values are not
mapped to Ruby.

For example:

```
class C
{
    optional(2) string alternateName;
    optional(5) int overrideCode;
    optional(1) Widget* favoriteWidgetProxy;
}
```

maps to:

```ruby
class C < Ice::Value
    attr_accessor :alternateName, :overrideCode, :favoriteWidgetProxy

    def initialize(alternateName=Ice::Unset, overrideCode=Ice::Unset, favoriteWidgetProxy=Ice::Unset)
        @alternateName = alternateName
        @overrideCode = overrideCode
        @favoriteWidgetProxy = favoriteWidgetProxy
    end
end
```

The default value for optional fields is `Ice::Unset`; it represents the “not set” value.

## Default Values

Slice default values map to default values in the mapped `initialize` method.

For example:

```
struct Location
{
    string name;
    Point point;
    bool display = true;
    string source = "GPS";
}
```

maps to:

```ruby
class Location
    attr_accessor :name, :point, :display, :source

    def initialize(name='', point=::Example::Point.new, display=true, source="GPS")
        @name = name
        @point = point
        @display = display
        @source = source
    end

    def hash
        ...
    end

    def ==(other)
        ...
    end

    def eql?(other)
        ...
    end
end
```

When you don’t define a default value in Slice, and you initialize a field without providing a value for this field, the
generated code uses the following default:

| **Optional Field?** | **Slice Field Type**                     | **Default Ruby Value**                |
| ------------------- | ---------------------------------------- | ------------------------------------- |
| No                  | `string`                                 | Empty string                          |
|                     | `enum`                                   | First enumerator in enumeration       |
|                     | `struct`                                 | New instance created with no argument |
|                     | Numeric                                  | `0`                                   |
|                     | `bool`                                   | `false`                               |
|                     | `sequence`, `dictionary`, `class`, proxy | `nil`                                 |
| Yes                 | Any                                      | `Ice::Unset`                          |

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}
