{% language-section name="lang-1" %}

A Slice structure maps to a Java class with the same name. For each Slice field, the Java class contains a corresponding
public field. For example, here is our Employee structure once more:

```slice
struct Employee
{
    long number;
    string firstName;
    string lastName;
}
```

The Slice-to-Java compiler generates the following definition for this structure:

```java
public final class Employee implements java.lang.Cloneable, java.io.Serializable {
    public long number;
    public String firstName;
    public String lastName;

    public Employee() {
        this.firstName = "";
        this.lastName = "";
    }

    public Employee(long number, String firstName, String lastName) {
        this.number = number;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    @Override
    public boolean equals(java.lang.Object rhs) ...

    @Override
    public int hashCode() ...

    @Override
    public Employee clone() ...
}
```

You can optionally customize the mapping for [fields](../../fields) to use getters and setters instead.

The `equals` method compares two structures for equality. Note that the generated class also provides the usual
`hashCode` and `clone` methods. (`clone` has the default behavior of making a shallow copy.)

### Generated Constructors

The mapped Java class provides two constructors:

- canonical constructor with parameters for all the fields
- a parameterless constructor that initializes all fields to default values (see [Fields](../../fields))

{% /language-section %}
