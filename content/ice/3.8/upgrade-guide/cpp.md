{% language-section name="packaging" %}

### C++ NuGet Package

The C++ NuGet package has been renamed to `ZeroC.Ice.Cpp`.

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

       ```text
       https://download.zeroc.com/nexus/repository/nuget-nightly/
       ```

     - Enable **Include prerelease**

4. Select the desired **3.8 version** and click **Install**.
5. **Rebuild** the solution.

{% /language-section %}

{% language-section name="proxy-creation-1" %}

```diff
-std::shared_ptr<Ice::ObjectPrx> proxy =
-    communicator->stringToProxy("greeter: tcp -h localhost -p 4061");
-std::shared_ptr<GreeterPrx> greeter = Ice::uncheckedCast<GreeterPrx>(proxy);
+GreeterPrx greeter{communicator, "greeter:tcp -h localhost -p 4061"};
```

{% /language-section %}

{% language-section name="proxy-creation-2" %}

## C++ Mapping

Ice 3.8 provides a single C++ mapping, derived from the C++11 mapping of Ice 3.7, and requires a compiler that supports
C++17 or later. Port an application that uses the C++98 mapping of Ice 3.7 to this mapping.

An application that uses the C++11 mapping of Ice 3.7 no longer defines `ICE_CPP11_MAPPING`, and links with libraries
whose names have no `++11` suffix: `Ice` replaces `Ice++11`.

### Proxies

In Ice 3.7, the C++11 mapping holds every proxy in a `std::shared_ptr<GreeterPrx>`. In Ice 3.8, a generated proxy class
such as `GreeterPrx` is a concrete class with value semantics, and a proxy that can be null is a
`std::optional<GreeterPrx>`. The Slice compiler maps a proxy parameter, return value or field to
`std::optional<GreeterPrx>`. The `GreeterPrxPtr` and `Ice::ObjectPrxPtr` aliases no longer exist.

Update the variables, data members, containers and servant operation signatures that hold a proxy, and replace `nullptr`
with `std::nullopt`:

```diff
-std::shared_ptr<GreeterPrx> greeter = nullptr;
+std::optional<GreeterPrx> greeter = std::nullopt;
```

```diff
-void initiateCallback(std::shared_ptr<CallbackReceiverPrx> receiver, const Ice::Current& current) override;
+void initiateCallback(std::optional<CallbackReceiverPrx> receiver, const Ice::Current& current) override;
```

Both `GreeterPrx` and `std::optional<GreeterPrx>` provide `operator->`, so an invocation written as
`greeter->greet("alice")` compiles unchanged.

The functions that return a proxy changed as follows:

| Function                                                                 | Return type in Ice 3.8                                                          |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `Ice::checkedCast<Prx>`                                                  | `std::optional<Prx>`                                                            |
| `Ice::uncheckedCast<Prx>`                                                | `Prx` for a proxy argument, `std::optional<Prx>` for a `std::optional` argument |
| `Communicator::stringToProxy<Prx>`, `Communicator::propertyToProxy<Prx>` | `std::optional<Prx>`                                                            |
| `ObjectAdapter::add<Prx>`, `addWithUUID<Prx>`, `createProxy<Prx>`        | `Prx`                                                                           |

`Prx` is a template parameter of each of these functions, and defaults to `Ice::ObjectPrx` for the `Communicator` and
`ObjectAdapter` functions.

### Optional Values

`std::optional` replaces `Ice::optional` and `IceUtil::Optional`, `std::nullopt` replaces `Ice::nullopt` and
`IceUtil::None`.

```diff
-Ice::optional<std::string> opString(Ice::optional<std::string> p1, Ice::optional<std::string>& p2,
-                                    const Ice::Current& current) override;
+std::optional<std::string> opString(std::optional<std::string> p1, std::optional<std::string>& p2,
+                                    const Ice::Current& current) override;
```

An optional proxy parameter or field, such as `optional(1) Greeter* greeter`, maps to `std::optional<GreeterPrx>`. In
Ice 3.7, it mapped to `Ice::optional<std::shared_ptr<GreeterPrx>>`, which distinguishes a parameter that is not set from
a parameter set to a null proxy. In Ice 3.8, `std::nullopt` represents both. An application that relied on the three
states needs to carry the distinction in another parameter or field.

### Integer Types

The Slice compiler now maps the Slice integer types to the fixed-width integer types of the C++ standard library, and
the `Ice::Byte`, `Ice::Short`, `Ice::Int`, `Ice::Long`, `Ice::Float` and `Ice::Double` aliases no longer exist.

| Slice type | Ice 3.7 (C++11 mapping)       | Ice 3.8        |
| ---------- | ----------------------------- | -------------- |
| `byte`     | `Ice::Byte` (`unsigned char`) | `std::uint8_t` |
| `short`    | `short`                       | `std::int16_t` |
| `int`      | `int`                         | `std::int32_t` |
| `long`     | `long long int`               | `std::int64_t` |

Update the servant operation signatures and the variables that use these types. `std::int64_t` and `long long` are
distinct types on some platforms, such as 64-bit Linux where `std::int64_t` is `long`; there, a servant function
declared with a `long long` parameter no longer overrides the generated function, and a `std::vector<long long>` is not
a Slice `sequence<long>`.

```diff
-long long int opLong(long long int p1, long long int& p2, const Ice::Current& current) override;
+std::int64_t opLong(std::int64_t p1, std::int64_t& p2, const Ice::Current& current) override;
```

