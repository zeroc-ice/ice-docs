{% language-section name="packaging" %}

### C# NuGet Packages

The monolithic `zeroc.ice.net` package has been replaced with modular NuGet packages.

| **Package**               | **Description**                                                                                           |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| iceboxnet                 | The IceBox server for .NET, packaged as a dotnet tool.                                                    |
| ZeroC.Glacier2            | The Glacier2 assembly, used by Glacier2 client applications.                                              |
| ZeroC.Ice                 | The main Ice assembly.                                                                                    |
| ZeroC.Ice.Slice.Tools     | The Slice compiler (`slice2cs`) and MSBuild integration. Replaces the `zeroc.icebuilder.msbuild` package. |
| ZeroC.IceBox              | The IceBox assembly.                                                                                      |
| ZeroC.IceDiscovery        | The IceDiscovery plug-in.                                                                                 |
| ZeroC.IceGrid             | The IceGrid assembly, used by IceGrid client applications.                                                |
| ZeroC.IceLocatorDiscovery | The IceLocatorDiscovery plug-in.                                                                          |
| ZeroC.IceStorm            | The IceStorm assembly, used by publishers and subscribers for IceStorm.                                   |

### Upgrade Steps

#### Using the Visual Studio NuGet UI

1. Right-click your **C# project → Manage NuGet Packages…**
2. On the Installed tab, uninstall:

   - `zeroc.icebuilder.msbuild`
   - `zeroc.ice.net`

3. Install the required Ice 3.8 packages:

   - At minimum, install:

     - `ZeroC.Ice.Slice.Tools`
     - `ZeroC.Ice`

   - If your project depends on additional Ice services (e.g., Glacier2, IceGrid, IceStorm), install the corresponding
     package as listed in the package table above.
   - For preview builds:

     - Add the ZeroC Nightly Builds feed:

       ```text
       https://download.zeroc.com/nexus/repository/nuget-nightly/
       ```

     - Enable **Include prerelease**

4. Select the desired **3.8 version** and click **Install**.
5. **Rebuild** the solution.

#### Editing the Project File

The Ice 3.8 assemblies target .NET 8 (`net8.0`), and Ice 3.8 requires C# 12, the default language version of `net8.0`.
Set the `TargetFramework` of your project to `net8.0` or later, remove a `LangVersion` property that selects an older C#
version, then replace the package references:

```diff
<PropertyGroup>
-  <TargetFramework>net6.0</TargetFramework>
+  <TargetFramework>net8.0</TargetFramework>
</PropertyGroup>
<ItemGroup>
  <SliceCompile Include="../slice/Greeter.ice" />
-  <PackageReference Include="zeroc.ice.net" Version="3.7.*" />
-  <PackageReference Include="zeroc.icebuilder.msbuild" Version="5.0.9" />
+  <PackageReference Include="ZeroC.Ice" Version="3.8.*" />
+  <PackageReference Include="ZeroC.Ice.Slice.Tools" Version="3.8.*" PrivateAssets="all" />
</ItemGroup>
```

Add a `PackageReference` for each service package your project uses, such as `ZeroC.IceStorm`. `iceboxnet` is a dotnet
tool: install it with `dotnet tool install iceboxnet --create-manifest-if-needed`.

### Slice Compilation

`ZeroC.Ice.Slice.Tools` compiles the `SliceCompile` items of your project, like the Ice Builder for MSBuild. By default,
it adds the `.ice` files found in the project directory and its subdirectories to these items. A Slice file located
elsewhere needs its own item:

```xml
<ItemGroup>
  <SliceCompile Include="../slice/Greeter.ice" />
</ItemGroup>
```

Set the `EnableDefaultSliceCompileItems` property to `false` to compile only the Slice files you list:

```xml
<PropertyGroup>
  <EnableDefaultSliceCompileItems>false</EnableDefaultSliceCompileItems>
</PropertyGroup>
```

The following item metadata configure the compilation of a `SliceCompile` item. Express the output directory, include
directories, and compiler options of your Ice 3.7 project with this metadata:

