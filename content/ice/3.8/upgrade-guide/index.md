---
title: Upgrade Guide
---

Learn how to upgrade your application from Ice 3.7 to Ice 3.8.

This page guides you through the upgrade process for an application that uses Ice 3.7. We recommend reading the
[release notes](../release-notes) for a general list changes and improvements.

Ice 3.8 does not maintain binary compatibility or source compatibility with Ice 3.7. When upgrading, you need to
recompile your Slice files and in some cases update your source code to use the latest APIs.

## Requirements

[Supported Platforms for Ice 3.8.3](../supported-platforms-for-ice-3-8-3) lists the operating systems, compilers and
language versions that Ice 3.8.3 supports.

## Packaging

Many Slice compilers such as `slice2cs`, `slice2swift`, etc. are no longer available as part of the general installation
of the Linux, macOs, and Windows packages. To use these compilers, install the appropriate language-specific package.

{% language-section name="lang-1" /%}

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

### Interface By Value

Support for passing an interface by value was removed. This feature was previously deprecated.

```diff
interface Foo
{
-   void passFooByValue(Foo foo); // error!
    void passFooProxy(Foo* foo);
}
```

### Identifiers and Keywords

The Slice compilers no longer escape a Slice identifier that is a keyword or a reserved identifier in the target
language: the generated code uses the Slice identifier as is. Give the definition a valid name for that language with
the `<lang>:identifier` [metadata](../slice-metadata-directives):

```diff
interface Parser
{
-   void def();
+   ["python:identifier:_def"] void def();
}
```

The Ice 3.7 `slice2py` compiler mapped this operation to `_def`, and this metadata keeps that name. The metadata changes
only the name in the generated code. The Slice type IDs and the encoding of the definition stay the same.

The `ice-prefix` and `underscore` metadata and the `--ice` and `--underscore` compiler options are removed: a Slice
identifier can start with `ice` and can contain single underscores.

### Dictionary Keys

A sequence is no longer a legal dictionary key type, and neither is a struct with a sequence field. Replace the key type
of such a dictionary with an integral type, a string, an enumeration, or a struct composed of these types. This change
breaks on-the-wire compatibility with applications that use the previous definition.

### Slice Preservation

The `preserve-slice` and `protected` metadata are removed; the Slice compilers ignore them with a warning. Ice 3.8
always preserves the unknown slices of a class instance that it unmarshals in the sliced format. Ice 3.8 always marshals
exceptions in the sliced format. When Ice unmarshals an exception, it discards the unknown slices of this exception: an
application that catches and rethrows a user exception forwards only the slices it knows. See
[Slicing Values and Exceptions](../slicing-values-and-exceptions).

### Slice Compiler Options and Tools

Update the build scripts that use one of the following:

- The `-E` option and the options that generate sample implementations (`--impl` and its variants) are removed from the
  Slice compilers.
- Slice checksums are removed, together with the `--checksum` compiler option and the APIs that returned checksums, such
  as the `getSliceChecksums` operations of IceBox, IceGrid and IceStorm.
- The `slice2html` compiler is removed. [Generate the documentation](../generating-documentation-with-doxygen) of your
  Slice definitions with Doxygen.

## Connection Management

### Active Connection Management

The connection management system used in Ice 3.7, _Active Connection Management (ACM)_, has been removed. In its place
is a new [Idle Timeout mechanism](../connection-closure) which should usually require _zero_ configuration.

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
setting [EnableIdleCheck](../ice-connection-properties) to `0` for the connections to this Ice 3.7 application.

The `setACM` and `getACM` operations have been removed from the `Connection` class. Configure the idle timeout and the
inactivity timeout with the [Ice.Connection properties](../ice-connection-properties), or for one object adapter with
its [Connection properties](../object-adapter-properties). `disableInactivityCheck` on `Connection` turns off the
inactivity check of a single connection.

### Closing a Connection

The `close` operation of `Connection` no longer accepts a `ConnectionClose` argument:

- `abort` replaces `close(ConnectionClose::Forcefully)`. It closes the connection immediately.
- `close` without argument replaces the two graceful modes. It closes the connection gracefully once the outstanding
  invocations have completed, and aborts the connection when the closure takes longer than the
  [close timeout](../ice-connection-properties). `close` is asynchronous in most language mappings.

See [Connection Closure](../connection-closure).

