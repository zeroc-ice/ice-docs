{% language-section name="language-mapping" %}

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
    public string TZ;

    partial void ice_initialize();

    public TimeOfDay()
    {
        ...
        ice_initialize();
    }

    public TimeOfDay(short Hour, short Minute, short Second, string TZ)
    {
        this.Hour = Hour;
        this.Minute = Minute;
        this.Second = Second;
        this.TZ = TZ;
        ice_initialize();
    }
}
```

There are a number of things to note about the generated code:

1. The generated class `TimeOfDay` inherits from `Ice.Value`. This means that all classes implicitly inherit from
   `Value`, which is the ultimate ancestor of all classes.
2. The generated class contains a public field for each Slice field.
3. The generated class has a primary constructor and a parameterless constructor.

### Generated Constructors

All generated classes have a public parameterless constructor that initializes all fields using default values (see
[Fields](../../fields)). This constructor is used by the unmarshaling code. The unmarshaling code guarantees that all
non-nullable fields receive a non-null value before the instance is returned to the application code.

{% callout type="info" %}

The parameterless constructor initializes fields with certain types (sequence, dictionary, struct mapped to class) to
`null!`. If you call this constructor, make sure to set these fields after construction.

{% /callout %}

A generated class also provides a primary constructor that accepts one argument for each field of the class. This allows
you to create and initialize a class in a single statement, for example:

```csharp
var tod = new TimeOfDay(14, 45, 00, "PST"); // 2:45pm
```

For a derived class, the primary constructor requires one argument for every field of the class, including inherited
fields.

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
