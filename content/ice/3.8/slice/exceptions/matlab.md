{% language-section name="mapping" %}

A Slice exception is mapped to a MATLAB class with the same name. This mapping is similar to the mapping of
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

```matlab
classdef GenericException < Ice.UserException
    properties
      reason (1, :) char
    end
    methods
       ...
    end
end

classdef BadTimeValException < M.GenericException
    methods
       ...
    end
end
```

There are a number of things to note about this generated code:

1. The generated class `GenericException` inherits from `Ice.UserException`. `Ice.UserException` is the ultimate
   ancestor of all mapped exceptions. It derives indirectly from `MException`.
2. The generated class contains a public property for each Slice field.
3. The generated class for `BadTimeValException` derives from the generated class `GenericException`.
4. The methods of the generated class are unimportant; in particular, since Ice for MATLAB is client-only, you don’t
   need to create user exceptions in MATLAB.

{% callout type="note" %}

If you remap your exception class name or the name of the enclosing namespace with `matlab:identifier`, remember to set
a custom [Slice loader](../user-defined-types/classes/slice-loaders) in communicators that receive this exception.

{% /callout %}

{% /language-section %}