| **Metadata**         | **Description**                                                                                                |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| `OutputDir`          | The directory for the generated C# file. The default is the `generated` subdirectory of the project directory. |
| `IncludeDirectories` | A semicolon-separated list of directories. Each directory becomes a `-I` option of `slice2cs`.                 |
| `AdditionalOptions`  | A semicolon-separated list of options added to the `slice2cs` command line, such as `--enable-analysis`.       |

```xml
<ItemGroup>
  <SliceCompile Include="../slice/Greeter.ice">
    <IncludeDirectories>../slice/includes</IncludeDirectories>
    <AdditionalOptions>--enable-analysis</AdditionalOptions>
    <OutputDir>$(IntermediateOutputPath)Generated</OutputDir>
  </SliceCompile>
</ItemGroup>
```

`slice2cs` no longer accepts the `--tie`, `--impl`, `--impl-tie`, and `--checksum` options. See
[Using the Slice Compiler](../using-the-slice-compiler) for the options of `slice2cs` in Ice 3.8.

{% /language-section %}

{% language-section name="proxy-creation-1" %}

```diff
-Ice.ObjectPrx proxy =
-    communicator.stringToProxy("greeter: tcp -h localhost -p 4061");
-var greeter = GreeterPrxHelper.uncheckedCast(proxy);
+var greeter =
+    GreeterPrxHelper.createProxy(communicator, "greeter:tcp -h localhost -p 4061");
```

{% /language-section %}

{% language-section name="proxy-creation-2" %}

## Optional Values

The `Ice.Optional<T>` struct and `Ice.Util.None` have been removed. An optional field or parameter now maps to a
nullable type, where `null` means "not set". See [Fields](../fields).

```diff
-public override void setAge(Ice.Optional<int> age, Ice.Current current)
+public override void setAge(int? age, Ice.Current current)
{
-    if (age.HasValue)
+    if (age is int value)
    {
-        _age = age.Value;
+        _age = value;
    }
}
```

```diff
-person.nickname = Ice.Util.None;
+person.nickname = null;
```

An optional proxy maps to the same nullable proxy type as a non-optional proxy. Ice does not send an optional proxy
field or parameter that is `null`, so the receiver sees a null optional proxy as not set.

## Structures

A Slice struct now maps to a C# `record struct` or to a `sealed record class`, depending on the types of its fields. See
[Structures](../structures). Update the partial declarations that extend a generated struct to the new form:

```diff
// Slice: struct Point { int x; int y; }
-public partial struct Point
+public partial record struct Point
```

```diff
// Slice: struct Person { string name; int age; }
-public partial class Person
+public sealed partial record class Person
```

A class that derives from the C# class generated for a struct no longer compiles, because this record class is sealed.

## Asynchronous Invocations

Proxies no longer provide the `begin_` and `end_` methods, and `Ice.AsyncResult` has been removed. Call the `Async`
method of the operation, which returns a `Task`:

```diff
-Ice.AsyncResult result = greeter.begin_greet("alice");
-string greeting = greeter.end_greet(result);
+string greeting = await greeter.greetAsync("alice");
```

## Tie Classes

`slice2cs` no longer generates tie classes (`GreeterTie_`) and operations interfaces (`GreeterOperations_`), and
`Ice.TieBase` has been removed. Derive your servant class from the generated skeleton class, and forward each operation
to your implementation object:

```diff
-adapter.add(new GreeterTie_(new GreeterImpl()), Ice.Util.stringToIdentity("greeter"));
+adapter.add(new GreeterServant(new GreeterImpl()), Ice.Util.stringToIdentity("greeter"));
```

```csharp
public class GreeterServant : GreeterDisp_
{
    private readonly GreeterImpl _impl;

    public GreeterServant(GreeterImpl impl) => _impl = impl;

    public override string greet(string name, Ice.Current current) => _impl.greet(name, current);
}
```

## Proxy Timeouts

The `ice_getInvocationTimeout` and `ice_getLocatorCacheTimeout` proxy methods now return a `TimeSpan`. In Ice 3.7, they
returned an `int`: a number of milliseconds for the invocation timeout and a number of seconds for the locator cache
timeout.

```diff
-int invocationTimeout = proxy.ice_getInvocationTimeout();
-int locatorCacheTimeout = proxy.ice_getLocatorCacheTimeout();
+int invocationTimeout = (int)proxy.ice_getInvocationTimeout().TotalMilliseconds;
+int locatorCacheTimeout = (int)proxy.ice_getLocatorCacheTimeout().TotalSeconds;
```

