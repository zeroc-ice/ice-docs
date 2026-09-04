---
id: classes
language: java
---

{% language-section name="language-mapping" %}

## Mapping for Classes

# Class Mapping

A Slice class is mapped to a Java class with the same name. The generated class contains a public field for each Slice
field (just as for structures and exceptions). Consider the following class definition:

```slice
class TimeOfDay
{
    short hour;         // 0 - 23
    short minute;       // 0 - 59
    short second;       // 0 - 59
    string tz;          // e.g. GMT, PST, EDT...
}
```

The Slice compiler generates the following code for this definition:

```java
public class TimeOfDay extends com.zeroc.Ice.Value {
    public TimeOfDay();
    public TimeOfDay(short hour, short minute, short second, String tz);
 
    public short hour;
    public short minute;
    public short second;
    public String tz;
 
    public TimeOfDay clone();

    ...
}
```

There are a several things to note about the generated code:

1. The generated class `TimeOfDay` inherits from `com.zeroc.Ice.Value`. This means that all classes implicitly inherit
   from `Value`, which is the ultimate ancestor of all classes.
2. The generated class contains a public field for each Slice field.
3. The generated class has a canonical constructor that takes one argument for each field, as well as a parameterless
   constructor.

## Generated Constructors

All generated classes have at least two constructors:

- a canonical constructor that accepts one argument for each field of the class
- a parameterless constructor that initializes all fields using default values described (see [Fields](../fields))

When a Slice class declares both optional and non-optional fields, the mapped Java class provides a third constructor
that accepts arguments for just the non-optional fields; the optional fields are left unset.

The canonical constructor accepts one argument for each field of the class. This allows you to create and initialize a
class in a single statement, for example:

```java
TimeOfDay tod = new TimeOfDay(14, 45, 00, "PST"); // 14:45pm PST
```

For derived classes, the constructor requires an argument for every field of the class, including inherited members. For
example, consider the the definition from [Class Inheritance](../class-inheritance) once more:

```slice
class TimeOfDay
{
    short hour;         // 0 - 23
    short minute;       // 0 - 59
    short second;       // 0 - 59
}

class DateTime extends TimeOfDay
{
    short day;          // 1 - 31
    short month;        // 1 - 12
    short year;         // 1753 onwards
}
```

The constructors for the generated classes are as follows:

```java
public class TimeOfDay extends ... {
    public TimeOfDay() {}

    public TimeOfDay(short hour, short minute, short second) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
    }

    // ...
}

public class DateTime extends TimeOfDay {
    public DateTime() {}

    public DateTime(
        short hour, 
        short minute, 
        short second,
        short day, 
        short month, 
        short year) {
        super(hour, minute, second);
        this.day = day;
        this.month = month;
        this.year = year;
    }

    // ...
}
```

{% /language-section %}
