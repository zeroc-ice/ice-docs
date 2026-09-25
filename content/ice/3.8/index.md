---
title: Overview
description: Documentation for Ice, the Slice language, and the Ice services.
shape: wide
showReadingTime: false
showAside: false
status: latest
languages:
  - cpp
  - csharp
  - java
  - js
  - matlab
  - php
  - python
  - ruby
  - swift
previousVersions:
  label: Previous Versions
  url: https://archive.zeroc.com/
pages:
  - greeter-example
  - upgrade-guide
  - basics
  - the-slice-language
  - the-ice-runtime
  - administration-and-diagnostics
  - plugins
  - ice-services
  - ice-encoding
  - ice-protocol
  - windows-services-and-linux-daemons
  - versioning-your-application
  - property-reference
  - backward-compatibility-of-ice-versions
  - using-ice-and-icerpc-together
  - release-notes
---

{% selection /%}

Ice is a complete RPC framework that helps you build networked applications with minimal effort.

- **Ice does the networking.** It takes care of opening network connections, serializing and deserializing data for
  network transmission, and retrying failed connection attempts, so you can focus on your application logic.
- **Start with the Greeter Example.** Writing a client-server application with Ice does not take much code.
  [See for yourself!](../greeter-example)

{% showcase %}

{% iflang langs="cpp,js,php,python,ruby,swift" %}

```slice {% title="Greeter.ice" %}
module VisitorCenter
{
    /// Represents a simple greeter.
    interface Greeter
    {
        /// Creates a personalized greeting.
        string greet(string name);
    }
}
```

{% /iflang %}

{% iflang langs="csharp" %}

```slice {% title="Greeter.ice" %}
module VisitorCenter
{
    /// Represents a simple greeter.
    interface Greeter
    {
        /// Creates a personalized greeting.
        ["cs:identifier:Greet"]
        string greet(string name);
    }
}
```

{% /iflang %}

{% iflang langs="java" %}

```slice {% title="Greeter.ice" %}
["java:identifier:com.example.visitorcenter"]
module VisitorCenter
{
    /// Represents a simple greeter.
    interface Greeter
    {
        /// Creates a personalized greeting.
        string greet(string name);
    }
}
```

{% /iflang %}

{% iflang langs="matlab" %}

```slice {% title="Greeter.ice" %}
["matlab:identifier:visitorcenter"]
module VisitorCenter
{
    /// Represents a simple greeter.
    interface Greeter
    {
        /// Creates a personalized greeting.
        string greet(string name);
    }
}
```

{% /iflang %}

{% iflang langs="cpp" %}

```cpp {% title="Client.cpp" %}
Ice::CommunicatorPtr communicator =
    Ice::initialize(argc, argv);
Ice::CommunicatorHolder holder{communicator};

VisitorCenter::GreeterPrx greeter{
    communicator,
    "greeter:tcp -h localhost -p 4061"};

string greeting = greeter.greet("alice");
cout << greeting << endl;
```

```cpp {% title="Server.cpp" %}
class Chatbot : public VisitorCenter::Greeter
{
public:
    string greet(
        string name, const Ice::Current&) override
    {
        return "Hello, " + name + "!";
    }
};

Ice::CommunicatorPtr communicator =
    Ice::initialize(argc, argv);
Ice::CommunicatorHolder holder{communicator};

auto adapter =
    communicator->createObjectAdapterWithEndpoints(
        "GreeterAdapter", "tcp -p 4061");
adapter->add(
    make_shared<Chatbot>(),
    Ice::Identity{"greeter"});
adapter->activate();
communicator->waitForShutdown();
```

{% /iflang %}

{% iflang langs="csharp" %}

```csharp {% title="Client.cs" %}
await using var communicator =
    new Ice.Communicator(ref args);

GreeterPrx greeter = GreeterPrxHelper.createProxy(
    communicator,
    "greeter:tcp -h localhost -p 4061");

string greeting =
    await greeter.GreetAsync("alice");
Console.WriteLine(greeting);
```