The `ice_invocationTimeout` and `ice_locatorCacheTimeout` methods accept an `int`, with the same units as in Ice 3.7, or
a `TimeSpan`.

## Plug-in Factories

`Ice.Util.registerPluginFactory` has been removed. Add a plug-in factory to the `pluginFactories` property of the
`InitializationData` of each communicator that loads the plug-in:

```diff
-Ice.Util.registerPluginFactory("IceDiscovery", new IceDiscovery.PluginFactory(), true);
-Ice.Communicator communicator = Ice.Util.initialize(ref args);
+var initData = new Ice.InitializationData
+{
+    properties = new Ice.Properties(ref args),
+    pluginFactories = [new IceDiscovery.PluginFactory()]
+};
+Ice.Communicator communicator = Ice.Util.initialize(initData);
```

The communicator creates a plug-in for each factory in this list during its initialization. A factory registered in Ice
3.7 with `loadOnInit` set to `false` created a plug-in only in a communicator configured with the corresponding
`Ice.Plugin.<name>` property; keep such a factory out of the `pluginFactories` of the communicators that don't set this
property.

The `PluginFactory` interface has a new `pluginName` property, which supplies the name of the plug-in created from
`pluginFactories`. Add this property to your own plug-in factories. See [Plug-in API](../plug-in-api).

```diff
public class MyPluginFactory : Ice.PluginFactory
{
+    public string pluginName => "MyPlugin";
+
    public Ice.Plugin create(Ice.Communicator communicator, string name, string[] args) =>
        new MyPlugin(communicator);
}
```

## Thread Hooks

`Ice.ThreadHookPlugin`, the `Ice.ThreadNotification` interface, and the `threadHook` field of `InitializationData` have
been removed. Set the `threadStart` and `threadStop` properties of `InitializationData`:

```diff
-initData.threadHook = new MyThreadNotification();
+initData.threadStart = () => Console.WriteLine("thread started");
+initData.threadStop = () => Console.WriteLine("thread stopped");
```

## Custom Loggers

The `Ice.Logger` interface now derives from `IDisposable`. Add a `Dispose` method to your logger classes:

```diff
public class MyLogger : Ice.Logger
{
+    public void Dispose()
+    {
+        // Release the resources held by this logger.
+    }
}
```

A communicator disposes a logger that it creates itself and a logger installed by a logger plug-in. Your application
disposes the logger that it sets in `InitializationData.logger`.

## Continuations in Asynchronous Code

The threads of an Ice thread pool no longer set a `SynchronizationContext`. In Ice 3.7, this synchronization context ran
the continuation of an `await` made in an Ice thread pool thread in the same Ice thread pool, unless the code called
`ConfigureAwait(false)`. In Ice 3.8, when a servant awaits a proxy invocation that is not yet complete, the continuation
runs in a .NET thread pool thread.

Review the asynchronous code of your servants. Code that relied on an Ice thread pool to limit the number of threads
that execute these continuations, such as a thread pool with a single thread, now needs its own synchronization.

## Slice Metadata

- `cs:attribute` applies only to enums, enumerators, constants, and fields. `slice2cs` ignores, with a warning, a
  `cs:attribute` on a class, struct, exception, or interface. Move such an attribute to a partial declaration of the
  generated type in your own source file:

  ```diff
  -["cs:attribute:System.CLSCompliant(false)"]
  struct Point { int x; int y; }
  ```

  ```csharp
  [System.CLSCompliant(false)]
  public partial record struct Point;
  ```

- `slice2cs` ignores metadata with the `clr:` prefix. Replace this prefix with `cs:`.

  ```diff
  -["clr:generic:List"] sequence<string> StringList;
  +["cs:generic:List"] sequence<string> StringList;
  ```

- The `cs:serializable`, `cs:tie`, and `cs:implements` metadata directives have been removed; `slice2cs` ignores them
  with a warning. A `sequence<byte>` that carried `cs:serializable` now maps to `byte[]`: serialize and deserialize the
  object in your own code.

See [Slice Metadata Directives](../slice-metadata-directives) for the metadata directives of Ice 3.8.

{% /language-section %}
