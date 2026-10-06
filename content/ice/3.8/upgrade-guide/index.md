---
title: Upgrade Guide
---

Learn how to upgrade your application from Ice 3.7 to Ice 3.8.

This page guides you through the upgrade process for an application that uses Ice 3.7. We recommend reading the
[release notes](../release-notes) for a general list changes and improvements.

Ice 3.8 does not maintain binary compatibility or source compatibility with Ice 3.7. When upgrading, you need to
recompile your Slice files and in some cases update your source code to use the latest APIs.

## Requirements

[Supported Platforms for Ice 3.8.3](../release-notes/supported-platforms-for-ice-3-8-3) lists the operating systems,
compilers and language versions that Ice 3.8.3 supports.

## Packaging

Many Slice compilers such as `slice2cs`, `slice2swift`, etc. are no longer available as part of the general installation
of the Linux, macOS, and Windows packages. To use these compilers, install the appropriate language-specific package.

{% language-section name="packaging" /%}

## Slice

### Local Slice

Support for local Slice has been removed. Previously defined local Slice types will need to be defined directly in your
programming.

### Operations on Classes

Support for operations on classes was removed. This feature was previously deprecated.

```diff
class Foo
{
-  void bar();
}
```

A class can no longer implement an interface, and `implements` is no longer a Slice keyword. The Slice compilers also
reject a proxy to a class (`Foo*`). Move the operations of such a class to an interface, and replace each proxy to the
class with a proxy to that interface.

### Optional Classes

Optional fields or parameters can no longer be a `class` or contain (including nesting) a `class`.

```diff
class Person
{
    string name;
    int number;
}

interface ContactList
{
-    void addContact(Person person, optional(1) Person alias) // error!
}
```

```diff
class Node
{
    string id;
-   optional(1) Node next; // error!
}
```

Several upgrade options are available depending on the application needs and constraints.

{% callout type="warning" %}

The following suggestions will break on-the-wire compatibility. Please ensure all clients and servers are using the same
Slice definitions.

{% /callout %}

1. Replace optional fields or parameters by non-optional ones.

   ```diff
   class Node
   {
       string id;
   -   optional(1) Node next;
   +   Node next;
   }
   ```

   ```diff
   interface ContactList
   {
   -    void addContact(Person person, optional(1) Person alias)
   +    void addContact(Person person, Person alias)
   }
   ```

2. Replace simple classes by structs. This will not be possible for classes which use inheritance or where their usage
   requires reference semantics.

   ```diff
   - class Point
   + struct Point
   {
       int x;
       int y;
   }
   ```

### Interface by Value

Support for passing an interface by value was removed. This feature was previously deprecated.

```diff
interface Foo
{
-   void passFooByValue(Foo foo); // error!
    void passFooProxy(Foo* foo);
}
```

### Identifier Collisions

A Slice identifier can collide with a keyword or a reserved identifier of a programming language. The Ice 3.7 Slice
compilers escaped such an identifier in the generated code. The Ice 3.8 Slice compilers no longer do: they use the Slice
identifier as is, and you avoid the collision with the `<lang>:identifier`
[metadata](../slice/slice-metadata-directives), which gives a Slice definition another name in the code generated for
one language.

For example, `template` is a keyword in C++:

```diff
interface Document
{
-   string template();
+   ["cpp:identifier:getTemplate"] string template();
}
```

The generated C++ function is then named `getTemplate`.

## Connection Management

### Active Connection Management

The connection management system used in Ice 3.7, _Active Connection Management (ACM)_, has been removed. In its place
is a new [Idle Timeout mechanism](../runtime/connection-management/connection-closure) which should usually require
_zero_ configuration.

The `Ice.ACM.*` properties have subsequently been removed.

```diff
-Ice.ACM.Heartbeat=0
-Ice.ACM.Timeout=1
-Ice.ACM.Close=2
```

Ice 3.7 applications that wish to interoperate with Ice 3.8 are recommended to set the following properties.

```diff
+Ice.ACM.Heartbeat=3
+Ice.ACM.Timeout=60 # or leave unset since 60 is the default
```

If you cannot change the configuration of the Ice 3.7 application, disable the idle check in the Ice 3.8 application by
setting [EnableIdleCheck](../property-reference/ice-connection-properties) to `0` for the connections to this Ice 3.7
application.

### Connection Timeouts

The Idle Timeout also replaces the connection timeouts of Ice 3.7: the `-t timeout` option in proxy and object adapter
endpoints, the `ice_timeout` proxy method, and the `Ice.Default.Timeout` and `Ice.Override.Timeout` properties. Ice 3.8
still accepts `-t timeout` in endpoints for backwards compatibility, but this option no longer has any effect. Remove
the calls to `ice_timeout` and the two properties.

Ice 3.8 adds three connection timeouts, for [inactivity](../runtime/connection-management/connection-closure),
[connection establishment](../runtime/connection-management/connection-establishment) and
[graceful closure](../runtime/connection-management/connection-closure). You configure them with the
[Ice.Connection properties](../property-reference/ice-connection-properties); in most cases, the defaults are fine.

