---
id: upgrade-guide
title: Upgrade Guide
---

Learn how to upgrade your application from Ice 3.7 to Ice 3.8.

This page guides you through the upgrade process for an application that uses Ice 3.7. We recommend reading the [release notes](../release-notes) for a general list changes and improvements.

Ice 3.8 does not maintain binary compatibility or source compatibility with Ice 3.7. When upgrading, you need to recompile your Slice files and in some cases update your source code to use the latest APIs.

## Requirements

Please refer to the supported platforms page in the release notes for details on the supported platforms.

## Packaging

Many Slice compilers such as `slice2cs`, `slice2swift`, etc. are no longer available as part of the general installation of the Linux, macOs, and Windows packages. To use these compilers, install the appropriate language-specific package.

{% language-section name="lang-1" /%}

## Slice

### Local Slice

Support for local Slice has been removed. Previously defined local Slice types will need to be defined directly in your programming.

### Operations on Classes

Support for operations on classes was removed. This feature was previously deprecated.

```diff
class Foo
{
-  void bar();
}
```

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
The following suggestions will break on-the-wire compatibility. Please ensure all clients and servers are using the same Slice definitions.
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

2. Replace simple classes by structs. This will not be possible for classes which use inheritance or where their usage requires reference semantics.

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

## Connection Management

### Active Connection Management

The connection management system used in Ice 3.7, *Active Connection Management (ACM)*, has been removed. In its place is a new [Idle Timeout mechanism](../connection-closure) which should usually require *zero* configuration.

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

### Heartbeat Callback

The `setHeartbeatCallback` operation has been removed from the `Connection` class.

### Default Object Adapter

A default Object Adapter can now be associated with a Communicator. This greatly simplifies the creation of bidirectional connections. See [Bidirectional Connections](../bidirectional-connections) for more information.

## Published Endpoints

The computation of an Object Adapter’s published endpoints has been updated.

With the exception of some filtering for loopback addresses, the previous algorithm would produce endpoints containing the IP addresses for all network interfaces; some of which may be internal and unreachable. The new algorithm is simpler and uses the Fully Qualified Domain Name (FQDN) of the system. See [Object Adapter Endpoints](../object-adapter-endpoints) for more information.

A new property `_adapter_.PublishedHost` has been added. It is used to compute the default published endpoints.

{% callout type="info" %}
Users who are setting `_adapter_.PublishedEndpoints` to limit the published endpoints are encouraged to try the new default.
{% /callout %}

Additionally, the `refreshPublishedEndpoints` method has been removed from `ObjectAdapter`.

## Secure Proxy Options, Properties, and Methods

Removed the `secure` proxy option, the `PreferSecure` proxy property, and all associated properties (`Ice.Default.PreferSecure`, `Ice.Override.Secure`) and proxy methods (`ice_secure`, `ice_preferSecure`, etc.).

Proxies should not contain a mix of secure and non-secure endpoints.

```diff
-ssl -h prod.host.name -p 4062:tcp -h prod.host.name -p 10000
+ssl -h prod.host.name -p 4062
```

## Proxy Creation

Proxy creation has been simplified, allowing you to create a proxy from a communicator and endpoint string.

{% language-section name="lang-2" /%}

{% language-section name="lang-3" /%}

## Property Validation

Ice now validates properties with that start with an Ice property prefix (`Ice.`, `IceSSL.`, etc.). Setting an unknown Ice property or a property configured for the wrong Ice service will now fail.

Please refer to the [property reference](../property-reference) for a complete list of Ice properties.

## Services

### DataStorm

The DataStorm publisher/subscriber framework has been integrated into the Ice distribution, and is no longer a separate product.

### Glacier2

The Slice definitions of Glacier2 are unchanged in Ice 3.8. As a result, you can use a 3.8 router with a 3.7 client, and vice-versa.

### IceBox

The Slice definitions of IceBox are unchanged in Ice 3.8.

### IceGrid

The Slice definitions of IceGrid in Ice 3.8 are *not* compatible with the Ice 3.7 definitions. As a result, you cannot mix a 3.8 registry with a 3.7 node, or vice-versa. You also need to use the 3.8 version of the admin tools (`icegridadmin` and `IceGridGUI`) to manage a 3.8 deployment.

You can nevertheless:

- start/manage Ice 3.7 servers from IceGrid 3.8
- start/manage Ice 3.8 servers from IceGrid 3.7

The IceGrid registry database schema is the same in Ice 3.8 and Ice 3.7. This allows you to start a 3.8 registry with a LMDB database created by a 3.7 registry.

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

The Slice definitions of IceStorm are unchanged in Ice 3.8. This allows you to use a mix of 3.7 and 3.8 for your IceStorm service, publishers and subscribers. You can even use a mix of 3.7 and 3.8 IceStorm replicas in a replicated deployment.

Moreover, the IceStorm database schema is the same in Ice 3.8 and Ice 3.7. This allows you to start an IceStorm 3.8 service with a LMDB database created by IceStorm 3.7.

## Miscellaneous

- The Objective-C mapping has been removed. You should upgrade to the Swift mapping.
- The Java Compat mapping has been removed. You should upgrade to the Java mapping.
