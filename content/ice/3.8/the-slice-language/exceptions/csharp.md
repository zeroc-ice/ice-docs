{% language-section name="lang-1" %}

A Slice exception is mapped to a C# class with the same name. This mapping is similar to the mapping of
[classes](../csharp-mapping-for-classes).

Consider the following Slice exceptions:

```slice
module M
{
    exception GenericException
    {
        string reason;
    }

    exception BadTimeValException extends GenericException {}
}
```

The Slice compiler generates the following code for these exceptions:

```csharp
public partial class GenericException : Ice.UserException
{
    public string reason = "";

    public GenericException(string reason) { ... }
    public GenericException() {}
}

public partial class BadTimeValException : GenericException
{
      public BadTimeValException(string reason)
          : base(reason)
      {
      }

      public BadTimeValException() {}
}
```

There are a number of things to note about this generated code:

1. The generated class `GenericException` inherits from `Ice.UserException`. `Ice.UserException` is the ultimate
   ancestor of all mapped exceptions. It derives indirectly from `System.Exception`.
2. The generated class contains a public field for each Slice field.
3. The generated class for `BadTimeValException` derives from the generated class `GenericException`.
4. The generated class provides a primary constructor and a parameterless constructor; they are identical to the
   generated constructors for classes. See [C# Mapping for Classes](../csharp-mapping-for-classes).

{% /language-section %}
