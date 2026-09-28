{% language-section name="lang-1" %}

Build the service project before starting IceBox. The following configuration loads the example service from its .NET 8
Debug build:

```config
IceBox.Service.Greeter=Service/bin/Debug/net8.0/GreeterService.dll:Service.GreeterService --Ice.Trace.Dispatch
```

Save this property in a file named `config`. Use the .NET SDK to install `iceboxnet` as a local tool. The tool targets
.NET 8, so install the .NET 8 runtime on the machine that runs it.

In the directory containing `config`, create a tool manifest if the project does not already have one:

```shell
dotnet new tool-manifest
```

Install the Ice 3.8 version of the tool, then start the IceBox server from this directory:

```shell
dotnet tool install iceboxnet --version "3.8.*"
dotnet iceboxnet --Ice.Config=config
```

{% /language-section %}
