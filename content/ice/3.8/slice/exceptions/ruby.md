{% language-section name="lang-1" %}

A Slice exception is mapped to a Ruby class with the same name. This mapping is similar to the mapping of
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

```ruby
module ::M
    class GenericException < Ice::UserException
        attr_accessor :reason
        # ...
    end

    class BadTimeValException < ::M::GenericException
    # ...
    end
end
```

There are a number of things to note about this generated code:

1. The generated class `GenericException` inherits from `Ice::UserException`. `Ice::UserException` is the ultimate
   ancestor of all mapped exceptions. It derives indirectly from `::StandardError`.
2. For each Slice field, the generated class contains an instance variable and accessors to read and write this
   variable.
3. The generated class for `BadTimeValException` derives from the generated class `GenericException`.
4. The methods of the generated class are unimportant; in particular, since Ice for Ruby is client-only, you don’t need
   to create user exceptions in Ruby.

{% /language-section %}
