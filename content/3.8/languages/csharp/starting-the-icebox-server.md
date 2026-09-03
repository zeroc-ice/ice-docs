---
id: starting-the-icebox-server
language: csharp
---

{% language-section name="lang-1" %}
The configuration file for our example C# service is shown below:

```
IceBox.Service.Greeter=Service/bin/Debug/net8.0/GreeterService.dll:Service.GreeterService --Ice.Trace.Dispatch
```

Assuming this property resides in a configuration file named `config`, we can start the C# IceBox server as follows:

```
dotnet iceboxnet --Ice.Config=config
```

{% /language-section %}
