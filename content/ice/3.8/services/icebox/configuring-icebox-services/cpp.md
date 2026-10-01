{% language-section name="lang-1" %}

For a C++ service, the [entry point](../icebox-properties) must have the form _library[,version]:symbol_, where
_library_ is the simple name of the service's shared library or DLL, and _symbol_ is the name of the entry point
function. A "simple name" is one without any platform-specific prefixes or extensions; the server adds appropriate
decorations depending on the platform. The simple name may include a leading path, and the version is optional. If
specified, the version is embedded in the library name.

As an example, here is how we could configure [IceStorm](../icestorm), which is implemented as an IceBox service in C++:

```config
IceBox.Service.IceStorm=IceStormService,38:createIceStorm
```

IceBox uses the information provided in the entry point specification to compose a library name. For the IceStorm
example shown above, IceBox on Windows would compose the library name `IceStormService38.dll`. If IceBox is compiled
with debug information, it appends a `d` to the library name, so the name becomes `IceStormService38d.dll` instead.

{% callout type="info" %}

The exact name of the library that is loaded depends on the naming conventions of the platform IceBox executes on. For
example, on a macOS machine, the library name is `libIceStormService38.dylib`.

{% /callout %}

If the simple name does not include a leading path, the shared library or DLL must reside in a directory that appears in
`PATH` on Windows or the shared library search path (such as `LD_LIBRARY_PATH`) on POSIX systems.

The entry point function, _symbol_, must have the signature that we originally presented in our
[example](../developing-icebox-services):

```cpp
IceBox::Service* factoryFunction(const Ice::CommunicatorPtr&)
```

The communicator instance passed to this function is the IceBox server's communicator and should only be used for
administrative purposes. For example, the entry point function could use this communicator's logger to display log
messages. For a service's normal operations, it must use the communicator that it receives as an argument to its `start`
method.

Here is a sample configuration for our C++ service:

```config
IceBox.Service.Greeter=GreeterService:create --Ice.Trace.Network=1 hello there
```

This configuration results in the creation of a service named `Greeter`. The service is expected to reside in
`GreeterService.dll` on Windows or `libGreeterService.so` on Linux, and the entry point function `create` is invoked to
create an instance of the service. The IceBox server converts `--Ice.Trace.Network=1` into a property of the service's
communicator and passes `hello` and `there` to `start` in `args`.

{% /language-section %}