```csharp {% title="Server.cs" %}
class Chatbot : GreeterDisp_
{
    public override string Greet(
        string name, Ice.Current current) =>
        $"Hello, {name}!";
}

await using var communicator =
    new Ice.Communicator(ref args);

Ice.ObjectAdapter adapter =
    communicator.createObjectAdapterWithEndpoints(
        "GreeterAdapter", "tcp -p 4061");
adapter.add(
    new Chatbot(),
    new Ice.Identity { name = "greeter" });
adapter.activate();
await communicator.shutdownCompleted;
```

{% /iflang %}

{% iflang langs="java" %}

```java {% title="Client.java" %}
try (var communicator = new Communicator(args)) {
    var greeter = GreeterPrx.createProxy(
        communicator,
        "greeter:tcp -h localhost -p 4061");

    String greeting = greeter.greet("alice");
    System.out.println(greeting);
}
```

```java {% title="Server.java" %}
class Chatbot implements Greeter {
    @Override
    public String greet(
            String name, Current current) {
        return "Hello, " + name + "!";
    }
}

try (var communicator = new Communicator(args)) {
    ObjectAdapter adapter = communicator
        .createObjectAdapterWithEndpoints(
            "GreeterAdapter", "tcp -p 4061");
    adapter.add(
        new Chatbot(),
        new Identity("greeter", ""));
    adapter.activate();
    communicator.waitForShutdown();
}
```

{% /iflang %}

{% iflang langs="js" %}

```js {% title="client.js" %}
await using communicator =
    new Ice.Communicator(process.argv);

const greeter = new VisitorCenter.GreeterPrx(
    communicator,
    "greeter:tcp -h localhost -p 4061");

const greeting = await greeter.greet("alice");
console.log(greeting);
```

{% /iflang %}

{% iflang langs="matlab" %}

```matlab {% title="client.m" %}
communicator = Ice.Communicator(args);
cleanup = onCleanup(@() communicator.destroy());

greeter = visitorcenter.GreeterPrx( ...
    communicator, ...
    'greeter:tcp -h localhost -p 4061');

greeting = greeter.greet('alice');
fprintf('%s\n', greeting);
```

{% /iflang %}

{% iflang langs="php" %}

```php {% title="Client.php" %}
$communicator = Ice\initialize($argv);

$greeter =
    VisitorCenter\GreeterPrxHelper::createProxy(
        $communicator,
        'greeter:tcp -h localhost -p 4061');

$greeting = $greeter->greet("alice");
echo "$greeting\n";
```

{% /iflang %}

{% iflang langs="python" %}

```python {% title="client.py" %}
async with Ice.Communicator(
    sys.argv, eventLoop=asyncio.get_running_loop()
) as communicator:
    greeter = VisitorCenter.GreeterPrx(
        communicator,
        "greeter:tcp -h localhost -p 4061")

    greeting = await greeter.greetAsync("alice")
    print(greeting)
```

```python {% title="server.py" %}
class Chatbot(VisitorCenter.Greeter):
    def greet(
        self, name: str, current: Ice.Current
    ) -> str:
        return f"Hello, {name}!"


with Ice.Communicator(sys.argv) as communicator:
    adapter = (
        communicator
        .createObjectAdapterWithEndpoints(
            "GreeterAdapter", "tcp -p 4061")
    )
    adapter.add(
        Chatbot(), Ice.Identity(name="greeter"))
    adapter.activate()
    communicator.waitForShutdown()
```

{% /iflang %}

{% iflang langs="ruby" %}

```ruby {% title="client.rb" %}
Ice::initialize(ARGV) do |communicator|
  greeter = VisitorCenter::GreeterPrx.new(
    communicator,
    "greeter:tcp -h localhost -p 4061")

  greeting = greeter.greet("alice")
  puts greeting
end
```