### Heartbeat Callback

The `setHeartbeatCallback` operation has been removed from the `Connection` class.

### Dispatch Flow Control

By default, Ice 3.8 stops reading from a connection once 100 dispatches of requests received on this connection are in
progress, and resumes reading when a dispatch completes. If your application relies on dispatching more requests from
one connection concurrently, increase [MaxDispatches](../property-reference/ice-connection-properties). Ice for
JavaScript does not implement this limit.

### Default Object Adapter

A default Object Adapter can now be associated with a Communicator. This greatly simplifies the creation of
bidirectional connections. See [Bidirectional Connections](../runtime/connection-management/bidirectional-connections)
for more information.

## Published Endpoints

The computation of an Object Adapter’s published endpoints has been updated.

With the exception of some filtering for loopback addresses, the previous algorithm would produce endpoints containing
the IP addresses for all network interfaces; some of which may be internal and unreachable. The new algorithm is simpler
and uses the Fully Qualified Domain Name (FQDN) of the system. See
[Object Adapter Endpoints](../runtime/dispatch/object-adapter-endpoints) for more information.

A new property `_adapter_.PublishedHost` has been added. It is used to compute the default published endpoints.

{% callout type="note" %}

Users who are setting `_adapter_.PublishedEndpoints` to limit the published endpoints are encouraged to try the new
default.

{% /callout %}

Additionally, the `refreshPublishedEndpoints` method has been removed from `ObjectAdapter`.

## Secure Proxy Options, Properties, and Methods

Removed the `secure` proxy option, the `PreferSecure` proxy property, and all associated properties
(`Ice.Default.PreferSecure`, `Ice.Override.Secure`) and proxy methods (`ice_secure`, `ice_preferSecure`, etc.).

Proxies should not contain a mix of secure and non-secure endpoints.

```diff
-ssl -h prod.host.name -p 4062:tcp -h prod.host.name -p 10000
+ssl -h prod.host.name -p 4062
```

## Proxy Creation

Proxy creation has been simplified, allowing you to create a proxy from a communicator and endpoint string.

{% language-section name="proxy-creation-1" /%}

{% language-section name="proxy-creation-2" /%}

## Property Validation

Ice now validates properties with that start with an Ice property prefix (`Ice.`, `IceSSL.`, etc.). Setting an unknown
Ice property or a property configured for the wrong Ice service will now fail.

Please refer to the [property reference](../property-reference) for a complete list of Ice properties.

The following `IceSSL` properties of Ice 3.7 no longer exist in Ice 3.8, so setting one of them now fails:
`IceSSL.CertAuthDir`, `IceSSL.CertAuthFile`, `IceSSL.CertVerifier`, `IceSSL.Ciphers`, `IceSSL.DH.<bits>`,
`IceSSL.DHParams`, `IceSSL.EntropyDaemon`, `IceSSL.FindCert.<location>.<name>`, `IceSSL.InitOpenSSL`,
`IceSSL.PasswordCallback`, `IceSSL.PasswordRetryMax`, `IceSSL.Protocols`, `IceSSL.ProtocolVersionMax`,
`IceSSL.ProtocolVersionMin`, `IceSSL.Random`, `IceSSL.SchannelStrongCrypto`, `IceSSL.SecurityLevel` and
`IceSSL.VerifyDepthMax`.

## Communicator Initialization

- The `Application` helper class has been removed from the language mappings that provided it. Create and destroy the
  communicator in your own code, as described in
  [Communicator Initialization and Destruction](../runtime/communicator/initialization-and-destruction), and shut it
  down when your application receives Ctrl+C or a termination signal.
- The `dispatcher` field of `InitializationData` is now named `executor`.

## Value Factories

`ValueFactory` and `ValueFactoryManager` have been removed. In Ice 3.7, an application registered a value factory mainly
to supply the implementation of a class with operations. Classes no longer have operations, so in most cases you remove
your value factories and replace them with nothing. If you still need to create instances of your own classes during
unmarshaling, implement a [Slice loader](../slice/user-defined-types/classes/slice-loaders) and set the `sliceLoader`
field of `InitializationData`.

In Java, the `Ice.Default.Package` and `Ice.Package.module` properties still work, but they are deprecated: we recommend
registering a Slice loader in `InitializationData` instead. In Java and MATLAB, a class with a compact ID requires a
Slice loader.

## SSL Transport

The SSL transport is now part of the Ice library and is no longer a plug-in.

- Remove the `Ice.Plugin.IceSSL` property from your configuration: Ice 3.8 provides no IceSSL plug-in to load.
- The `IceSSL` certificate API, the certificate verifiers and the password callbacks have been removed. You can still
  configure the SSL transport with the [IceSSL properties](../property-reference/icessl-properties) in all language
  mappings except JavaScript, which supports only the secure WebSocket transport (WSS). In C++, C# and Java, we
  recommend the new [programmatic configuration](../runtime/ssl-transport), which uses the API of the SSL engine of your
  platform and gives you more control than the properties.

## Plug-ins

