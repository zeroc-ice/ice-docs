{% language-section name="lang-1" %}

A Slice structure maps to a Ruby class with the same name. For each Slice field, the Ruby class contains a corresponding
instance variable as well as accessors to read and write its value. For example, here is our Employee structure once
more:

```slice
struct Employee
{
    long number;
    string firstName;
    string lastName;
}
```

The Ruby mapping generates the following definition for this structure:

```ruby
class Employee
    attr_accessor :number, :firstName, :lastName

    def initialize(number=0, firstName='', lastName='')
        @number = number
        @firstName = firstName
        @lastName = lastName
    end

    def hash
        # ...
    end

    def ==(other)
        # ...
    end

    def inspect
        # ...
    end
end
```

The compiler generates a definition for the `hash` method, which allows instances to be used as keys in a hash
collection. The `hash` method returns a hash value for the structure based on the value of its instance variables.

The `==` method returns true if all instance variables of two structures are (recursively) equal.

The `inspect` method returns a string representation of the structure.

### Generated Constructor

The generated constructor has one parameter for each field. This allows you to construct and initialize an instance in a
single statement (instead of first having to construct the instance and then assign to its attributes).

All these parameters have also default values (see [Fields](../fields)).

{% /language-section %}
