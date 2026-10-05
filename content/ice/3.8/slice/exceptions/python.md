{% language-section name="mapping" %}

A Slice exception is mapped to a Python class with the same name. This mapping is similar to the mapping of
[classes](../user-defined-types/classes).

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

```py
@dataclass
class GenericException(UserException):
    reason: str = ""

@dataclass
class BadTimeValException(GenericException):
    pass
```

There are a number of things to note about this generated code:

1. The generated classes are dataclasses, just like the mapping for classes.
2. The generate class `GenericException` inherits from `UserException`. `Ice.UserException` is the ultimate ancestor of
   all mapped exceptions. It derives indirectly from `builtins.Exception`.
3. The generated class contains a public field for each Slice field.
4. The generated class for `BadTimeValException` derives from the generated class `GenericException`.

{% /language-section %}
