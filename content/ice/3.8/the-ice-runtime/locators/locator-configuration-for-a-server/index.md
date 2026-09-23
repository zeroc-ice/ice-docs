---
title: Locator Configuration for a Server
---

# Configuring an Object Adapter with a Locator

An [object adapter](../dispatch) must be able to obtain a [locator](../locators) proxy in order to register itself with
a location service. Each object adapter can be configured with its own locator proxy by defining its
[Locator](../object-adapter-properties) property, as shown in the example below for the object adapter named
`SampleAdapter`:

```
SampleAdapter.Locator=IceGrid/Locator:tcp -h locatorhost -p 10000
```

Alternatively, a server may call `setLocator` on the object adapter prior to activation. If the object adapter is not
explicitly configured with a locator proxy, it uses the [default locator](../locator-configuration-for-a-client) as
provided by its communicator.

Two other configuration properties influence an object adapter's interactions with a location service during activation:

- [AdapterId](../object-adapter-properties) Configuring a non-empty identifier for the `AdapterId` property causes the
  object adapter to register itself with the location service. A locator proxy must also be configured.

- [ReplicaGroupId](../object-adapter-properties) Configuring a non-empty identifier for the `ReplicaGroupId` property
  indicates that the object adapter is a member of a [replica group](../terminology). For this property to have an
  effect, `AdapterId` must also be configured with a non-empty value.

We can use these properties as shown below:

```
SampleAdapter.AdapterId=SampleAdapterId
SampleAdapter.ReplicaGroupId=SampleGroupId
SampleAdapter.Locator=IceGrid/Locator:tcp -h locatorhost -p 10000
```

Note that a location service may enforce [pre-registration requirements](../locator-semantics-for-servers).

# Registering a Process with a Locator

An activation service, such as an [IceGrid](../icegrid) node, needs a reliable way to gracefully shut down a server. One
approach is to use a platform-specific mechanism, such as POSIX signals. This works well on POSIX platforms when the
server is prepared to catch signals and react appropriately. On Windows platforms, it works less reliably for C++
servers, and not at all for Java servers. For these reasons, Ice provides an alternative that is both portable and
reliable:

```slice
module Ice
{
    interface Process
    {
        void shutdown();
        void writeMessage(string message, int fd);
    }
}
```

The Slice interface [Process](../the-process-facet) allows an activation service to request a graceful shutdown of the
server. When `shutdown` is invoked, the object implementing this interface is expected to initiate the termination of
its server process. The activation service may expect the server to terminate within a certain period of time, after
which it may terminate the server abruptly.

One of the benefits of the Ice [administrative facility](../administrative-facility) is that it creates an
implementation of `Process` and makes it available via an administrative object adapter, or your own object adapter.
Furthermore, IceGrid automatically enables this facility on the servers that it activates.

##### See Also

- [Object Adapters](../dispatch)
- [Locators](../locators)
- [Locator Configuration for a Client](../locator-configuration-for-a-client)
- [Locator Semantics for Servers](../locator-semantics-for-servers)
- [The Process Facet](../the-process-facet)
- [Administrative Facility](../administrative-facility)
- [IceGrid](../icegrid)
