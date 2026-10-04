{% language-section name="mapping" %}

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

The `initialize` and `destroy` methods do nothing.

Now, assuming you wrote a `CustomLogger` class that implements `Ice::Logger`, you can create a plug-in factory function
that creates a `LoggerPlugin` and installs your logger into the communicator:

```cpp
extern "C" ICE_DECLSPEC_EXPORT Ice::Plugin* createCustomLoggerPlugin(
    const Ice::CommunicatorPtr& communicator,
    const std::string&,
    const Ice::StringSeq&)
{
    return new Ice::LoggerPlugin(communicator, std::make_shared<CustomLogger>());
}
```

Then, package your `CustomLogger` implementation and `createCustomLoggerPlugin` in a shared library or DLL, and
configure your communicator to load it at runtime. For example:

```config
Ice.Plugin.CustomLogger=customlogger,0:createCustomLoggerPlugin
```

With `customlogger,0`, Ice loads `customlogger0.dll` on Windows, `libcustomlogger.so.0` on Linux, and
`libcustomlogger.0.dylib` on macOS. See [Ice.Plugin.name](../../property-reference/ice-plugin-properties) for the format
of this entry point.

{% callout type="note" %}

Even though you didn’t implement the plug-in class (`Ice::LoggerPlugin`), you are in effect creating a new plug-in since
you choose the logger given to the `LoggerPlugin` constructor. As a result, you can pick any name for the plug-in
factory function and the plug-in itself.

{% /callout %}

{% /language-section %}
