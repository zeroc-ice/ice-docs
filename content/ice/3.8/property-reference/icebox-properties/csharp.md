{% language-section name="lang-1" %}

In C#, `entry_point` has the form `assembly:class`.

The `assembly` can be a partially or fully qualified assembly name, such as `myplugin,Version=0.0.0.0,Culture=neutral`,
or an assembly DLL name such as `myplugin.dll`, and may optionally include a leading relative or absolute path name.

The specified class must implement the `IceBox.Service` interface and provide at least one of the constructors shown in
the example below:

```csharp
public class MyService : IceBox.Service
{
    public MyService(Ice.Communicator serverCommunicator) { ... }
    public MyService() { ... }

    // ...
}
```

The constructor taking an `Ice.Communicator` argument is invoked if present, otherwise the parameterless constructor is
invoked.

If you specify a relative path name in the entry point, the assembly is located relative to the program's current
working directory:

```
IceBox.Service.MyService=..\MyService.dll:MyService
```

Enclose the assembly's path name in quotes if it contains spaces:

```
IceBox.Service.MyService="C:\Program Files\MyService\MyService.dll:MyServiceClass"
```

Finally, if the assembly uses a leading path name, be sure to include the `.dll` extension.

{% /language-section %}