### Timeouts

Ice 3.8 replaces the timeout of an endpoint with connect, close, idle and inactivity timeouts that apply to all the
connections of a communicator or an object adapter. Their properties are expressed in seconds.

- Remove `Ice.Default.Timeout`, `Ice.Override.Timeout`, `Ice.Override.ConnectTimeout` and `Ice.Override.CloseTimeout`
  from your configuration, and set the [Ice.Connection properties](../ice-connection-properties) when the defaults do
  not suit your application.
- Remove the calls to the `ice_timeout` proxy method. To give an invocation a deadline, set an
  [invocation timeout](../invocation-timeouts), which is expressed in milliseconds.
- An Ice 3.7 invocation with the invocation timeout `-2` used the timeout of its connection. In Ice 3.8, an invocation
  timeout that is zero or negative is infinite: replace `-2` with the timeout the invocation needs.
- The `-t` option of an [endpoint](../endpoint-syntax) remains valid and has no effect on an Ice 3.8 connection. An Ice
  3.7 application that receives a proxy with this endpoint still uses this timeout.

### Heartbeat Callback

The `setHeartbeatCallback` operation has been removed from the `Connection` class.

### Dispatch Flow Control

By default, Ice 3.8 dispatches up to 100 requests from a connection concurrently. When a connection reaches this limit,
Ice stops reading from this connection, and resumes reading when a dispatch completes. If your application relies on
dispatching more requests from one connection concurrently, increase [MaxDispatches](../ice-connection-properties). Ice
for JavaScript does not implement this limit.

### Default Object Adapter

A default Object Adapter can now be associated with a Communicator. This greatly simplifies the creation of
bidirectional connections. See [Bidirectional Connections](../bidirectional-connections) for more information.

## Published Endpoints

The computation of an Object Adapter’s published endpoints has been updated.

With the exception of some filtering for loopback addresses, the previous algorithm would produce endpoints containing
the IP addresses for all network interfaces; some of which may be internal and unreachable. The new algorithm is simpler
and uses the Fully Qualified Domain Name (FQDN) of the system. See
[Object Adapter Endpoints](../object-adapter-endpoints) for more information.

A new property `_adapter_.PublishedHost` has been added. It is used to compute the default published endpoints.

{% callout type="info" %}

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

## Endpoint Options

Ice 3.8 rejects a stringified endpoint that repeats an option. For example, parsing `tcp -h host1 -h host2 -p 4061` now
fails with a `ParseException`.

## Proxy Creation

Proxy creation has been simplified, allowing you to create a proxy from a communicator and endpoint string.

{% language-section name="lang-2" /%}

{% language-section name="lang-3" /%}

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

- The `Application` helper classes of Ice and Glacier2 are removed. Create the communicator with `initialize`, destroy
  it when your application exits, and shut it down from the signal handling facility of your language mapping. See
  [Communicator Initialization and Destruction](../initialization-and-destruction).
- `initialize` has fewer overloads. If your application calls an overload that is no longer available, create an
  `InitializationData`, set its properties and other fields, and pass it to `initialize`.
- The `dispatcher` field of `InitializationData` is now named `executor`.
- The `stringToIdentity` operation is removed from `Communicator`. Call the `stringToIdentity` function described in
  [Object Identity](../object-identity).

## Dispatch Interceptors

Dispatch interceptors are removed. Reimplement a dispatch interceptor as a [middleware](../middleware), which you
install in an object adapter.

## Value Factories

`ValueFactory` and `ValueFactoryManager` are removed. To create instances of your own classes during unmarshaling,
implement a [Slice loader](../slice-loaders) that returns null for the type IDs it does not handle, and set the
`sliceLoader` field of `InitializationData`. Ice for PHP does not provide custom Slice loaders.

In Java and MATLAB, a generated class with a compact ID also requires a Slice loader, and so does a generated class
whose name or enclosing module is remapped with `java:identifier`, `java:package` or `matlab:identifier`.

## Class Graph Depth

The default value of [Ice.ClassGraphDepthMax](../ice-properties) is now `10`, lower than in Ice 3.7, where it was for
example `100` in C++. Set this property if your application receives graphs of class instances that are deeper.

## Local Exceptions

Ice 3.8 consolidates the local exceptions. Update the code that catches or throws one of the following exceptions:

