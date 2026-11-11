{% language-section name="mapping" %}

Ice provides [`Ice::LoggerPlugin`](api:Ice/LoggerPlugin), a plug-in that installs a logger into the communicator.
Assuming you wrote a `CustomLogger` class that implements `Ice::Logger`, create a plug-in factory function that returns
a `LoggerPlugin` for your logger:

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
`libcustomlogger.0.dylib` on macOS. See
[Ice.Plugin.name](../../property-reference/ice-plugin-properties#ice.plugin.name) for the format of this entry point.

{% /language-section %}
