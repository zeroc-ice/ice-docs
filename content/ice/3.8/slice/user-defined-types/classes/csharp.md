{% language-section name="mapping" %}

A Slice class is mapped to a C# class with the same name. By default, the generated class contains a public field for
each Slice field (just as for structures and exceptions). Alternatively, you can use the property mapping by specifying
the `"cs:property"` metadata directive, which generates classes with properties instead of fields.

Consider the following class definition:

```slice
class TimeOfDay
{
    ["cs:identifier:Hour"]
    short hour;         // 0 - 23

    ["cs:identifier:Minute"]
    short minute;       // 0 - 59

    ["cs:identifier:Second"]
    short second;       // 0 - 59

    ["cs:identifier:TZ"]
    string tz;          // e.g. GMT, PST, EDT...
}
```

The Slice compiler generates the following code for this definition:

```csharp
public partial class TimeOfDay : Ice.Value
{
    public short Hour;
    public short Minute;
    public short Second;
    public string TZ = "";

    partial void ice_initialize();

    public TimeOfDay(short Hour, short Minute, short Second, string TZ)
    {
        this.Hour = Hour;
        this.Minute = Minute;
        this.Second = Second;
        global::System.ArgumentNullException.ThrowIfNull(TZ);
        this.TZ = TZ;
        ice_initialize();
    }

    public TimeOfDay()
    {
        ice_initialize();
    }

    // ...
}
```

There are a number of things to note about the generated code:

1. The generated class `TimeOfDay` inherits from `Ice.Value`. This means that all classes implicitly inherit from
   `Value`, which is the ultimate ancestor of all classes.
2. The generated class contains a public field for each Slice field.
3. The generated class has a constructor with a parameter for each field, and a parameterless constructor.

### Generated Constructors

A generated class has a constructor with a parameter for each field, including inherited fields, so that you can create
and initialize an instance in a single statement:

```csharp
var tod = new TimeOfDay(14, 45, 00, "PST"); // 2:45pm
```

It also has a parameterless constructor, which initializes the fields to their default values (see
[Fields](../../fields)). An empty class has only this constructor.

When a class has fields whose type is a sequence, a dictionary, or a struct mapped to a C# class, the generated class
replaces the parameterless constructor with a constructor that has a parameter for each of these fields and initializes
the other fields to their default values. The parameterless constructor remains public for unmarshaling, but is hidden
from IntelliSense.

### Property Mapping

You can instruct the compiler to emit property definitions instead of public fields. For example:

```slice
["cs:property"] class Point
{
    ["cs:identifier:X"]
    double x;

    ["cs:identifier:Y"]
    double y;
}
```

The `"cs:property"` metadata directive causes the compiler to generate a property for each Slice field:

```csharp
public partial class Point : Ice.Value
{
    public double X { get; set; }
    public double Y { get; set; }

    // ...
    // same as without cs:property
}
```

{% /language-section %}
