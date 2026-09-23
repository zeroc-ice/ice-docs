{% language-section name="lang-1" %}

In C++, you create a communicator by calling the C++ function `Ice::initialize`, for example:

```cpp
int
main(int argc, char* argv[])
{
    Ice::CommunicatorPtr communicator = Ice::initialize(argc, argv);
    // ...
}
```

`initialize` accepts a C++ reference to `argc` and an argument vector `argv`. The function scans the argument vector for
any [command-line options](../setting-properties-on-the-command-line) that are relevant to the Ice runtime; any such
options are removed from the argument vector so, when `initialize` returns, the only options and arguments remaining are
those that concern your application. If anything goes wrong during initialization, `initialize` throws an exception.

{% callout type="warning" %}

The Ice namespace provides additional `initialize`
[overloads](https://code.zeroc.com/ice/3.8/api/cpp/namespaceIce.html#r_ae7b6bf9c35f1cb30463e15c4d9b4ad4c) to pass other
information to the Ice runtime.

{% /callout %}

You need to call `destroy` on the returned object when you're done with this communicator, typically just before
returning from `main`. The `destroy` member function is responsible for cleaning-up the communicator. In particular, in
a server, `destroy` waits for any operation dispatch that are still executing to complete. In addition, `destroy`
ensures that any outstanding threads are joined with and reclaims a number of operating system resources, such as file
descriptors and memory.

The general shape of the `main` function of an Ice-based application is therefore:

```cpp
#include <Ice/Ice.h>

int
main(int argc, char* argv[])
{
    int status = 0;
    try 
    {
        // CommunicatorPtr is an alias for std::shared_ptr<Ice::Communicator>
        Ice::CommunicatorPtr communicator = Ice::initialize(argc, argv);
       
        try
        {
            ... application code ...
 
            communicator->destroy(); // destroy is noexcept
        }
        catch (const std::exception&)
        {
            ...
            // make sure communicator is destroyed if an exception is thrown
            communicator->destroy();
            throw;
        }
    }
    catch (const std::exception& e)
    {
        cerr << e.what() << endl;
        status = 1;   
    }
    return status;
}
```

This code is a little bit clunky, as we need to make sure the communicator gets destroyed in all paths, including when
an exception is thrown. As a result, most of the time, you should use a helper class to call `destroy` on your
communicator.

# `Ice::CommunicatorHolder` Helper Class

A `CommunicatorHolder` is a small helper class that you construct with a communicator. It’s then responsible for
destroying it.

With a `CommunicatorHolder`, our typical `main` function becomes much simpler:

```cpp
#include <Ice/Ice.h>

int
main(int argc, char* argv[])
{
    int status = 0;
    try 
    {
        Ice::CommunicatorPtr communicator = Ice::initialize(argc, argv);

        // Schedule destruction of communicator.
        Ice::CommunicatorHolder communicatorHolder{communicator};

        ... application code ...
 
        // CommunicatorHolder's destructor calls destroy on the communicator
        // whether or not an exception is thrown.
    }
    catch (const std::exception& e)
    {
        cerr << e.what() << endl;
        status = 1;   
    }
    return status;
}
```

{% /language-section %}
