{% language-section name="lang-1" %}

The [entry point](../icebox-properties) of a C# service has the form `assembly:class`. The assembly component can be a
partially or fully qualified assembly name, or an assembly path name.

The details on how assemblies are loaded depends on how you define the assembly component used by the application:

| **Value for** `assembly` | **Examples**                                                                             | **Semantics**                                                                                                                                                                                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Assembly name            | `GreeterService,Version=...,Culture=neutral,publicKeyToken=...` or `GreeterService`      | The assembly name can be a fully or partially qualified assembly name. The assembly is loaded using [Assembly.Load](https://learn.microsoft.com/en-us/dotnet/api/system.reflection.assembly.load?view=net-8.0).                                                   |
| Assembly path name       | `GreeterService.dll`, `services\GreeterService.dll`, or `C:\services\GreeterService.dll` | The path name can be an absolute path name or a path name relative to the iceboxnet's current working directory. The assembly is loaded using [Assembly.LoadFrom](https://learn.microsoft.com/en-us/dotnet/api/system.reflection.assembly.loadfrom?view=net-8.0). |

The `class` component is the complete class name of the service implementation class, which must define a public
constructor.

To instantiate the service, the IceBox server first checks to see if the service defines a constructor taking an
argument of type `Ice.Communicator`. If so, the service calls this constructor and passes the server's communicator,
which should only be used for administrative purposes. For example, the constructor could use this communicator's logger
to display log messages. For a service's normal operations, it must use the communicator that it receives as an argument
to its `start` method.

If the service does not define a constructor taking an `Ice.Communicator` argument, the server invokes the service's
parameterless constructor.

Here is a sample configuration for our C# service:

```config
IceBox.Service.Greeter=GreeterService.dll:Service.GreeterService --Ice.Trace.Network=1 hello there
```

This configuration results in the creation of a service named `GreeterService`. The service implementation resides in
class `Service.GreeterService`, since the `GreeterService.dll` assembly. The argument `--Ice.Trace.Network=1` is
converted into a property definition, and the arguments `hello` and `there` become the two elements in the `args`
sequence parameter that is passed to the `start` method.

{% /language-section %}
