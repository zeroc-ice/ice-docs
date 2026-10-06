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

Ice 3.7 provided two C++ mappings: the C++98 mapping and the C++11 mapping. Ice 3.8 provides a single C++ mapping,
derived from the C++11 mapping of Ice 3.7. It requires a C++17 compiler.

This section has two parts: one for an application that uses the C++11 mapping of Ice 3.7, and one for an application
that uses the C++98 mapping.

If your application uses the C++98 mapping, port it directly to the Ice 3.8 mapping: there is nothing to gain from
porting it to the C++11 mapping first. A proxy, for example, is a `GreeterPrx` value in both the C++98 mapping and the
Ice 3.8 mapping, while the C++11 mapping holds it in a `std::shared_ptr<GreeterPrx>`.

### Upgrading from the C++11 Mapping

An application that uses the C++11 mapping of Ice 3.7 no longer defines `ICE_CPP11_MAPPING`, and links with libraries
whose names have no `++11` suffix: `Ice` replaces `Ice++11`.

#### Proxies {% id="cpp11-proxies" %}

In Ice 3.7, the C++11 mapping holds every proxy in a `std::shared_ptr<GreeterPrx>`. In Ice 3.8, a generated proxy class
such as `GreeterPrx` is a concrete class with value semantics, and a proxy that can be null is a
`std::optional<GreeterPrx>`. The Slice compiler maps a proxy parameter, return value or field to
`std::optional<GreeterPrx>`.

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

The functions that create a proxy, such as `Communicator::propertyToProxy`, `ObjectAdapter::add` and
`Connection::createProxy`, are now function templates: you choose the type of the proxy they return. The default is
`Ice::ObjectPrx`; we recommend that you always specify the proxy type. For example:

```cpp
// widget is a std::optional<WidgetPrx>
auto widget = communicator->propertyToProxy<WidgetPrx>("MyWidget");
```

#### Optional Values {% id="cpp11-optional-values" %}

`std::optional` replaces `Ice::optional` and `IceUtil::Optional`; `std::nullopt` replaces `Ice::nullopt` and
`IceUtil::None`.

```diff
-Ice::optional<std::string> opString(Ice::optional<std::string> p1, Ice::optional<std::string>& p2,
-                                    const Ice::Current& current) override;
+std::optional<std::string> opString(std::optional<std::string> p1, std::optional<std::string>& p2,
+                                    const Ice::Current& current) override;
```

#### Integer Types {% id="cpp11-integer-types" %}

The Slice compiler now maps the Slice integer types to the fixed-width integer types of the C++ standard library, and
the `Ice::Byte`, `Ice::Short`, `Ice::Int`, `Ice::Long`, `Ice::Float` and `Ice::Double` aliases no longer exist.

| Slice type | Ice 3.7 (C++11 mapping)       | Ice 3.8        |
| ---------- | ----------------------------- | -------------- |
| `byte`     | `Ice::Byte` (`unsigned char`) | `std::uint8_t` |
| `short`    | `short`                       | `std::int16_t` |
| `int`      | `int`                         | `std::int32_t` |
| `long`     | `long long int`               | `std::int64_t` |

Update the servant operation signatures and the variables that use these types. A Slice `sequence<byte>` now maps to
`std::vector<std::byte>`; in Ice 3.7, it mapped to `std::vector<Ice::Byte>`. `std::int64_t` and `long long` are distinct
types on some platforms, such as 64-bit Linux where `std::int64_t` is `long`; there, a servant function declared with a
`long long` parameter no longer overrides the generated function, and a `std::vector<long long>` is not a Slice
`sequence<long>`.

```diff
-long long int opLong(long long int p1, long long int& p2, const Ice::Current& current) override;
+std::int64_t opLong(std::int64_t p1, std::int64_t& p2, const Ice::Current& current) override;
```

#### IceUtil {% id="cpp11-iceutil" %}

The `IceUtil` namespace and the `IceUtil` headers no longer exist:

- `Ice::CtrlCHandler` replaces `IceUtil::CtrlCHandler`.
- The string converter API, such as `StringConverter` and `setProcessStringConverter`, is now in the `Ice` namespace.
- The other `IceUtil` classes, such as `IceUtil::Mutex`, `IceUtil::Thread` and `IceUtil::Time`, have been removed: use
  the C++ standard library.

#### Plug-in Registration {% id="cpp11-plug-in-registration" %}

