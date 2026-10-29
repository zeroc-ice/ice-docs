{% language-section name="general-metadata-directives" %}

The mapped skeleton method for `getGrid` is:

```csharp
GridIntf_GetGridMarshaledResult GetGrid(Ice.Current current);
```

where `GridIntf_GetGridMarshaledResult` is a generated record struct with a constructor that accepts a parameter for the
return value, followed by `Current`:

```csharp
// Generated server-side code
public readonly record struct GridIntf_GetGridMarshaledResult : Ice.MarshaledResult
{
    // Marshals returnValue immediately.
    public GridIntf_GetGridMarshaledResult(Grid? ret, Ice.Current current)
    {
        ...
    }
    ...
}
```

A typical implementation of the `getGrid` operation in your servant would be:

```csharp
public override GridIntf_GetGridMarshaledResult GetGrid(Ice.Current current)
{
    lock (_mutex)
    {
       // marshal _grid field within synchronization
       return new GridIntf_GetGridMarshaledResult(_grid, current);
    }
}
```

{% /language-section %}

{% language-section name="language-specific-metadata-directives" %}

C# metadata directives use the `cs` prefix.

### cs:attribute

`["cs:attribute:attribute"]`. Applies to enumerations, enumerators, constants, and fields.

This directive adds the C# attribute `attribute` to the generated code. For example, `["cs:attribute:System.Flags"]` on
an enumeration adds `[System.Flags]` to the mapped C# enum.

### cs:class

`["cs:class"]`. Applies to structs.

This directive maps the Slice struct to a C# class instead of a C# struct.

### cs:generic

`["cs:generic:type"]`. Applies to sequences and dictionaries.

On a [sequence](../user-defined-types/sequences), `type` is `List`, `LinkedList`, `Queue`, `Stack`, or a custom
collection type; `LinkedList`, `Queue`, and `Stack` are not supported on a sequence of classes. On a
[dictionary](../user-defined-types/dictionaries), `type` is `SortedDictionary` or `SortedList`.

### cs:identifier

`["cs:identifier:name"]`. Applies to any definition, parameter, or field.

This directive maps the Slice construct to the C# identifier `name`. For example:

```slice
interface Greeter
{
    ["cs:identifier:Greet"]
    string greet(string name);
}
```

The operation `greet` maps to the methods `Greet` and `GreetAsync` in C#, instead of `greet` and `greetAsync`.

### cs:internal

`["cs:internal"]`. Applies to interfaces, classes, exceptions, structs, sequences, dictionaries, enumerations, and
constants.

This directive makes the generated C# declarations `internal` instead of `public`.

### cs:namespace

`["cs:namespace:namespace"]`. Applies to top-level modules.

This deprecated directive places the C# namespace of the module in the namespace `namespace`. Use `cs:identifier`
instead.

### cs:property

`["cs:property"]`. Applies to structs, classes, and exceptions.

This directive maps the Slice fields to C# properties instead of C# [fields](../fields).

### cs:readonly

`["cs:readonly"]`. Applies to structs.

When the Slice struct maps to a C# record struct, the mapped record struct is marked `readonly`.

When the Slice struct maps to a C# record class, the fields of this class are mapped to readonly C# fields or get-only
properties (see `cs:property`), except for fields with a Slice class type that are mapped as usual (read-write fields or
get-set properties).

{% /language-section %}
