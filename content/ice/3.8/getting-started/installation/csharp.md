{% language-section name="language" %}

## Ice for C\#

Ice for C# is a set of NuGet packages for .NET 8 and later. Add `ZeroC.Ice` to your project, and `ZeroC.Ice.Slice.Tools`
to compile its Slice files as part of the build:

```shell
dotnet add package ZeroC.Ice
dotnet add package ZeroC.Ice.Slice.Tools
```

| Package                                                                               | Contents                                                           |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [ZeroC.Ice](https://www.nuget.org/packages/ZeroC.Ice)                                 | The Ice runtime.                                                   |
| [ZeroC.Ice.Slice.Tools](https://www.nuget.org/packages/ZeroC.Ice.Slice.Tools)         | The Slice-to-C# compiler (`slice2cs`) and its MSBuild integration. |
| [ZeroC.Glacier2](https://www.nuget.org/packages/ZeroC.Glacier2)                       | The Glacier2 client API.                                           |
| [ZeroC.IceBox](https://www.nuget.org/packages/ZeroC.IceBox)                           | The API for writing IceBox services.                               |
| [ZeroC.IceDiscovery](https://www.nuget.org/packages/ZeroC.IceDiscovery)               | The IceDiscovery plug-in.                                          |
| [ZeroC.IceGrid](https://www.nuget.org/packages/ZeroC.IceGrid)                         | The IceGrid client API.                                            |
| [ZeroC.IceLocatorDiscovery](https://www.nuget.org/packages/ZeroC.IceLocatorDiscovery) | The IceLocatorDiscovery plug-in.                                   |
| [ZeroC.IceStorm](https://www.nuget.org/packages/ZeroC.IceStorm)                       | The IceStorm client API.                                           |
| [iceboxnet](https://www.nuget.org/packages/iceboxnet)                                 | The IceBox server for .NET, as a .NET tool.                        |

`ZeroC.Ice.Slice.Tools` includes `slice2cs` for Linux on x64 and arm64, macOS on Apple silicon, and Windows on x64.

To install the IceBox server for .NET:

```shell
dotnet tool install --global iceboxnet
```

{% /language-section %}
