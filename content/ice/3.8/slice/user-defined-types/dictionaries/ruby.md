{% language-section name="mapping" %}

Here is the definition of our EmployeeMap once more:

```slice
dictionary<long, Employee> EmployeeMap;
```

As for sequences, the Ruby mapping does not create a separate named type for this definition. Instead, _all_
dictionaries are simply instances of Ruby's hash collection type. For example:

```ruby
em = {}

e = Employee.new
e.number = 31
e.firstName = "James"
e.lastName = "Gosling"

em[e.number] = e
```

{% /language-section %}
