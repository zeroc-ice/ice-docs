{% language-section name="lang-1" %}

Ice provides a C++ plug-in class, `Ice::LoggerPlugin`, that installs a logger into the communicator in its constructor:

```cpp
namespace Ice
{
    class LoggerPlugin : public Plugin
    {
    public:
          LoggerPlugin(const CommunicatorPtr& communicator,
                       const LoggerPtr& logger);

          void initialize() override;
          void destroy() override;
    };
}
```

The implementation of `initialize` and `destroy` in `LoggerPlugin` are no-op.

Now, assuming you wrote a `CustomLogger` class that implements `Ice::Logger`, you can easily create a plug-in factory
function that creates a `LoggerPlugin` and installs your logger into the communicator:

```cpp
extern "C" Ice::Plugin* createCustomLoggerPlugin(
    const Ice::CommunicatorPtr& communicator,
    const std::string&,
    const Ice::StringSeq&)
{
    return new Ice::LoggerPlugin(communicator, make_shared<CustomLogger>());
}
```

Then, package your `CustomLogger` implementation and `createCustomLoggerPlugin` in a shared library or DLL, and
configure your communicator to load it at runtime. For example:

```
Ice.Plugin.CustomLogger=customlogger,0:createCustomLoggerPlugin
```

{% callout type="info" %}

Even though you didn’t implement the plug-in class (`Ice::LoggerPlugin`), you are in effect creating a new plug-in since
you choose the logger given to the `LoggerPlugin` constructor. As a result, you can pick any name for the plug-in
factory function and the plug-in itself.

{% /callout %}

{% /language-section %}