{% /iflang %}

{% iflang langs="swift" %}

```swift {% title="Client.swift" %}
var args = CommandLine.arguments
let communicator = try Ice.initialize(&args)
defer { communicator.destroy() }

let greeter = try makeProxy(
    communicator: communicator,
    proxyString:
        "greeter:tcp -h localhost -p 4061",
    type: GreeterPrx.self)

let greeting = try await greeter.greet("alice")
print(greeting)
```

```swift {% title="Server.swift" %}
struct Chatbot: Greeter {
    func greet(
        name: String, current _: Ice.Current
    ) -> String {
        "Hello, \(name)!"
    }
}

var args = CommandLine.arguments
let communicator = try Ice.initialize(&args)
defer { communicator.destroy() }

let adapter = try communicator
    .createObjectAdapterWithEndpoints(
        name: "GreeterAdapter",
        endpoints: "tcp -p 4061")
try adapter.add(
    servant: Chatbot(),
    id: Ice.Identity(name: "greeter"))
try adapter.activate()
await communicator.shutdownCompleted()
```

{% /iflang %}

{% /showcase %}

## Explore the manual

The main chapters. Every chapter is in the table of contents; to find any page by name, use the search box in the top
bar or press `⌘K`.

{% grid %}

{% card icon="rocket" title="Greeter Example" description="Write a client and a server, step by step, in your language." href="greeter-example" /%}

{% card icon="book" title="Basics" description="Clients and servers, Slice, the Ice protocol, and the Ice services, in brief." href="basics" /%}

{% card icon="braces" title="The Slice Language" description="Define the interfaces, operations, and data types your clients and servers share." href="the-slice-language" /%}

{% card icon="cpu" title="The Ice Runtime" description="Communicators, proxies, object adapters, connections, and dispatch." href="the-ice-runtime" /%}

{% card icon="boxes" title="Ice Services" description="IceGrid, IceStorm, Glacier2, IceBox, IceBridge, and DataStorm." href="ice-services" /%}

{% card icon="sliders" title="Property Reference" description="Every property the Ice runtime and its services understand." href="property-reference" /%}

{% /grid %}

## Releases

{% releases /%}

- **[Upgrade Guide](../upgrade-guide)**: moving an application from Ice 3.7 to Ice {% $version %}.
- **[Backward Compatibility of Ice Versions](../backward-compatibility-of-ice-versions)**: what a patch, minor, or major
  release keeps compatible.

## Beyond the manual

- **API reference** for [C++](https://code.zeroc.com/ice/3.8/api/cpp/index.html),
  [C#](https://code.zeroc.com/ice/3.8/api/csharp/index.html),
  [Java](https://code.zeroc.com/ice/3.8/api/java/index.html),
  [JavaScript](https://code.zeroc.com/ice/3.8/api/javascript/index.html),
  [PHP](https://code.zeroc.com/ice/3.8/api/php/index.html),
  [Python](https://code.zeroc.com/ice/3.8/api/python/index.html),
  [Ruby](https://code.zeroc.com/ice/3.8/api/ruby/index.html), and
  [Swift](https://code.zeroc.com/ice/3.8/api/swift/index.html), plus the
  [Slice definitions](https://code.zeroc.com/ice/3.8/api/slice/index.html) that ship with Ice.
- **[Demos on GitHub](https://github.com/zeroc-ice/ice-demos/tree/3.8)**: sample programs for every language mapping.
- **[Ice on GitHub](https://github.com/zeroc-ice/ice)**: source code, issue tracker, and the
  [changelog](https://github.com/zeroc-ice/ice/blob/3.8/CHANGELOG-3.8.md) of each release.
- **[IceRPC](https://docs.icerpc.dev/)**: ZeroC's new RPC framework. See
  [Using Ice and IceRPC Together](../using-ice-and-icerpc-together).