`Ice::registerPluginFactory` and the `Ice::registerXxx` functions of `Ice/RegisterPlugins.h` have been removed. In Ice
3.8, you install a plug-in by adding its factory to the `pluginFactories` field of the `InitializationData` you pass to
`Ice::initialize`:

```diff
-Ice::registerIceDiscovery();
-auto communicator = Ice::initialize(argc, argv);
+Ice::InitializationData initData;
+initData.properties = Ice::createProperties(argc, argv);
+initData.pluginFactories = {IceDiscovery::discoveryPluginFactory()};
+auto communicator = Ice::initialize(initData);
```

- `Ice::registerIceDiscovery`, `Ice::registerIceLocatorDiscovery`, `Ice::registerIceBT` and `Ice::registerIceIAP` become
  `IceDiscovery::discoveryPluginFactory()`, `IceLocatorDiscovery::locatorDiscoveryPluginFactory()`,
  `IceBT::btPluginFactory()` and `Ice::iapPluginFactory()` in `pluginFactories`.
- `Ice::registerIceSSL`, `Ice::registerIceUDP` and `Ice::registerIceWS` go away: the Ice library includes the SSL, UDP
  and WebSocket transports. When you link with the static Ice library, add `Ice::udpPluginFactory()` and
  `Ice::wsPluginFactory()` to `pluginFactories` for the UDP and WebSocket transports.

