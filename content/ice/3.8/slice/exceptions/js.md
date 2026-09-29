{% language-section name="lang-1" %}

A Slice exception is mapped to a JavaScript class with the same name. This mapping is similar to the mapping of
[JavaScript Mapping for Classes](../classes).

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

```js
class GenericException extends Ice.UserException {
    constructor(reason = "") {
        super();
        this.reason = reason;
    }
    ...
}

class BadTimeValException extends GenericException {}
```

```typescript
class GenericException extends Ice.UserException {
    constructor(reason?: string);

    reason: string;
}

class BadTimeValException extends GenericException {}
```

There are a number of things to note about this generated code:

1. The generated class `GenericException` inherits from `Ice.UserException`. `Ice.UserException` is the ultimate
   ancestor of all mapped exceptions. It derives indirectly from JavaScript `Error` type.
2. The generated class contains a field for each Slice field.
3. The generated class for `BadTimeValException` derives from the generated class `GenericException`.
4. The generated class provides a constructor with a parameter for each field, just like [mapped classes](../classes).

{% /language-section %}