| Ice 3.7 exception                                                                                                                                                                                                                                                | Ice 3.8 replacement                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `EndpointParseException`, `EndpointSelectionTypeParseException`, `IdentityParseException`, `ProxyParseException`, `VersionParseException`                                                                                                                        | `ParseException`                                                                                  |
| `EncapsulationException`, `IllegalMessageSizeException`, `MemoryLimitException`, `NoValueFactoryException`, `ProxyUnmarshalException`, `StringConversionException`, `UnexpectedObjectException`, `UnmarshalOutOfBoundsException`, `UnsupportedEncodingException` | `MarshalException`                                                                                |
| `BadMagicException`, `CompressionException`, `ConnectionNotValidatedException`, `UnknownMessageException`                                                                                                                                                        | `ProtocolException`                                                                               |
| `CFNetworkException`                                                                                                                                                                                                                                             | `SocketException`                                                                                 |
| `ConnectionManuallyClosedException`                                                                                                                                                                                                                              | `ConnectionAbortedException` after `abort`, `ConnectionClosedException` after `close`             |
| `UnsupportedProtocolException`                                                                                                                                                                                                                                   | `MarshalException` or `FeatureNotSupportedException`                                              |
| `VersionMismatchException`                                                                                                                                                                                                                                       | `InitializationException`                                                                         |
| `IllegalIdentityException`                                                                                                                                                                                                                                       | `std::invalid_argument` in C++, `ArgumentException` in C#, `IllegalArgumentException` in Java     |
| `IllegalServantException`                                                                                                                                                                                                                                        | `std::invalid_argument` in C++, `ArgumentNullException` in C#, `IllegalArgumentException` in Java |
| `CloneNotImplementedException`                                                                                                                                                                                                                                   | `std::logic_error` (this exception existed only in C++)                                           |
| `UnknownReplyStatusException`                                                                                                                                                                                                                                    | None: every reply status is valid                                                                 |

The local exceptions that Ice transmits from a server to a client now derive from `DispatchException`, which carries the
reply status. See [Local and Dispatch Exceptions](../local-and-dispatch-exceptions).

## SSL Transport

The SSL transport is now part of the Ice library and is no longer a plug-in.

- Remove the `Ice.Plugin.IceSSL` property from your configuration: Ice 3.8 provides no IceSSL plug-in to load.
- The `IceSSL` certificate API, the certificate verifiers and the password callbacks are removed. Configure the SSL
  transport [programmatically](../ssl-transport) with the API of the SSL engine of your platform instead.
- Ice for C++ on Windows always uses Schannel. Migrate an application that used the OpenSSL-based IceSSL on Windows to
  the Schannel [IceSSL properties](../icessl-properties) or to the Schannel API.
- `IceSSL.CertFile` accepts a single file. Ice 3.7 with OpenSSL or Schannel accepted two files.
- In Java, `IceSSL.Keystore` no longer doubles as the truststore. Set `IceSSL.Truststore` or `IceSSL.UsePlatformCAs`.

## Plug-ins

- Each plug-in provided by Ice has a fixed name: `IceBT`, `IceDiscovery`, `IceIAP`, `IceLocatorDiscovery`, `IceUDP` or
  `IceWS`. Use this name in the `Ice.Plugin.name` property that loads the plug-in, in `Ice.PluginLoadOrder`, and when
  you look up the plug-in.
- The language suffix of `Ice.Plugin.name.cpp`, `Ice.Plugin.name.java` and `Ice.Plugin.name.clr` is removed. Use
  `Ice.Plugin.name`, in a configuration file that you do not share between language mappings.

See [Installing a Plug-in Using Configuration](../installing-a-plug-in-using-configuration).

## Services

### DataStorm

The DataStorm publisher/subscriber framework has been integrated into the Ice distribution, and is no longer a separate
product.

A DataStorm node running Ice 3.8.3 connects only to nodes running Ice 3.8.3 or later. See the
[Ice 3.8.3 release notes](../ice-3-8-3).

### Glacier2

The Slice definitions of Glacier2 are unchanged in Ice 3.8. As a result, you can use a 3.8 router with a 3.7 client, and
vice-versa.

The configuration and the session lifetime of the router changed:

- The buffered mode is removed. Remove `Glacier2.Client.Buffered`, `Glacier2.Server.Buffered`,
  `Glacier2.Client.SleepTime` and `Glacier2.Server.SleepTime` from the router configuration.
