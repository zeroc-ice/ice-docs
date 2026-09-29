{% language-section name="lang-1" %}

A Slice exception is mapped to a C++ class with the same name. This mapping is similar to the mapping of classes.

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

```cpp
class GenericException : public Ice::UserException
{
public:
    GenericException() noexcept = default;
    GenericException(std::string reason) noexcept;
    GenericException(const GenericException&) noexcept = default;

    void ice_throw() const override;

    std::string reason;
};

class BadTimeValException : public GenericException
{
public:
    using GenericException::GenericException;

    void ice_throw() const override;
};
```

There are a number of things to note about this generated code:

1. The generated class `GenericException` inherits from `Ice::UserException`. `Ice::UserException` is the ultimate
   ancestor of all mapped exceptions. It derives indirectly from `std::exception`.
2. The generated class contains a public data member for each Slice field.
3. The generated class has a constructor that takes one argument for each data member, as well as a default constructor.
4. The generated class as a noexcept copy-constructor, as required by C++ exception rules.
5. The generated class has a virtual function, `ice_throws`. It is implemented by throwing `*this`.
6. The generated class for `BadTimeValException` derives from the generated class `GenericException`.

## Exception Printing

You can print any user exception instance by calling `ice_print` on this instance. `ice_print` is defined on
`Ice::Exception`. Alternatively, you can print an exception instance with operator<<:

```cpp
try
{
   ...
}
catch (const GreeterException& exception)
{
    cout << "Caught " << exception << endl;
}
```

`operator<<` just calls `Ice::Exception::ice_print`.

You can use the metadata directive `"cpp:custom-print"` to tell the Slice compiler that you want to use your own custom
print implementation. For example:

```slice
["cpp:custom-print"]
exception GreeterException { ... }
```

The Slice compiler then generates an `ice_print` override declaration in the mapped C++ class, and you are responsible
to implement this member function.

{% /language-section %}
