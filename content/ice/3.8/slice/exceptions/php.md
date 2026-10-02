{% language-section name="lang-1" %}

A Slice exception is mapped to a PHP class with the same name. This mapping is similar to the mapping of
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

```php
class GenericException extends \Ice\UserException
{
    public $reason;
    // ...
}

class BadTimeValException extends \M\GenericException
{
    // ..
}
```

There are a number of things to note about this generated code:

1. The generated class `GenericException` inherits from `\Ice\UserException`. `\Ice\UserException` is the ultimate
   ancestor of all mapped exceptions. It derives indirectly from `\Exception`.
2. The generated class contains a public variable for each Slice field.
3. The generated class for `BadTimeValException` derives from the generated class `GenericException`.
4. The methods of the generated class are unimportant; in particular, since Ice for PHP is client-only, you don’t need
   to create user exceptions in PHP.

{% /language-section %}
