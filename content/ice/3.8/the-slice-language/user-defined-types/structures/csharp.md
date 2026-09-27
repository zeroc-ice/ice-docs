{% language-section name="lang-1" %}

Ice for C# supports two different mappings for Slice structures. By default, Slice structures map to C# record structs
if they (recursively) contain only value types. If a Slice structure (recursively) contains a string, proxy, class,
sequence, or dictionary field, it maps to a record class. The `”cs:class”` metadata directive allows you to force the
mapping to a record class for Slice structures that contain only value types.

In addition, for either mapping, you can control whether Slice fields are mapped to fields (the default) or to
properties.

## Mapping to Record Struct

Consider the following structure:

```slice
struct Point
{
    ["cs:identifier:X"]
    double x;

    ["cs:identifier:Y"]
    double y;
}
```

This structure consists of only value types and so, by default, maps to a C# partial record struct:

```csharp
public partial record struct Point
{
    public double X;
    public double Y;

    partial void ice_initialize();

    public Point(double X, double Y)
    {
        this.X = X;
        this.Y = Y;
        ice_initialize();
    }

    public Point(Ice.InputStream istr)
    {
       this.X = istr.readDouble();
       this.Y = istr.readDouble();
       ice_initialize();
    }
}
```

For each field in the Slice definition, the C# record struct contains a corresponding public field. This name of this
public field is by default the name of the Slice field; here, we remapped the fields using the `cs:identifier` metadata
directive.

The generated record has a primary constructor that allows you to construct and initialize a structure in a single
statement:

```csharp
var p = new Point(5.1, 7.8);
```

The generated constructor calls the `ice_initialize` partial method after initializing the fields. You can customize
this initialization by providing your own implementation of `ice_initialize`.

If you apply the `cs:readonly` metadata directive to the Slice struct, all the fields are mapped to readonly C# fields
and the record struct is itself readonly. For example:

```slice
["cs:readonly"]
struct ReadOnlyPoint
{
    ["cs:identifier:X"]
    double x;

    ["cs:identifier:Y"]
    double y;
}
```

maps to:

```csharp
public readonly partial record struct ReadonlyPoint
{
    public readonly double X;
    public readonly double Y;
    ...
}
```

## Mapping to Record Class

Here is our Employee structure once more:

```slice
struct Employee
{
    ["cs:identifier:Number"]
    long number;

    ["cs:identifier:FirstName"]
    string firstName;

    ["cs:identifier:LastName"]
    string lastName;
}
```

The structure contains two strings, which are reference types, so the Slice-to-C# compiler generates a sealed partial
record class for this structure:

```csharp
public sealed partial record class Employee
{
    public long Number;
    public string FirstName = "";
    public string LastName = "";

    partial void ice_initialize();

    public Employee()
    {
        ice_initialize();
    }

    public Employee(long Number, string FirstName, string LastName)
    {
        this.Number = Number;
        ArgumentNullException.ThrowIfNull(FirstName);
        this.FirstName = FirstName;
        ArgumentNullException.ThrowIfNull(LastName);
        this.LastName = LastName;
        ice_initialize();
     }

    public Employee(Ice.InputStream istr)
    {
        this.Number = istr.readLong();
        this.FirstName = istr.readString();
        this.LastName = istr.readString();
        ice_initialize();
    }
}
```

The generated record class provides the following constructors:

- a primary constructor with parameters for all the fields
- a constructor with parameters for fields with the following Slice types: Sequence, Dictionary, Struct mapped to record
  class in C# This constructor may be parameterless. It initializes string fields to the empty string, and other fields
  to their default value (typically `0`, `null` or `default`; see [Fields](../fields)).
- an “unmarshaling” constructor that unmarshals the record class from an InputStream

If you apply the `cs:readonly` metadata directive to the Slice struct, all the fields are mapped to readonly C# fields,
except for fields with a Slice class type (they remain read-write).

## Property Mapping

You can instruct the compiler to emit property definitions instead of public fields. For example:

```slice
["cs:property"] struct Point
{
    ["cs:identifier:X"]
    double x;

    ["cs:identifier:Y"]
    double y;
}
```

The `cs:property` metadata directive causes the compiler to generate a property for each Slice field:

```csharp
public partial record struct Point
{
    public double X { get; set; }
    public double Y { get; set; }

    // ...
    // same as without cs:property
}
```

If you add the `cs:readonly` metadata directive to your Slice struct, the generated properties are get-only, except for
fields with a Slice class type (the mapped properties remain get-set).

{% /language-section %}
