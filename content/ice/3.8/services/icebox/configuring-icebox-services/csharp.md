{% language-section name="lang-1" %}

The [entry point](../../../property-reference/icebox-properties) of a C# service has the form `assembly:class`. The
assembly component can be a partially or fully qualified assembly name, or an assembly path name.

The `assembly` component accepts these forms:

| Form          | Examples                                                                                |
| ------------- | --------------------------------------------------------------------------------------- |
| Assembly name | `GreeterService,Version=...,Culture=neutral,publicKeyToken=...` or `GreeterService`     |
| Assembly path | `GreeterService.dll`, `services\GreeterService.dll` or `C:\services\GreeterService.dll` |

IceBox resolves relative assembly paths against the `iceboxnet` process's current working directory.

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

This configuration creates a service named `Greeter`, implemented by `Service.GreeterService` in `GreeterService.dll`.
The IceBox server converts `--Ice.Trace.Network=1` into a property of the service's communicator and passes `hello` and
`there` to `start` in `args`.

{% /language-section %}
