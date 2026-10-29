{% language-section name="mapping" %}

Here is the definition of our EmployeeMap once more:

```slice
dictionary<long, Employee> EmployeeMap;
```

As for sequences, the Python mapping does not create a separate named type for this definition. A Slice dictionary maps
to a Python `dict`: in the generated type hints, `EmployeeMap` is `dict[int, Employee]` where Ice creates the dictionary
(a proxy return value, a servant parameter) and `Mapping[int, Employee]` where your code supplies it (a proxy parameter,
a servant return value). For example:

```py
em = {}

e = Employee()
e.number = 31
e.firstName = "James"
e.lastName = "Gosling"

em[e.number] = e
```

{% /language-section %}