The string converter plug-in, installed with `Ice::registerIceStringConverter` or an `Ice.Plugin` property, has been
removed. See [String Converters](../slice/basic-types#string-converters) for the string converters of Ice 3.8.

See [Plug-in API](../plugins/plug-in-facility/plug-in-api) for more information.

### Upgrading from the C++98 Mapping

#### Proxies {% id="cpp98-proxies" %}

A proxy remains a `GreeterPrx` value. In the C++98 mapping, a null proxy is written `0`; in Ice 3.8, a proxy that can be
null is a `std::optional<GreeterPrx>`, and `std::nullopt` replaces `0`. The Slice compiler maps a proxy parameter,
return value or field to `std::optional<GreeterPrx>`.

```diff
-GreeterPrx greeter = 0;
+std::optional<GreeterPrx> greeter = std::nullopt;
```

`Ice::checkedCast` and `Ice::uncheckedCast` replace the static `checkedCast` and `uncheckedCast` functions of the proxy
classes, and `Ice::checkedCast` returns a `std::optional`:

```diff
-GreeterPrx greeter = GreeterPrx::checkedCast(base);
+std::optional<GreeterPrx> greeter = Ice::checkedCast<GreeterPrx>(base);
```

The functions that create a proxy, such as `Communicator::propertyToProxy`, `ObjectAdapter::add` and
`Connection::createProxy`, are now function templates: you choose the type of the proxy they return. The default is
`Ice::ObjectPrx`; we recommend that you always specify the proxy type. For example:

```cpp
// widget is a std::optional<WidgetPrx>
auto widget = communicator->propertyToProxy<WidgetPrx>("MyWidget");
```

#### Servants and Class Instances

`GreeterPtr`, `Ice::ObjectPtr` and the other `Ptr` types are now aliases for `std::shared_ptr`, such as
`std::shared_ptr<Greeter>`. Create servants and class instances with `std::make_shared`, and replace the `dynamicCast`
function of these types with `std::dynamic_pointer_cast`:

```diff
-GreeterPtr servant = new GreeterI;
+GreeterPtr servant = std::make_shared<GreeterI>();
```

```diff
-MyClassPtr instance = MyClassPtr::dynamicCast(value);
+MyClassPtr instance = std::dynamic_pointer_cast<MyClass>(value);
```

A servant function receives its in-parameters by value, where the C++98 mapping passes them by `const` reference:

```diff
-virtual std::string greet(const std::string& name, const Ice::Current& current);
+std::string greet(std::string name, const Ice::Current& current) override;
```

#### Asynchronous Invocations

The `begin_` and `end_` functions and their callback objects no longer exist. Call the `Async` function of the operation
instead: it returns a `std::future`, or accepts `response`, `exception` and `sent` callback functions.

```diff
-Ice::AsyncResultPtr result = greeter->begin_greet("alice");
-std::string greeting = greeter->end_greet(result);
+std::future<std::string> future = greeter->greetAsync("alice");
+std::string greeting = future.get();
```

#### Asynchronous Dispatch

For an operation with the `amd` metadata, the servant implements an `Async` function in place of the `_async` function,
and the `AMD_` callback object becomes two functions: `response`, which replaces `ice_response`, and `exception`, which
replaces `ice_exception`.

```diff
-virtual void greet_async(const AMD_Greeter_greetPtr& cb, const std::string& name, const Ice::Current& current);
+void greetAsync(std::string name, std::function<void(std::string_view)> response,
+                std::function<void(std::exception_ptr)> exception, const Ice::Current& current) override;
```

The Slice compiler also generates an asynchronous skeleton class, such as `AsyncGreeter`, in which every operation is
dispatched this way, without the `amd` metadata.

#### Optional Values {% id="cpp98-optional-values" %}

`std::optional` replaces `IceUtil::Optional`, and `std::nullopt` replaces `IceUtil::None`.

#### Integer Types {% id="cpp98-integer-types" %}

The Slice compiler now maps the Slice integer types to the fixed-width integer types of the C++ standard library, and
the `Ice::Byte`, `Ice::Short`, `Ice::Int`, `Ice::Long`, `Ice::Float` and `Ice::Double` aliases no longer exist.

| Slice type | Ice 3.7 (C++98 mapping)        | Ice 3.8        |
| ---------- | ------------------------------ | -------------- |
| `byte`     | `Ice::Byte` (`unsigned char`)  | `std::uint8_t` |
| `short`    | `Ice::Short` (`short`)         | `std::int16_t` |
| `int`      | `Ice::Int` (`int`)             | `std::int32_t` |
| `long`     | `Ice::Long` (`IceUtil::Int64`) | `std::int64_t` |

Update the servant operation signatures and the variables that use these types. A Slice `sequence<byte>` now maps to
`std::vector<std::byte>`; in Ice 3.7, it mapped to `std::vector<Ice::Byte>`.

#### IceUtil {% id="cpp98-iceutil" %}

The `IceUtil` namespace and the `IceUtil` headers no longer exist:

- `Ice::CtrlCHandler` replaces `IceUtil::CtrlCHandler`.
- The string converter API, such as `StringConverter` and `setProcessStringConverter`, is now in the `Ice` namespace.
- `std::shared_ptr` replaces `IceUtil::Handle`: a class held in a `std::shared_ptr` doesn't derive from
  `IceUtil::Shared`.
- The other `IceUtil` classes, such as `IceUtil::Mutex`, `IceUtil::Thread` and `IceUtil::Time`, have been removed: use
  the C++ standard library.

#### Plug-in Registration {% id="cpp98-plug-in-registration" %}

`Ice::registerPluginFactory` and the `Ice::registerXxx` functions of `Ice/RegisterPlugins.h` have been removed. In Ice
3.8, you install a plug-in by adding its factory to the `pluginFactories` field of the `InitializationData` you pass to
`Ice::initialize`:

```diff
-Ice::registerIceDiscovery();
-Ice::CommunicatorPtr communicator = Ice::initialize(argc, argv);
+Ice::InitializationData initData;
+initData.properties = Ice::createProperties(argc, argv);
+initData.pluginFactories = {IceDiscovery::discoveryPluginFactory()};
+Ice::CommunicatorPtr communicator = Ice::initialize(initData);
```

- `Ice::registerIceDiscovery`, `Ice::registerIceLocatorDiscovery`, `Ice::registerIceBT` and `Ice::registerIceIAP` become
  `IceDiscovery::discoveryPluginFactory()`, `IceLocatorDiscovery::locatorDiscoveryPluginFactory()`,
  `IceBT::btPluginFactory()` and `Ice::iapPluginFactory()` in `pluginFactories`.
- `Ice::registerIceSSL`, `Ice::registerIceUDP` and `Ice::registerIceWS` go away: the Ice library includes the SSL, UDP
  and WebSocket transports. When you link with the static Ice library, add `Ice::udpPluginFactory()` and
  `Ice::wsPluginFactory()` to `pluginFactories` for the UDP and WebSocket transports.

The string converter plug-in, installed with `Ice::registerIceStringConverter` or an `Ice.Plugin` property, has been
removed. See [String Converters](../slice/basic-types#string-converters) for the string converters of Ice 3.8.

See [Plug-in API](../plugins/plug-in-facility/plug-in-api) for more information.

{% /language-section %}