- Request batching and request overrides are removed. Remove `Glacier2.Client.AlwaysBatch`,
  `Glacier2.Server.AlwaysBatch`, `Glacier2.Client.Trace.Override` and `Glacier2.Server.Trace.Override`; the router gives
  no meaning to the `_ovrd` request context.
- `Glacier2.ReturnClientProxy` is removed.
- `Glacier2.SessionTimeout` is removed. A session lasts as long as the connection that created it: the router destroys
  the session when this connection closes, and the [idle check](../connection-closure) detects a dead client.
  `refreshSession` only verifies that the session exists, and `getSessionTimeout` and `getACMTimeout` return the idle
  timeout of the router's client connections.
- The Glacier2 helper classes (`Glacier2.Application`, `SessionFactoryHelper` and `SessionHelper`) are removed. Create
  and destroy the session with the `Glacier2::Router` proxy, as described in
  [Getting Started with Glacier2](../getting-started-with-glacier2).

### IceBox

The `IceBox::ServiceManager` interface changed in Ice 3.8:

- The `getSliceChecksums` operation is removed. Remove the calls to this operation from your administrative clients.
- The `isServiceRunning` operation is new. An IceBox 3.7 server does not implement it.

The `startService`, `stopService`, `addObserver` and `shutdown` operations are unchanged.

The service manager is available only as a facet of the [Ice.Admin object](../icebox-administration). The
`IceBox.ServiceManager` object adapter and its properties, and the `IceBox.InstanceName` property, are removed.

The C++ IceBox server is `icebox`; the `icebox++11` executable is removed. The C# IceBox server, `iceboxnet`, is
distributed as a .NET tool. See [Starting the IceBox Server](../starting-the-icebox-server).

Update the version in the entry point of a C++ service that Ice provides, such as IceStorm:

```diff
-IceBox.Service.IceStorm=IceStormService,37:createIceStorm
+IceBox.Service.IceStorm=IceStormService,38:createIceStorm
```

### IceGrid

The Slice definitions of IceGrid in Ice 3.8 are _not_ compatible with the Ice 3.7 definitions. As a result, you cannot
mix a 3.8 registry with a 3.7 node, or vice-versa. You also need to use the 3.8 version of the admin tools
(`icegridadmin` and `IceGridGUI`) to manage a 3.8 deployment.

You can nevertheless:

- start/manage Ice 3.7 servers from IceGrid 3.8
- start/manage Ice 3.8 servers from IceGrid 3.7

The IceGrid registry database schema is the same in Ice 3.8 and Ice 3.7. This allows you to start a 3.8 registry with a
LMDB database created by a 3.7 registry.

Update your deployment descriptors, configuration and scripts as follows:

- Remove the `distrib` elements from your application and server descriptors, and the `application patch` and
  `server patch` commands from your `icegridadmin` scripts. IceGrid 3.8 rejects these elements. Distribute the files of
  your servers with another [tool](../application-distribution).
- Remove the `dbenv` elements from your descriptors. IceGrid 3.8 rejects these elements.
- Remove `IceGrid.Registry.SessionTimeout`. A client or administrative session lasts as long as the connection that
  created it, and the `keepAlive` operation of these sessions does nothing. `IceGrid.Registry.NodeSessionTimeout` and
  `IceGrid.Registry.ReplicaSessionTimeout` remain.
- Remove `IceGrid.Node.Trace.Patch`, `IceGrid.Registry.Trace.Patch`, `IceGrid.Registry.RequireNodeCertCN` and
  `IceGrid.Registry.RequireReplicaCertCN`, which no longer exist.
- Replace the `icegridadmin` command `server state` with [`server status`](../icegridadmin-command-line-tool).

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

The Slice definitions of IceStorm are unchanged in Ice 3.8. This allows you to use a mix of 3.7 and 3.8 for your
IceStorm service, publishers and subscribers. You can even use a mix of 3.7 and 3.8 IceStorm replicas in a replicated
deployment.

Moreover, the IceStorm database schema is the same in Ice 3.8 and Ice 3.7. This allows you to start an IceStorm 3.8
service with a LMDB database created by IceStorm 3.7.

## Miscellaneous

- The Objective-C mapping has been removed. You should upgrade to the Swift mapping.
- The Java Compat mapping has been removed. You should upgrade to the Java mapping.
