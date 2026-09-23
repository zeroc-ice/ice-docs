{% language-section name="lang-1" %}

The mapped skeleton method for `getGrid` is:

```csharp
GridIntf_GetGridMarshaledResult GetGrid(Ice.Current current);
```

where `GridIntf_GetGridMarshaledResult` is a generated record struct with a constructor that accepts a parameter for the
return value, followed by `Current`:

```cpp
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

The mapped skeleton method for `getGrid` is:

```java
GridIntf.GetGridMarshaledResult getGrid(com.zeroc.Ice.Current current);
```

where `GetGridMarshaledResult` is a nested static class with a constructor that accepts a parameter for the return
value, followed by `Current`:

```java
// Generated server-side code
public interface GridIntf extends com.zeroc.Ice.Object {
    public static class GetGridMarshaledResult implements
          com.zeroc.Ice.MarshaledResult {
        public GetGridMarshaledResult(
            Grid returnValue,
            com.zeroc.Ice.Current current) {
            ...
        }
    }
    ...
}
```

A typical implementation of the `getGrid` operation in your servant would be:

```java
@Override
public GridIntf.GetGridMarshaledResult getGrid(com.zeroc.Ice.Current current) {
    synchronized (_mutex) {
       // marshal _grid field within synchronization
       return new GridIntf.GetGridMarshaledResult(_grid, current);
    }
}
```

{% /language-section %}

{% language-section name="lang-2" %}

The metadata directives for C# uses the `cs` prefix.

### `cs:attribute`

This directive applies to enums, enumerators, constants and fields. It injects a C# attribute definition into the
generated code.

### `cs:class`

This directive applies to Slice structures. It directs the Slice compiler to emit a C# class instead of a structure.

### `cs:generic:List`, `cs:generic:LinkedList`, `cs:generic:Queue` and `cs:generic:Stack`

These directives apply to [sequences](../sequences) and map them to the specified sequence type.

### `cs:generic:SortedDictionary` and `cs:generic:SortedList`

This directive applies to [dictionaries](../dictionaries) and maps them to the specified type.

### `cs:generic:csharp-custom-type`

This directive applies to [sequences](../sequences) and allows you map them to custom types.

### `cs:identifier:csharp-identifier`

This directive applies to all Slice constructs, and instructs the Slice compiler to use the specified
`csharp-identifier`.

For example:

```slice
interface Greeter
{
    ["cs:identifier:Greet"]
    string greet(string name);
}
```

The `cs:identifier` directive in this example ensures operation `greet` is mapped to methods `Greet` and `GreetAsync` in
C#, instead of the default (`greet` and `greetAsync`).

### `cs:internal`

This directives applies to Slice interfaces, classes, exceptions, structures, sequences, dictionaries, enumerations and
constants. This directive instructs the Slice compiler to generate an `internal` C# construct, instead of the default,
`public`.

### `cs:namespace:enclosing-csharp-namespace`

This deprecated directive applies to top-level modules. It instructs the Slice compiler to place the generated C#
namespace in the specified namespace. You should use `cs:identifier` instead.

### `cs:property`

This directive applies to Slice structures, classes, and exceptions. It directs the Slice compiler to map Slice fields
to C# properties instead of C# [fields](../fields).

### `cs:readonly`

This directive applies to Slice structures.

When the Slice structure maps to a C# record struct, the mapped record struct is marked `readonly`.

When the Slice structure maps to a C# record class, the fields of this class are mapped to readonly C# fields or
get-only properties (see `cs:property`), except for fields with a Slice class type that are mapped as usual (read-write
fields or get-set properties).

{% /language-section %}
