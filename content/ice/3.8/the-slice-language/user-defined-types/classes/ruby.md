{% language-section name="language-mapping" %}

## Mapping for Classes

# Class Mapping

A Slice class maps to a Ruby class with the same name. For each Slice field, the generated class contains an instance
variable and accessors to read and write it, just as for structures and exceptions. Consider the following class
definition:

```slice
class TimeOfDay
{
    short hour;         // 0 - 23
    short minute;       // 0 - 59
    short second;       // 0 - 59
}
```

The Ruby mapping generates the following code for this definition:

```ruby
class TimeOfDay < ::Ice::Value
    attr_accessor :hours, :minutes, :seconds

    def initialize(hour=0, minute=0, second=0)
        @hour = hour
        @minute = minute
        @second = second
    end
end
```

There are a number of things to note about the generated code:

1. The generated class `TimeOfDay` derives from `Ice::Value`. This reflects the semantics of Slice classes in that all
   classes implicitly inherit from `Ice::Value`, which is the ultimate ancestor of all classes.
2. The constructor defines an instance variable for each Slice field.

## Generated Constructor

The generated constructor has one parameter for each field. This allows you to construct and initialize an instance in a
single statement (instead of first having to construct the instance and then assign to its variables).

All these parameters have also default values (see [Fields](../fields)).

For derived classes, the constructor has one parameter for each of the base class's fields, plus one parameter for each
of the derived class's fields, in base-to-derived order.

{% /language-section %}