The recommended way to install a plug-in has changed in C++, C# and Java: register a plug-in factory in the
`pluginFactories` field of `InitializationData`, and Ice creates the plug-in when it initializes the communicator. For
example, in C++:

```cpp
Ice::InitializationData initData;
initData.pluginFactories = {IceDiscovery::discoveryPluginFactory()};
```

Your application then uses the plug-in's library like any other library it depends on, and you no longer need an
`Ice.Plugin.name` property to load the plug-in.

In the language mappings based on Ice for C++ (MATLAB, PHP, Python, Ruby and Swift), you install a plug-in with an
`Ice.Plugin.name` property, as in Ice 3.7. These mappings now include the IceDiscovery and IceLocatorDiscovery plug-ins.
You enable them with the properties `Ice.Plugin.IceDiscovery` and `Ice.Plugin.IceLocatorDiscovery`, and you can no
longer choose another name for these plug-ins. For example:

```config
Ice.Plugin.IceDiscovery=1
```

See [IceDiscovery](../plugins/icediscovery) and [IceLocatorDiscovery](../plugins/icelocatordiscovery).

## Services

### DataStorm

The DataStorm publisher/subscriber framework has been integrated into the Ice distribution, and is no longer a separate
product.

### Glacier2

The Slice definitions of Glacier2 are unchanged in Ice 3.8. As a result, you can use a 3.8 router with a 3.7 client, and
vice-versa.

The buffered mode of the router has been removed. Glacier2 now has a single mode, the unbuffered mode of Ice 3.7, in
which the router forwards each request without queuing it. Two features that depended on the buffered mode have been
removed with it: request overrides (the `_ovrd` request context), and the batching of requests by the router
(`Glacier2.Client.AlwaysBatch` and `Glacier2.Server.AlwaysBatch`).

A session now lasts as long as the connection that created it: the router destroys the session when this connection
closes, and relies on the [idle check](../runtime/connection-management/connection-closure) to detect a dead client. The
session timeout, `Glacier2.SessionTimeout`, has been removed.

The Glacier2 helper classes (`Glacier2.Application`, `SessionFactoryHelper` and `SessionHelper`) have been removed.
Create and destroy the session with the `Glacier2::Router` proxy, as described in
[Getting Started with Glacier2](../services/glacier2/getting-started-with-glacier2).

### IceGrid

The Slice definitions of IceGrid in Ice 3.8 are _not_ compatible with the Ice 3.7 definitions. As a result, you cannot
mix a 3.8 registry with a 3.7 node, or vice-versa. You also need to use the 3.8 version of the admin tools
(`icegridadmin` and `IceGridGUI`) to manage a 3.8 deployment.

You can nevertheless:

- start/manage Ice 3.7 servers from IceGrid 3.8
- start/manage Ice 3.8 servers from IceGrid 3.7

The IceGrid registry database schema is the same in Ice 3.8 and Ice 3.7. This allows you to start a 3.8 registry with a
LMDB database created by a 3.7 registry.

The distribution of server files through IcePatch2 has been removed, and with it the `distrib` descriptor; the `dbenv`
descriptor has been removed too. An IceGrid 3.8 registry ignores these descriptors in the applications it loads from a
3.7 database, but it no longer accepts the `distrib` and `dbenv` elements in XML: remove them from your descriptor
files, remove the `application patch` and `server patch` commands from your `icegridadmin` scripts, and distribute the
files of your servers with another [tool](../services/icegrid/application-distribution).

A client or administrative session now lasts as long as the connection that created it. The session timeout,
`IceGrid.Registry.SessionTimeout`, has been removed.

The `icegridadmin` command `server state` has been renamed
[`server status`](../services/icegrid/icegridadmin-command-line-tool): update the scripts that call it.

### IcePatch2

The IcePatch2 service has been removed.

### IceStorm

The IceStorm configuration now uses the `IceStorm` prefix instead of the IceBox service name as prefix.

```diff
-DemoIceStorm.LMDB.Path=db
-DemoIceStorm.TopicManager.Endpoints=tcp -p 9999
-DemoIceStorm.Publish.Endpoints=tcp -p 10000
+IceStorm.LMDB.Path=db
+IceStorm.TopicManager.Endpoints=tcp -p 9999
+IceStorm.Publish.Endpoints=tcp -p 10000
```

Update the version in the IceStorm entry point of your IceBox configuration:

```diff
-IceBox.Service.IceStorm=IceStormService,37:createIceStorm
+IceBox.Service.IceStorm=IceStormService,38:createIceStorm
```

The Slice definitions of IceStorm are unchanged in Ice 3.8. This allows you to use a mix of 3.7 and 3.8 for your
IceStorm service, publishers and subscribers. You can even use a mix of 3.7 and 3.8 IceStorm replicas in a replicated
deployment.

Moreover, the IceStorm database schema is the same in Ice 3.8 and Ice 3.7. This allows you to start an IceStorm 3.8
service with a LMDB database created by IceStorm 3.7.

## Miscellaneous

- The Objective-C mapping has been removed. You should upgrade to the Swift mapping.
- The Java Compat mapping has been removed. You should upgrade to the Java mapping.
