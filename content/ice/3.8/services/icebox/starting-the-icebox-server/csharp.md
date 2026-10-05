{% language-section name="mapping" %}

Build the service project before starting IceBox. The following configuration loads the example service from its .NET 8
Debug build:

```config
IceBox.Service.Greeter=Service/bin/Debug/net8.0/GreeterService.dll:Service.GreeterService --Ice.Trace.Dispatch
```

Save this property in a file named `config` in the directory that contains the `Service` project directory. In that
directory, install the Ice 3.8 version of `iceboxnet` as a local tool, then start the IceBox server:

```shell
dotnet tool install iceboxnet --version "3.8.*" --create-manifest-if-needed
dotnet iceboxnet --Ice.Config=config
```

{% /language-section %}