### IceUtil

The `IceUtil` namespace and the `IceUtil` headers no longer exist. Use the following utilities from the `Ice` namespace;
`Ice/Ice.h` includes their headers:

| Ice 3.7                                                                     | Ice 3.8                                                             |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `IceUtil::CtrlCHandler`, `IceUtil::CtrlCHandlerCallback`                    | `Ice::CtrlCHandler`, `Ice::CtrlCHandlerCallback`                    |
| `IceUtil::stringToWstring`, `IceUtil::wstringToString`                      | `Ice::stringToWstring`, `Ice::wstringToString`                      |
| `IceUtil::nativeToUTF8`, `IceUtil::UTF8ToNative`                            | `Ice::nativeToUTF8`, `Ice::UTF8ToNative`                            |
| `IceUtil::StringConverter`, `IceUtil::WstringConverter`                     | `Ice::StringConverter`, `Ice::WstringConverter`                     |
| `IceUtil::setProcessStringConverter`, `IceUtil::setProcessWstringConverter` | `Ice::setProcessStringConverter`, `Ice::setProcessWstringConverter` |
| `IceUtil::generateUUID`                                                     | `Ice::generateUUID`                                                 |

Replace the other `IceUtil` classes with the C++ standard library:

| Ice 3.7                                           | C++ standard library                          |
| ------------------------------------------------- | --------------------------------------------- |
| `IceUtil::Mutex`, `IceUtil::RecMutex`             | `std::mutex`, `std::recursive_mutex`          |
| `IceUtil::Mutex::Lock`, `IceUtil::RecMutex::Lock` | `std::lock_guard`, `std::unique_lock`         |
| `IceUtil::Monitor`, `IceUtil::Cond`               | `std::condition_variable` with a `std::mutex` |
| `IceUtil::Thread`                                 | `std::thread`                                 |
| `IceUtil::Time`                                   | `std::chrono`                                 |
| `IceUtil::Shared`, `IceUtil::Handle`              | `std::shared_ptr`                             |

### Proxy Timeouts

`ice_getInvocationTimeout` and `ice_getLocatorCacheTimeout` now return a `std::chrono::milliseconds`. In Ice 3.7, they
return an `Ice::Int`: a number of milliseconds for the invocation timeout, and a number of seconds for the locator cache
timeout.

```diff
-int invocationTimeoutMs = greeter->ice_getInvocationTimeout();
-int locatorCacheTimeoutSec = greeter->ice_getLocatorCacheTimeout();
+std::chrono::milliseconds invocationTimeout = greeter->ice_getInvocationTimeout();
+auto locatorCacheTimeout =
+    std::chrono::duration_cast<std::chrono::seconds>(greeter->ice_getLocatorCacheTimeout());
```

`ice_invocationTimeout` and `ice_locatorCacheTimeout` accept a `std::chrono::duration`. They also still accept an `int`,
in milliseconds for `ice_invocationTimeout` and in seconds for `ice_locatorCacheTimeout`.

### Plug-in Registration

`InitializationData::pluginFactories` replaces `Ice::registerPluginFactory` and the registration functions of
`Ice/RegisterPlugins.h`. In Ice 3.7, a function such as `Ice::registerIceDiscovery` registers a plug-in for every
communicator the process creates afterwards. In Ice 3.8, you list the plug-in factories of each communicator in the
`InitializationData` you pass to `Ice::initialize`:

```diff
-Ice::registerIceDiscovery();
-auto communicator = Ice::initialize(argc, argv);
+Ice::InitializationData initData;
+initData.properties = Ice::createProperties(argc, argv);
+initData.pluginFactories = {IceDiscovery::discoveryPluginFactory()};
+auto communicator = Ice::initialize(initData);
```

| Ice 3.7                                           | Ice 3.8                                                           |
| ------------------------------------------------- | ----------------------------------------------------------------- |
| `Ice::registerIceUDP`                             | `Ice::udpPluginFactory()`                                         |
| `Ice::registerIceWS`                              | `Ice::wsPluginFactory()`                                          |
| `Ice::registerIceDiscovery`                       | `IceDiscovery::discoveryPluginFactory()`                          |
| `Ice::registerIceLocatorDiscovery`                | `IceLocatorDiscovery::locatorDiscoveryPluginFactory()`            |
| `Ice::registerIceBT`                              | `IceBT::btPluginFactory()`                                        |
| `Ice::registerIceIAP`                             | `Ice::iapPluginFactory()`                                         |
| `Ice::registerIceSSL`                             | Remove the call: the SSL transport is built into the Ice library. |
| `Ice::registerPluginFactory(name, factory, true)` | `Ice::PluginFactory{name, factory}`                               |

See [Plug-in API](../plugins/plug-in-facility/plug-in-api) for more information.

The string converter plug-in (`Ice::registerIceStringConverter`, or a plug-in with the entry point
`Ice:createStringConverter`) no longer exists. Before you create a communicator, create the narrow string converter with
`Ice::createWindowsStringConverter` on Windows or `Ice::createIconvStringConverter<char>` on the other platforms, and
install it with `Ice::setProcessStringConverter`. Install a wide string converter, such as the one
`Ice::createIconvStringConverter<wchar_t>` returns, with `Ice::setProcessWstringConverter`.

`Ice::ThreadHookPlugin` no longer exists either. Set the `threadStart` and `threadStop` functions of
`InitializationData`. These two functions also replace the `InitializationData::threadHook` of the C++98 mapping.

{% /language-section %}
