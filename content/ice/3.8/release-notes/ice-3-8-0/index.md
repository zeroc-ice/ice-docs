---
title: Ice 3.8.0
date: "2025-12-17"
---

## Themes

We focused on three main areas of improvements for this release.

- Making Ice more modern We adopted more recent versions of C++, C#, Java, Python, Swift, etc., and just as importantly,
  took advantage of the latest features offered by these languages. For instance, proxies are now mapped to
  `std:optional<T>` in C++, the C# mapping is now fully “nullable enabled”, the Python and Swift mapping provide native
  async/await support, the Python API provides type hints. And that’s only a few highlights.
- Making Ice simpler to use Another focus was to make the API easier to use, and make sure the default behaviors didn’t
  come with pitfalls. So we changed the default for Published Endpoints (a seemly obscure topic but a common pain
  point), replaced Active Connection Management (ACM) by a much simpler idle-check mechanism, made it easier to create
  proxies, simplified the setup of bidir connections, and more.
- Making Ice more accessible Providing lots of features is of limited value if you can’t find them or it’s very hard to
  figure out how to use them. So we rewrote all the [demos](https://github.com/zeroc-ice/ice-demos), to make sure they
  are short, focused, easy to copy, and follow best practices. We also updated the Ice documentation and API references
  to make them clearer and easier to navigate.

While more modern APIs and simpler patterns sound all right, the flip side of these changes is upgrade work. We were
very conscious of this trade-off and carefully weighted every changes - and when in doubt, kept the most compatible API.

Ice 3.8 keeps the same concepts and largely the same API as Ice 3.7 and earlier releases. Upgrading your Ice application
to Ice 3.8 will require some effort but is far from a rewrite. If you’re craving for a brand new state-of-the-art API
and don’t mind rewriting all your communications code, look at our cutting-edge RPC framework,
[IceRPC](https://zeroc.com/icerpc).

## Changelog and Upgrade Guide

There is significant overlap between the information in these release notes,
[CHANGELOG-3.8](https://github.com/zeroc-ice/ice/blob/3.8/CHANGELOG-3.8.md), and the [Upgrade Guide](../upgrade-guide) -
this is by design.

The changelog is more comprehensive, but also more terse.

These release notes present only the most important changes, and provide additional context for these changes.

Finally, the Upgrade Guide focuses on what you should know and do when upgrading an application that uses an older
version of Ice.

## General Changes

### Replaced ACM and Connection Timeouts

The powerful but complex Active Connection Management (ACM) mechanism provided in Ice 3.6 and Ice 3.7 was replaced by
the much simpler [Idle Timeout mechanism](../connection-closure) first introduced in IceRPC. In most cases, you don’t
need to do anything: remove your ACM config (if any) and just rely on the new default behavior.

{% callout type="warning" %}

Interop with previous versions You need to adjust the ACM properties of your older Ice applications, generally by
setting `Ice.ACM.Heartbeat` to `3`. Refer to [The Idle Check](../connection-closure) for details.

{% /callout %}

The new Idle Timeout also replaces connection timeouts (the `-t <timeout>` in your proxy and object adapter endpoints).
These connection timeouts are still accepted in endpoints for backwards compatibility but no longer have any effect.

We also added 3 new connection-related timeouts, for [inactivity](../connection-closure),
[connection establishment](../connection-establishment), and [graceful closure](../connection-closure).

### New Properties for Flow Control

As of Ice 3.8, we do not recommend using thread pool limits (starvation) for flow control. It’s acceptable for a thread
pool to be out of threads for a short period of time, but generally, you always want to have at least one thread
available in each of your Ice [thread pools](../thread-pools).

Ice provides new [Ice.Connection.name.MaxDispatches](../ice-connection-properties) properties that allows the “dispatch
side” of a connection to apply back pressure on the peer. For complete flow-control, you want to combine `MaxDispatches`
with the new [adapter.MaxConnections](../object-adapter-properties) property that allows an object adapter to limit the
number of concurrent connections it accepts.

### Reworked the Published Endpoints of Object Adapters

The published endpoints of an object adapter are the endpoint(s) included in the proxies returned by the `add` and
`createProxy` operations on an object adapter. For indirect object adapters, the published endpoints are the endpoints
registered with the Ice Locator (typically the IceGrid registry).

In Ice 3.7 and before, the algorithm for computing the default published endpoints often resulted in “publishing”
unreachable endpoints, especially when you configured your object adapter to listen on all interfaces (e.g. `tcp` or the
equivalent `tcp -h *`). The work-around was to specify a specific address in your object adapter endpoints (e.g.
`tcp -h 1.2.3.4`, or `tcp -h myhost.domain`) which is problematic since you typically don’t want to tie your
configuration to a specific host.

In Ice 3.8, the [default published endpoints](../object-adapter-endpoints) are much simpler, and rely on the server’s
hostname. Additionally, you can override this hostname with the property
[adapter.PublishedHost](../object-adapter-properties). As of Ice 3.8, our general recommendation for your object adapter
endpoints is to keep it very simple:

- configure a single endpoint (not several endpoints despite the property name)
- don’t use a DNS name for this endpoint
- listen on all interfaces (with no `-h` in your endpoint), or listen on loopback (with `-h 127.0.0.1`)

### Simplify Proxy Creation

You can now create a typed proxy directly from a communicator and a string in all languages. For example:

```cpp
GreeterPrx greeter{communicator, "greeter:tcp -h localhost -p 4061"};
```

```csharp
var greeter = GreeterPrxHelper.createProxy(
  communicator,
  "greeter:tcp -h localhost -p 4061");
```

```java
var greeter = GreeterPrx.createProxy(
  communicator,
  "greeter:tcp -h localhost -p 4061");
```

```js
const greeter = new GreeterPrx(
  communicator,
  "greeter:tcp -h localhost -p 4061");
```

```matlab
greeter = GreeterPrx(communicator, 'greeter:tcp -h localhost -p 4061');
```

```php
$greeter = GreeterPrxHelper::createProxy(
  $communicator,
  'greeter:tcp -h localhost -p 4061');
```

```py
greeter = GreeterPrx(communicator, "greeter:tcp -h localhost -p 4061")
```

```ruby
greeter = GreeterPrx.new(communicator, "greeter:tcp -h localhost -p 4061")
```

```swift
let greeter = try makeProxy(
  communicator: communicator,
  proxyString: "greeter:tcp -h localhost -p 4061",
  type: GreeterPrx.self)
```

```ts
const greeter = new GreeterPrx(
  communicator,
  "greeter:tcp -h localhost -p 4061");
```

The existing `stringToProxy` operation on `Communicator` remains available. However, the new syntax is now the preferred
way to create a proxy from a string.

### checkedCast and uncheckedCast

The `checkedCast` and `uncheckedCast` APIs have not changed in this release. However, we’ve changed our recommendation
for using these APIs.

Calling `checkedCast` should be extremely rare, in particular you don’t need to call `checkedCast` on your root proxy
(just construct it directly, see above). There is only one demo that still calls `checkedCast`: the client in the
`Ice/inheritance` [demo](https://github.com/zeroc-ice/ice-demos).

Calling `uncheckedCast` should be rare in C++, but more common in C#, Java, and other languages. `uncheckedCast`,
despite its name, is not a cast: it’s a factory method that creates a new proxy from an existing proxy. We kept the name
unchanged for backwards compatibility.

### IceSSL Refactoring

The SSL transport is no longer provided by a plug-in: it is now built into the main Ice library and always available.

Ice 3.8 introduces new IceSSL configuration APIs that allow you to configure the SSL transport using platform-native SSL
engine APIs. This provides significantly greater flexibility for advanced use cases:

- The SSL transport can now be fully configured programmatically, without relying on IceSSL properties.
- Separate configurations for outgoing and incoming SSL connections are supported.
- Per object adapter configuration is also possible.

These APIs are platform-dependent. A good starting point is the `Ice/secure`
[demo](https://github.com/zeroc-ice/ice-demos) for your target platform and programming language.

### Replaced ValueFactory by SliceLoader

When Ice unmarshals a Slice-defined class or exception, it first needs to locate and create an instance of the mapped
C++/C#/Java (...) class, using the default parameter-less constructor of the mapped class. The new abstraction for this
process is the [Slice loader](../slice-loaders), configured using the `sliceLoader` field on
[InitializationData](https://code.zeroc.com/manual/Ice/InitializationData). This abstraction replaces the `ValueFactory`
and `ValueFactoryManager` APIs provided by Ice 3.7 and earlier releases.

In most languages, generated classes for Slice classes and exceptions register themselves at startup with a default
Slice loader implemented by Ice, and you don't need to do anything to help Ice locate these generated classes. However,
in Java and MATLAB, there is no such registration at startup, and you need to help Ice locate these generated classes
when:

- you remap either the class name or an enclosing module using the `java:identifier`, `java:package`, or
  `matlab:identifier` metadata; or
- you assign a compact ID to your class

You help Ice locate these classes by installing a Slice loader in `InitializationData`, just like when you provide a
custom Slice loader. Ice for Java and Ice for MATLAB provide implementations of `SliceLoader` for this purpose. For
example, you can use the `ClassSliceLoader` implementation to create a Slice loader for one or more generated classes
(typically classes with remapped names).

In Java, we recommend registering a Slice loader programmatically (in `InitializationData`) over setting the now
deprecated `Ice.Default.Package` and `Ice.Package.module` properties.

### Add Support for Dispatcher and Middleware

The new Dispatcher API in C++, C#, Java, JavaScript, and Swift abstracts the dispatch process and allows you to write
middleware. See the `Ice/middleware` [demo](https://github.com/zeroc-ice/ice-demos) for an example.

### New Logger Middleware

We added a new always-enabled logger middleware in all languages with dispatch support. This middleware logs dispatches
using the configured logger based on the value of `Ice.Trace.Dispatch` and `Ice.Warn.Dispatch`.

### Simplify Bidir Setup

We added a new `setDefaultObjectAdapter` operation on [Communicator](https://code.zeroc.com/manual/Ice/Communicator) to
simplify the creation of bidir connections. See the `Ice/bidir` [demo](https://github.com/zeroc-ice/ice-demos) for an
example.

### Removed secure and PreferSecure

A long time ago, many web servers listened on both `http` and `https` and allowed their clients to choose which protocol
to use: `http` for speed (or compatibility) or `https` for security. Today, the vast majority of web servers listen only
on `https`. You can still deploy an internal web server that listens on `http` - not for speed, but for ease of
configuration of the web server. A modern web server doesn’t listen on both `http` and `https`: there is no reason to
give clients this choice.

The same logic applies to Ice applications: a long time ago, you may have configured your Ice object adapter to listen
on both `tcp` and `ssl`. An Ice client could then choose `tcp` for speed, or for compatibility (in case this client
didn’t support `ssl`). And a more security-conscious Ice client would insist on using `ssl`, or prefer `ssl` and
fallback to `tcp`.

Today, you should not create an Ice proxy with both `tcp` and `ssl` endpoints, and there is no reason for Ice to provide
options, properties, and APIs to fine-tune the handling of such proxies. So we removed the `secure` proxy option, the
`PreferSecure` proxy property, and all associated properties and proxy methods.

### More Marshalable Local Exceptions

In Ice 3.7 and prior releases, the local exceptions that could be marshaled were limited to 6 exceptions: 3 not exist
exceptions (`ObjectNotExistException`, `FacetNotExistException`, `OperationNotExistException`) and 3 unknown exceptions
(`UnknownLocalException`, `UnknownUserException` and `UnknownException`).

{% callout type="info" %}

A local exception is just an exception class derived from
[LocalException](https://code.zeroc.com/manual/Ice/LocalException).

{% /callout %}

Ice 3.8 lifts this limitation and allows you to define additional marshalable local exceptions - up to a total of 253.
You can now define and return new generic errors such as `PermissionDenied` or `InvalidToken`. See the `Ice/customError`
[demo](https://github.com/zeroc-ice/ice-demos) for an example.

### ice2slice

We added a new `ice2slice` compiler that converts Slice files in the `.ice` format (used by Ice) into Slice files in the
`.slice` format (used by IceRPC).

## Packaging Changes

### Slice Compilers

The Slice compilers are no longer packaged all together in their own package. Each Slice compiler is now usually
included in its associated language package.

For example, the Slice to C# compiler binaries (`slice2cs`) for all platforms are included in the NuGet package
`ZeroC.Ice.Slice.Tools`. Likewise, the Slice to Java compiler (`slice2java`) for all platforms are included in the
`com.zeroc.ice.slice-tools` JAR file.

On Linux, the Slice to C++ compiler is included in the Ice-C++ dev or devel package depending on the distribution. And
the Slice to PHP compiler (`slice2php`) is included directly in the Ice-PHP package.

## Slice Language Changes

### Removed Local Slice

In Ice 3.7 and prior releases, a large portion of the Ice API was defined using local Slice. This includes all the main
Ice classes: `Communicator`, `ObjectAdapter`, `Connection`, etc.

Local Slice ensured consistency across programming languages, but also made many things harder. For instance, we
regularly added new Slice metadata directives just to get the desired APIs in `Communicator` and friends.

All the interfaces and other APIs that used to be defined in local Slice are now defined directly in C++, C#, Java, etc.

### Optional and Class Are Now Incompatible

In Ice 3.7 and prior releases, you could define an optional parameter or an optional field and give this field/parameter
a class type, or a type that contained a class. While this was a valid syntax, the marshaling/unmarshaling support was
not correct - it did not work reliably. We tried and tried to design a fix but unfortunately could not find one.

We “fixed” this bug by disallowing the syntax: as of Ice 3.8, the type of an optional field or parameter can no longer
be a class or contain a class.

### Removed Operations on Classes

A class can no longer define an operation, or implement an interface.

### New `<lang>:identifier:<identifier>` Metadata Directive

We added a new metadata directive for customizing the mapped names of Slice definitions in each language. This metadata
is of the form: `["<lang>:identifier:<identifier>"]`, where `<lang>` can be any of the standard language prefixes, and
that definition's identifier will be `<identifier>` in the specified language.

For example:

```slice
["cs:identifier:MyNamespace"]
["java:identifier:com.example.mypackage"]
module MyModule {}
```

The argument is used as a drop-in replacement for the Slice identifier, with no additional processing. For the above
example, `slice2cs` will generate `namespace MyNamespace {}` and `slice2java` will generate
`package com.example.mypackage;`

We also deprecated the `cs:namespace`, `java:package`, and `swift:module` metadata directives: you should use
`<lang>:identifier<identifier>` whenever you want to remap an identifier.

### Identifiers with Underscores and Ice Prefix

You can now use identifiers with underscores or with the Ice prefix without any special metadata directive or compiler
option.

### New Shorthand Syntax for Nested Modules

The following two definitions are equivalent:

```slice
module Foo { module Bar { module Baz { /*...*/ } } }

module Foo::Bar::Baz { /*...*/ }
```

### Doc-Comment Improvements

We added support for triple-slash doc comments, in addition to the already supported JavaDoc comment syntax. For
example, the following two definitions are equivalent:

```slice
/// Sends a request.
/// @param message the message.
/// @return a response code.
int sendRequest(string message);

/**
 * Sends a request.
 * @param message the message.
 * @return a response code.
 */
int sendRequest(string message);
```

We also added support for 2 new doc-comment tags: `@remark` and `@p`.

## C++ Changes

### Single C++17 Mapping

Ice 3.8 provides a single C++ mapping, derived from the C++11 mapping provided in Ice 3.7. This mapping requires a C++17
compiler, and provides some limited support for C++20 features.

### Proxy API

In previous Ice releases, proxies were shared objects that you would manipulate using smart pointers. And a “null proxy”
was represented by a null smart pointer. This mapping changed drastically in Ice 3.8: a proxy is now a concrete
“value-like” class, with public constructors. And a nullable proxy – the kind of proxy you receive from a Slice
operation – is represented by a `std::optional<NamePrx>`.

Although this is a big change, the API remains largely the same. In particular, you can still use the same arrow (`->`)
syntax when making an invocation:

```cpp
cout << greeter->greet("bob") << endl;
```

The arrow syntax works with both a plain `GreeterPrx` and a `std::optional<GreeterPrx>`. It’s equivalent to the dot
syntax:

```cpp
// Same call with a different syntax.
cout << greeter.greet("bob") << endl;
```

All functions that create proxies, including `Communicator::stringToProxy`, `ObjectAdapter::add`,
`Connection::createProxy` and more, are now template functions that allow you to choose the type of the returned proxy.
The default proxy type is `Ice::ObjectPrx` for backwards compatibility. We recommend you always specify the desired
proxy type explicitly when calling these functions. For example:

```cpp
// widget is a std::optional<WidgetPrx>
auto widget = communicator->propertyToProxy<WidgetPrx>("MyWidget");
```

### Async Skeleton Class

You implement a Slice interface in C++ by writing a class that implements the skeleton class generated for that
interface - and now you have two C++ skeleton classes to choose from: the default skeleton class, named after the Slice
interface, and the async skeleton class, with the Async prefix.

The async skeleton class is an “all AMD” abstract base class. See
[Asynchronous Method Dispatch (AMD) in C++](../operations?lang=cpp#asynchronous-method-dispatch-amd) for more details.

### Printing Generated Classes

The C++ structs, classes, exception classes, and enumerations generated by the Slice compiler can now be printed using
`operator<<(ostream&, const T&)`. For structs, classes, and exceptions, this operator prints the type name and all the
field names and values.

You can also implement your own custom printing by applying the metadata directive `["cpp:custom-print"]` to your Slice
type.

## C# Changes

### Upgrade to .NET 8.0 / C# 12

The updated Slice to C# mapping takes advantage of recent C# features. For example, Slice structs are now mapped to
record structs or record classes:

- a Slice struct with only numeric, bool, enum, or record struct fields is mapped to a record struct.
- a Slice struct with any other field type is mapped to a sealed record class.

### Full Support for Nullable Types

Both the Ice C# API and the code generated by the Slice compiler are now `#nullable enable`. And Ice for C# now uses the
standard `?` notation for all nullable types.

### Improved Async Support

The thread pools created by Ice no longer set a synchronization context. As a result, the continuation from an async
invocation made from an Ice thread pool thread executes in a .NET thread pool thread; previously, this continuation was
executed in a thread managed by the same Ice thread pool unless you specified `.ConfigureAwait(false)`.

We also updated `Ice.Communicator` to implement `IAsyncDisposable`. The preferred way to create and dispose of a
communicator is now:

```csharp
await using Ice.Communicator communicator = Ice.Util.initialize(ref args);
```

And the preferred way to wait for communicator shutdown in an async context is:

```csharp
await communicator.shutdownCompleted;
```

### Async Skeleton Class {% id="csharp-async-skeleton-class" %}

You implement a Slice interface in C# by writing a class that implements the skeleton class generated for that
interface - and now you have two C# skeleton classes to choose from: the default skeleton class, named after the Slice
interface, and the async skeleton class, with the Async prefix.

The async skeleton class is an “all AMD” abstract base class. See
[Asynchronous Method Dispatch (AMD) in C#](../operations?lang=csharp#asynchronous-method-dispatch-amd) for more details.

## Java Changes

### Upgrade to Java 17

There is now a single Slice-to-Java mapping, based on Java 17.

### Async Skeleton Interface

You implement a Slice interface in Java by writing a class that implements the skeleton interface generated for that
interface - and now you have two Java skeleton interfaces to choose from: the default skeleton interface, named after
the Slice interface, and the async skeleton interface, with the Async prefix.

The async skeleton interface is an “all AMD” Java interface. See
[Asynchronous Method Dispatch (AMD) in Java](../operations?lang=java#asynchronous-method-dispatch-amd) for more details.

## JavaScript Changes

### Scoped Package

The Ice for JavaScript NPM package has been converted to a scoped package named `@zeroc/ice`.

The package includes a `slice2js` bin script that executes the native `slice2js` compiler for the current platform, the
`slice2js` native binaries for Linux, macOS, and Windows are included in the `@zeroc/ice` NPM package.

The NPM package is now compatible with Node.js and Browsers, and there is no need to use a separate bundle when
developing applications targeting a web browser.

### ES6 Modules

Slice modules are now always mapped to JavaScript ES6 modules. The `js:es6-module` metadata has been removed, as a
single module mapping is now used by default.

### Improved Async Support {% id="javascript-improved-async-support" %}

We added support for `Symbol.asyncDispose` on `Ice.Communicator`. TypeScript applications can now use the communicator
in `await using` expressions:

```ts
await using communicator = Ice.initialize(process.argv);
```

### Mapping for Slice long

`long` is now mapped to JavaScript `BigInt`. For input parameters, both `number` and `BigInt` are accepted. The
`Ice.Long` class has been removed.

### WebSocket with Node.js

We added support for the WebSocket transport (`ws`) with Node.js. In previous Ice releases, you could only use the `tcp`
transport with Node.js. This support requires Node.js 24 or higher.

## MATLAB Changes

### Upgrade to MATLAB 2025a

We upgraded the base version of MATLAB to take advantage of new MATLAB features such as dictionaries.

### Argument Validation

We added argument validation in generated proxy methods:

- All argument types are now validated, except for parameters that correspond to optional Slice parameters.
- A proxy or class argument to set to "null" must now be an empty array of the associated type, such as
  `GreeterPrx.empty`. `[]` is no longer a valid value for such arguments.

### Mapping for `sequence<string>`

A Slice `sequence<string>` is now mapped to a MATLAB string array. This new mapping remains highly compatible with the
previous mapping (cell array of char).

### Mapping for Dictionaries

A Slice dictionary now always maps to a MATLAB dictionary; the old `containers.Map` are no longer used. See
[Dictionaries](../dictionaries) for details.

### Mapping for Fields

All fields are now mapped to _typed_ MATLAB properties except optional fields and fields whose type is a class or uses a
class.

In such properties, a null proxy is represented by an empty array of the proxy type, for example `GreeterPrx.empty`.
Likewise, an empty sequence (array) is represented by an empty array of the correct type, such as `string.empty` or
`int32.empty`.

`[]` is no longer a valid value for proxy and sequence properties: you must always use a typed array.

## Objective-C Changes

The Objective-C mapping was removed.

## PHP Changes

We simplified Ice for PHP by removing:

- the flattened mapping
- PHP5 support
- Windows builds
- the `ice.hide_profiles` directive

## Python Changes

### Upgrade to Python 3.12

Ice for Python requires Python 3.12 or greater.

### Improved Async Support {% id="python-improved-async-support" %}

We greatly improved the async support in Ice for Python, especially in conjunction with `asyncio`.

We added async context manager support to `Ice.Communicator`. You can now initialize the communicator in an `async with`
expression such as:

```py
async def main():
    async with Ice.initialize(
        sys.argv,
        eventLoop=asyncio.get_running_loop()) as communicator:
        ...

if __name__ == "__main__":
    asyncio.run(main())
```

We also added a new `shutdownCompleted` method on `Communicator`. It allows you to wait for communicator shutdown
asynchronously:

```py
await communicator.shutdownCompleted()
```

A new `EventLoopAdapter` can now be configured during communicator construction. This adapter integrates Ice
asynchronous methods with the event loop of your choice. This `EventLoopAdapter` makes the Ice API and the API generated
by the Slice compiler much more convenient to use with the associated event loop:

- Asynchronous proxy invocations return an _awaitable_ that can be awaited directly in the event loop. There is no
  longer a need to wrap the returned future to run in your event loop.
- The same applies to other asynchronous methods in the Ice API: the returned awaitable always uses the event loop
  adapter to ensure it can be correctly awaited in the selected event loop.
- Asynchronous dispatch methods can be implemented as async methods that run in that event loop.

Ice includes a built-in adapter for Python’s asyncio, and the same mechanism can be extended to support other event loop
systems.

### Type Hints

We added full type hint support to the Ice for Python API and to the code generated by the Slice-to-Python compiler.

### Not Set Value

Ice is now using `None` to represent a optional field or parameter that is not set. In previous releases, Ice was using
a global variable, `Ice.Unset`. This global variable was removed.

### Enum Base Class

The base class for enum classes generated by the Slice compiler is now Python’s `enum.Enum`.

### pip Packages

We added support for building pip packages directly from an Ice source distribution. In previous releases, the pip
package was built from a separate tarball that included pre-generated source code.

### Code Generation

The Python code generated by slice2py now follows a more conventional layout: each Slice definition is generated into a
Python module with the same name as the Slice definition.

For example:

```slice
module VisitorCenter
{
    /// Represents a simple greeter.
    interface Greeter
    {
        /// Creates a personalized greeting.
        /// @param name The name of the person to greet.
        /// @return The greeting.
        string greet(string name);
    }
}
```

This Slice definition produces a Python module `Greeter` within the `VisitorCenter` package. The Greeter module contains
all generated code for the Slice Greeter interface:

- a proxy class GreeterPrx
- and a servant skeleton Greeter.

The generated package structure is:

```text
VisitorCenter/__init__.py
VisitorCenter/Greeter.py
VisitorCenter/Greeter_forward.py
```

The layout can be customized using the `python:identifier` metadata, which controls the mapping between Slice and Python
identifiers.

With the following updated Slice definition:

```slice
["python:identifier:visitor_center"]
module VisitorCenter
{
    /// Represents a simple greeter.
    interface Greeter
    {
        /// Creates a personalized greeting.
        /// @param name The name of the person to greet.
        /// @return The greeting.
        string greet(string name);
    }
}
```

The generated structure becomes:

```text
visitor_center/__init__.py
visitor_center/Greeter.py
visitor_center/Greeter_forward.py
```

{% callout type="info" %}

For Slice interfaces the Slice Compiler for Python generates an additional `_forward` module containing forward
declarations.

{% /callout %}

## Ruby Changes

There are no Ruby-specific updates in this release.

## Swift Changes

### Upgrade to Swift 6.1

Ice for Swift requires Swift 6.1.

We removed support for Carthage: Ice for Swift now uses the Swift Package Manager (SwiftPM) for dependency management.

### async/await and Structured Concurrency

We updated Ice for Swift to embrace the latest async APIs in Swift, with full support for the Structured Concurrency
model.

The proxy APIs is now fully async. You now use `try await` to make a remote invocation:

```swift
let greeting = try await greeter.greet(NSUserName())
```

On the server-side, the skeleton protocol provides async methods that be implemented either synchronously or
asynchronously. The `[amd]` metadata directive no longer has any effect in Swift.

With this change, we removed all previous promise-based APIs and the dependency on PromiseKit.

### Removed Dispatch Structs

We simplified the server-side mapping by removing the generated dispatch (Disp) structs. You can now implement the
generated server-side protocols and use these implementations directly as servants like in other languages.

### CompileSlice Plugin

We added a SwiftPM plugin, `CompileSlice`, that lets you compile Slice files as part of SwiftPM and Xcode builds.

## Ice Service Changes

### DataStorm

The DataStorm publisher/subscriber framework has been integrated into the Ice distribution, and is no longer a separate
product.

### Glacier2

We removed the buffered mode. As a result, Glacier2 has now a single mode, the previous "unbuffered" mode. The following
features were removed as a consequence:

- support for request overrides (the `_ovrd` request context).
- support for creating batches of requests (`Glacier2.Client.AlwaysBatch` and `Glacier2.Server.AlwayBatch`).

We also removed the Glacier2 helper classes, as they were not that helpful.

Finally, we removed the session timeouts configured using `Glacier2.SessionTimeout`. The Glacier2 router now relies on
the [Idle Timeout](../connection-closure) for these connection-bound sessions.

### IceGrid

We removed the deprecated server and application distributions in IceGrid. These distributions relied on the IcePatch2
service.

We also removed the client and admin-client session timeouts configured using `IceGrid.Registry.SessionTimeout`. IceGrid
now relies on the [Idle Timeout](../connection-closure) for these connection-bound sessions.

### IcePatch2

The IcePatch2 service was removed.

### IceStorm

The IceStorm configuration now uses the `IceStorm` prefix instead of the IceBox service name as prefix.

The IceStorm `TopicManager` has a new operation, `createOrRetrieve`, that allows you to create or retrieve a topic with
a single call. For example:

```cpp
std::optional<IceStorm::TopicPrx> topic = topicManager->createOrRetrieve("weather");
```
