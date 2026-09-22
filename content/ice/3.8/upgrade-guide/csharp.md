---
id: upgrade-guide
language: csharp
---

{% language-section name="lang-1" %}

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

       ```
       https://download.zeroc.com/nexus/repository/nuget-nightly/
       ```

     - Enable **Include prerelease**

4. Select the desired **3.8 version** and click **Install**.
5. **Rebuild** the solution.

{% /language-section %}

{% language-section name="lang-2" %}

```diff
-Ice.ObjectPrx proxy =
-    communicator.stringToProxy("greeter: tcp -h localhost -p 4061");
-var greeter = GreeterPrxHelper.uncheckedCast(proxy);
+var greeter =
+    GreeterPrxHelper.createProxy(communicator, "greeter:tcp -h localhost -p 4061");
```

{% /language-section %}

{% language-section name="lang-3" %}

{% /language-section %}
