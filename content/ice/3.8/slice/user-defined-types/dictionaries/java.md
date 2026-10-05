{% language-section name="mapping" %}

### Default Mapping

Here is the definition of our EmployeeMap once more:

```slice
dictionary<long, Employee> EmployeeMap;
```

As for sequences, the Java mapping does not create a separate named type for this definition. Instead, the dictionary is
simply an instance of the generic type `java.util.Map<K, V>`, where `K` is the mapping of the key type and `V` is the
mapping of the value type. In the example above, `EmployeeMap` is mapped to the Java type
`java.util.Map<Long, Employee>`. The following code demonstrates how to allocate and use an instance of `EmployeeMap`:

```java
var em = new java.util.HashMap<Long, Employee>();

Employee e = new Employee();
e.number = 31;
e.firstName = "James";
e.lastName = "Gosling";

em.put(e.number, e);
```

### Custom Mapping for Dictionaries

If the semantics of a `HashMap` are not suitable for your application, you can specify an alternate type using the
`java:type` metadata directive as shown in the example below:

```slice
["java:type:java.util.TreeMap<String, String>"]
dictionary<string, string> StringMap;
```

It is your responsibility to use type parameters for the Java class (`String` in the example above) that are the correct
mappings for the dictionary's key and value types.

The compiler requires the formal type to implement `java.util.Map<K, V>`. If you do not specify a formal type, the
compiler uses this type by default.

Note that extra care must be taken when defining dictionary types that contain nested generic types, such as a
dictionary whose element type is a custom sequence. The Java compiler strictly enforces type safety, therefore any
compatibility issues in the custom type metadata will be apparent when the generated code is compiled.

Refer to the [Sequences](../sequences) for more information about `java:type`.

{% /language-section %}
