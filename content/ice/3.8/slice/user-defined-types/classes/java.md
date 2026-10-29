{% language-section name="mapping" %}

A Slice class is mapped to a Java class with the same name. The generated class contains a public field for each Slice
field (just as for structures and exceptions). Consider the following class definition:

```slice
class TimeOfDay
{
    short hour;         // 0 - 23
    short minute;       // 0 - 59
    short second;       // 0 - 59
    string tz;          // e.g. GMT, PST, EDT...
}
```

The Slice compiler generates the following code for this definition:

```java
public class TimeOfDay extends com.zeroc.Ice.Value {
    public short hour;
    public short minute;
    public short second;
    public String tz;

    public TimeOfDay() {
        this.tz = "";
    }

    public TimeOfDay(short hour, short minute, short second, String tz) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
        this.tz = tz;
    }

    public TimeOfDay clone() {
        return (TimeOfDay) super.clone();
    }

    // ...
}
```

There are several things to note about the generated code:

1. The generated class `TimeOfDay` inherits from `com.zeroc.Ice.Value`. This means that all classes implicitly inherit
   from `Value`, which is the ultimate ancestor of all classes.
2. The generated class contains a public field for each Slice field.
3. The generated class has a constructor with a parameter for each field, and a parameterless constructor.

### Generated Constructors

A generated class has the following constructors:

- a constructor with a parameter for each field of the class
- a parameterless constructor that initializes all fields to their default values (see [Fields](../../fields))

An empty class has only the parameterless constructor.

When a Slice class declares both optional and non-optional fields, the mapped Java class provides a third constructor
that accepts arguments for just the non-optional fields; the optional fields are left unset.

The constructor with a parameter for each field allows you to create and initialize an instance in a single statement,
for example:

```java
TimeOfDay tod = new TimeOfDay((short) 14, (short) 45, (short) 0, "PST"); // 2:45pm PST
```

For a derived class, this constructor has a parameter for every field of the class, including inherited fields. For
example, consider the definition from [Class Inheritance](./class-inheritance) once more:

```slice
class TimeOfDay
{
    short hour;         // 0 - 23
    short minute;       // 0 - 59
    short second;       // 0 - 59
}

class DateTime extends TimeOfDay
{
    short day;          // 1 - 31
    short month;        // 1 - 12
    short year;
}
```

The constructors for the generated classes are as follows:

```java
public class TimeOfDay extends ... {
    public TimeOfDay() {}

    public TimeOfDay(short hour, short minute, short second) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
    }

    // ...
}

public class DateTime extends TimeOfDay {
    public DateTime() {}

    public DateTime(
        short hour,
        short minute,
        short second,
        short day,
        short month,
        short year) {
        super(hour, minute, second);
        this.day = day;
        this.month = month;
        this.year = year;
    }

    // ...
}
```

{% /language-section %}
