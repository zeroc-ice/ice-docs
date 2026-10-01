{% language-section name="lang-1" %}

A Slice field maps to a Java field with the same name. The type of the Java field is the mapped Slice type. This is the
default mapping.

For example:

```slice
class Address { ... }

struct Person
{
    string name;
    Address address;
}
```

maps to:

```java
public final class Employee implements java.lang.Cloneable, java.io.Serializable {
    public String name; // Slice string maps to Java String
    public Address address; // Slice Address maps the Java Address
    ...
}
```

### JavaBean Mapping

Use the metadata directive `java:getset` to map a Slice field to two or more JavaBean-style methods instead of a public
field.

For each field `val` of type `T`, the mapping generates the following methods:

```java
public T getVal();
public void setVal(T v);
```

The mapping generates an additional method if `T` is the `bool` type:

```java
public boolean isVal();
```

Finally, if `T` is a sequence type with an element type `E`, two methods are generated to provide direct access to
elements:

```java
public E getVal(int index);
public void setVal(int index, E v);
```

Note that these element methods are only generated for sequence types that use the default mapping.

You can apply the `java:getset` directive to an individual field, or to enclosing construct, as illustrated by the
following example:

```slice
sequence<int> IntSeq;
class C
{
    ["java:getset"] int i;
    double d;
}

["java:getset"]
struct S
{
    bool b;
    string str;
}

["java:getset"]
exception E
{
    IntSeq seq;
}
```

JavaBean get-set methods are generated for all fields of struct `S` and exception `E`, but for only one field of class
`C`. Relevant portions of the generated code are shown below:

```java
public class C extends com.zeroc.Ice.Value {
    private int i;
    public double d;

    public int getI() {
        return i;
    }

    public void setI(int i) {
        this.i = i;
    }
}

public final class S implements java.lang.Cloneable, java.io.Serializable {
    private boolean b;
    private java.lang.String str;

    public boolean getB() {
        return b;
    }

    public void setB(boolean b) {
        this.b = b;
    }

    public boolean isB() {
        return b;
    }

    public java.lang.String getStr() {
        return str;
    }

    public void setStr(java.lang.String str) {
        this.str = str;
    }
    ...
}

public class E extends com.zeroc.Ice.UserException {
    private int[] seq;

    public int[] getSeq() {
        return seq;
    }

    public void setSeq(int[] seq) {
        this.seq = seq;
    }

    public int getSeq(int index) {
        return this.seq[index];
    }

    public void setSeq(int index, int val) {
        this.seq[index] = val;
    }
    ...
}
```

### Optional Fields {% id="language-mapping-optional-fields" %}

The mapping for optional fields in Slice classes and exceptions uses a JavaBean-style API that provides methods to get,
set, and clear a field’s value, and test whether a value is set. Consider the following Slice definition:

```slice
class C
{
    string name;
    optional(2) string alternateName;
    optional(5) bool active;
}
```

The generated Java code provides the following API:

```java
public class C extends com.zeroc.Ice.Value {
    public String getAlternateName()...
    public void setAlternateName(String alternateName)...
    public boolean hasAlternateName()...
    public void clearAlternateName()...
    public void optionalAlternateName(java.util.Optional<String> v)...
    public java.util.Optional<String> optionalAlternateName()...

    public boolean isActive()...
    public boolean getActive()...
    public void setActive(boolean v)...
    public boolean hasActive()...
    public void clearActive()...
    public void optionalActive(java.util.Optional<Boolean> v)...
    public java.util.Optional<Boolean> optionalActive()...

    ...
}
```

The `has` method allows you to test whether a field’s value has been set, and the `clear` method removes any existing
value for a field.

{% callout type="info" %}

Calling a `get` method when the field’s value has not been set throws `java.util.NoSuchElementException`.

{% /callout %}

The `optional` methods provide an alternate API that uses standard Java types to encapsulate the value:

- `java.util.OptionalDouble` Encapsulates a value of type `double`
- `java.util.OptionalInt` Encapsulates a value of type `int`
- `java.util.OptionalLong` Encapsulates a value of type `long`
- `java.util.Optional<T>` Encapsulates all other Slice types

### Default Values {% id="language-mapping-default-values" %}

Slice default values change the implementation of the parameterless constructor of the enclosing type.

For example:

```slice
struct Location
{
    string name;
    Point point;
    bool display = true;
    string source = "GPS";
}
```

maps to:

```java
public final class Location implements java.lang.Cloneable, java.io.Serializable {
    public String name;
    public Point point;
    public boolean display;
    public String source;

    public Location() {
        this.name = "";
        this.point = new Point();
        this.display = true;
        this.source = "GPS";
    }

    ...
}
```

When you don’t define a default value in Slice, and you initialize a field without providing a value for this field, the
generated code uses the following default:

| **Optional Field?** | **Slice Field Type**                     | **Default Java Value**                |
| ------------------- | ---------------------------------------- | ------------------------------------- |
| No                  | `string`                                 | Empty string                          |
|                     | `enum`                                   | First enumerator in enumeration       |
|                     | `struct`                                 | New instance created with no argument |
|                     | Numeric                                  | `0`                                   |
|                     | `bool`                                   | `false`                               |
|                     | `class`, proxy, `sequence`, `dictionary` | `null`                                |
| Yes                 | Any                                      | Not set                               |

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}
