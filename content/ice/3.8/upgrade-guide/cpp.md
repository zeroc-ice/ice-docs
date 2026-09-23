{% language-section name="lang-1" %}

### C++ NuGet Package

The C++ NuGet package has been renamed to `ZeroC.Ice.Cpp.`

This package replaces the old `zeroc.ice.vXXX` packages from Ice 3.7.

It also includes the Slice tools for C++, so the `zeroc.icebuilder.msbuild` package is no longer required.

### Upgrade Steps

#### Using the Visual Studio NuGet UI

1. Right-click your **VC++ project → Manage NuGet Packages…**
2. On the Installed tab, uninstall:

   - `zeroc.icebuilder.msbuild`
   - all `zeroc.ice.vXXX` packages

3. On the Browse tab, search for `ZeroC.Ice.Cpp`.

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
-Ice::ObjectPrx proxy =
-    communicator->stringToProxy("greeter: tcp -h localhost -p 4061");
-GreeterPrx greeter = Ice::uncheckedCast<GreeterPrx>(proxy);
+GreeterPrx greeter{communicator, "greeter:tcp -h localhost -p 4061"};
```

{% /language-section %}

{% language-section name="lang-3" %}

{% /language-section %}
