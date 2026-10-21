{% language-section name="mapping" %}

A Slice structure maps to a Ruby class with the same name, capitalized. For each Slice field, the class contains an
instance variable with read and write accessors. Consider this structure:

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

All these parameters have also default values (see [Fields](../../fields)).

{% /language-section %}
