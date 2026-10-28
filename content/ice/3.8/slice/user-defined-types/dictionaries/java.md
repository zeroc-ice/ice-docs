{% language-section name="mapping" %}

### Default Mapping

Here is the definition of our EmployeeMap once more:

```slice
dictionary<long, Employee> EmployeeMap;
```

As for sequences, the Java mapping does not create a separate named type for this definition. A Slice dictionary maps to
the interface `java.util.Map<K, V>`, where `K` is the mapping of the key type and `V` is the mapping of the value type:
`EmployeeMap` maps to `java.util.Map<Long, Employee>`. When Ice unmarshals a dictionary, it creates a
`java.util.HashMap`. The following code demonstrates how to allocate and use an instance of `EmployeeMap`:

```java
var em = new java.util.HashMap<Long, Employee>();

Employee e = new Employee();
e.number = 31;
e.firstName = "James";
e.lastName = "Gosling";

em.put(e.number, e);
```

### Custom Mapping for Dictionaries

If the semantics of a `HashMap` are not suitable for your application, you can specify another instance type with the
`java:type` metadata directive:

```slice
["java:type:java.util.TreeMap<String, String>"]
dictionary<string, string> StringMap;
```

Ice then creates a `java.util.TreeMap<String, String>` when it unmarshals a `StringMap`, and the generated code keeps
using `java.util.Map<String, String>`, the default formal type, everywhere else. A formal type you specify must
implement `java.util.Map<K, V>`.

The instance type must have an accessible parameterless constructor and must be modifiable: when unmarshaling a
dictionary, the generated code creates the instance with this constructor and fills it with `put`.

The type parameters (`String` above) must be the Java mappings of the key and value types, including nested generic
types such as a custom sequence; the Java compiler reports a mismatch when it compiles the generated code. See
[Sequences](../sequences) for the full syntax of `java:type`.

{% /language-section %}
