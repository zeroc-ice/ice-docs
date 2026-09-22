---
id: dictionaries
language: python
---

{% language-section name="lang-1" %}

Here is the definition of our EmployeeMap once more:

```slice
dictionary<long, Employee> EmployeeMap;
```

As for sequences, the Python mapping does not create a separate named type for this definition. Instead, _all_
dictionaries are simply instances of Python's dictionary type. For example:

```py
em = {}

e = Employee()
e.number = 31
e.firstName = "James"
e.lastName = "Gosling"

em[e.number] = e
```

The Ice runtime validates the elements of a dictionary to ensure that they are compatible with the declared type; a
`ValueError` exception is raised if an incompatible type is encountered.

{% /language-section %}
