---
title: Load Balancing
---

[Replication](../object-adapter-replication) is an important IceGrid feature but, when combined with load balancing,
replication becomes even more useful.

IceGrid nodes regularly report the system load of their hosts to the registry. The replica group's configuration
determines whether the registry actually considers system load information while processing a locate request. Its
configuration also specifies how many replicas to include in the registry's response.

IceGrid's load balancing capability assists the client in obtaining an initial set of endpoints for the purpose of
[establishing a connection](../connection-establishment). Once a client has established a connection, all subsequent
requests on the proxy that initiated the connection are normally sent to the same server without further consultation
with the registry. As a result, the registry's response to a locate request can only be viewed as a snapshot of the
replicas at a particular moment. If system loads are important to the client, it must take steps to periodically contact
the registry and [update its endpoints](../locator-semantics-for-clients).

# Replica Group Load Balancing

A [replica group descriptor](../replica-group-descriptor-element) optionally contains a
[load balancing descriptor](../load-balancing-descriptor-element) that determines how system loads are used in locate
requests. The load balancing descriptor specifies the following information:

- Type Several [load balancing types](../load-balancing#load-balancing-types) are supported.

- Sampling interval One of the load balancing types considers system load statistics, which are reported by each node at
  regular intervals. The replica group can specify a sampling interval of one, five, or fifteen minutes. Choosing a
  sampling interval requires balancing the need for up-to-date load information against the desire to minimize transient
  spikes. On Unix platforms, the node reports the system's load average for the selected interval, while on Windows the
  node reports the CPU utilization averaged over the interval.

- Number of replicas The replica group can instruct the registry to return the endpoints of one (the default) or more
  object adapters. If the specified number _N_ is larger than one, the proxy returned in response to a locate request
  contains the endpoints of at most _N_ object adapters. If _N_ is 0, the proxy contains the endpoints of all the object
  adapters. The Ice run time in the client selects one of these endpoints at random when
  [establishing a connection](../connection-establishment).

For example, the descriptor shown below uses adaptive load balancing to return the endpoints of the two least-loaded
object adapters sampled with five-minute intervals:

```xml
<replica-group id="ReplicatedAdapter">
    <load-balancing type="adaptive" load-sample="5" n-replicas="2"/>
</replica-group>
```

The type must be specified, but the remaining attributes are optional.

{% callout type="info" %}

IceGrid ignores the object adapters of a [disabled server](../icegrid-troubleshooting) when executing a locate request,
meaning the client that initiated the locate request will not receive the endpoints for any of these object adapters.

{% /callout %}

{% callout type="info" %}

You can optionally use custom load balancing strategies by installing [replica group filters](../load-balancing).

{% /callout %}

# Load Balancing Types

A replica group can select one of the following load balancing types:

- Random Random load balancing selects the requested number of object adapters at random. The registry does not consider
  system load for a replica group with this type.

- Adaptive Adaptive load balancing uses system load information to choose the least-loaded object adapters over the
  requested sampling interval. This is the only load balancing type that uses sampling intervals.

- Round Robin Round robin load balancing returns the least recently used object adapters. The registry does not consider
  system load for a replica group with this type. Note that the round-robin information is not shared between registry
  replicas; each replica maintains its own notion of the "least recently used" object adapters.

- Ordered Ordered load balancing selects the requested number of object adapters by priority. A priority can be set for
  each object adapter member of the replica group. If you define several object adapters with the same priority, IceGrid
  will order these object adapters according to their order of appearance in the descriptor.

Choosing the proper type of load balancing is highly dependent on the needs of client applications. Achieving the
desired load balancing and fail-over behavior may also require the cooperation of your clients. To that end, it is very
important that you understand how and when the Ice run time uses a
[locator to resolve indirect proxies](../locator-semantics-for-clients).

# Using Load Balancing in the Ripper Application

The only change we need to make to the ripper application is the addition of a load balancing descriptor:

```xml
<icegrid>
    <application name="Ripper">
        <replica-group id="EncoderAdapters">
            <load-balancing type="adaptive"/>
            <object identity="EncoderFactory"
                    type="::Ripper::MP3EncoderFactory"/>
        </replica-group>
        <server-template id="EncoderServerTemplate">
            <parameter name="index"/>
            <parameter name="exepath" default="/opt/ripper/bin/server"/>
            <server id="EncoderServer${index}"
                    exe="${exepath}"
                    activation="on-demand">
                <adapter name="EncoderAdapter"
                         replica-group="EncoderAdapters"
                         endpoints="tcp"/>
            </server>
        </server-template>
        <node name="Node1">
            <server-instance template="EncoderServerTemplate" index="1"/>
        </node>
        <node name="Node2">
            <server-instance template="EncoderServerTemplate" index="2"/>
        </node>
    </application>
</icegrid>
```

Using adaptive load balancing, we have regained the functionality we forfeited when we
[introduced replica groups](../object-adapter-replication). Namely, we now select the object adapter on the least-loaded
node, and no changes are necessary in the client.

# Interacting with Object Replicas

In some applications you may have a need for interacting directly with the replicas of an object. You might be tempted
to call `ice_getEndpoints` on the proxy of a replicated object in an effort to obtain the endpoints of all replicas, but
that is not the correct solution because the proxy is indirect and therefore contains no endpoints. The proper approach
is to [query well-known objects](../well-known-objects) using the `findAllReplicas` operation.

# Custom Load Balancing Strategies

The IceGrid registry allows you to plug in custom load balancing implementations that the registry invokes to filter its
query results. Two kinds of filters are supported:

- Replica group filter The registry invokes a replica group filter each time a client requests the endpoints of a
  replica group or object adapter, as well as for calls to [findAllReplicas](../well-known-objects). The registry passes
  information about the query that the filter can use in its implementation, including the list of object adapters
  participating in the replica group whose nodes are active at the time of the request. The object adapter list is
  initially ordered using the [load balancing type](../load-balancing#load-balancing-types) configured for the replica
  group; the filter can modify this list however it chooses.

- Type filter The registry invokes a type filter for each query that a client issues to
  [find a well-known object by type](../well-known-objects) using the operations `findObjectByType`,
  `findAllObjectsByType`, and `findObjectByTypeOnLeastLoadedNode`. Included in the information passed to the filter is a
  list of proxies for the matching well-known objects; the filter implementation decides which of these proxies are
  returned to the client.

In the sections below we describe how to implement these filters.

## Overview of Custom Load Balancing

Filters are installed into the IceGrid registry using the standard Ice [plug-in facility](../plug-in-facility).

Since IceGrid is implemented in C++, you need to write and register a C++ plug-in.

### The Registry Plug-in Facade Object

During initialization, your plug-in will obtain a reference to a facade object with which it can register one or more
filters. A filter typically retains a reference to this facade object because it offers a number of useful methods that
the filter might need during its implementation. This type of this facade object is the C++ class
[IceGrid::RegistryPluginFacade](https://code.zeroc.com/manual/IceGrid/RegistryPluginFacade).

There are methods for adding and removing replica group and type filters, along with a number of methods for obtaining
information about the deployment. As you can see, a great deal of information is available to a filter implementation
for use in making its decisions. The data structures returned by these methods correspond directly to their
[XML descriptors](../icegrid-xml-reference); you can also review the Slice definitions of the IceGrid data types for
more information.

### Implementing a Registry Plug-in

The [API](https://code.zeroc.com/ice/3.8/api/cpp/classIce_1_1Plugin.html) for creating an Ice plug-in using C++ requires
a factory function with external linkage, along with a class that implements the `Ice::Plugin` abstract base class. We
can use the code from the example in `demo/IceGrid/customLoadBalancing` to illustrate these points. First, the factory
function instantiates and returns the plug-in:

```cpp
extern "C"
{
    ICE_DECLSPEC_EXPORT Ice::Plugin*
    createRegistryPlugin(const Ice::CommunicatorPtr& communicator,
                         const string&,
                         const Ice::StringSeq&)
    {
        return new CustomRegistryPlugin(communicator);
    }
}
```

The plug-in class is straightforward:

```cpp
class CustomRegistryPlugin final : public Ice::Plugin
{
public:
    CustomRegistryPlugin(const Ice::CommunicatorPtr& communicator)
        : _communicator{communicator}
    {
    }

    void initialize() final
    {
        auto facade = IceGrid::getRegistryPluginFacade();
        if (facade)
        {
            facade->addReplicaGroupFilter(
                "filterByCurrency",
                 make_shared<CustomReplicaGroupFilter>(facade));
        }
    }

    void destroy() final
    {
    }

private:
    const Ice::CommunicatorPtr _communicator;
};
```

The `initialize` method calls `getRegistryPluginFacade` to obtain a smart pointer for the registry's
[facade object](../load-balancing). The plug-in uses this object to install a replica group filter.

We describe filter implementations in more detail below.

### Installing a Registry Plug-in

Continuing with our example, we use the following property to install our plug-in in the IceGrid registry:

```config
Ice.Plugin.RegistryPlugin=RegistryPlugin:createRegistryPlugin
```

The [Ice.Plugin](../ice-plugin-properties) property must be defined in the registry's configuration file.

{% callout type="tip" %}

Make sure to configure all of the replicas to load the same registry plug-ins, otherwise a client could get different
behavior depending on which replica it's currently using.

{% /callout %}

### Filter Implementation Techniques

A filter may require client-specific information in order to assemble its list of results. We recommend using
[request contexts](../request-contexts) for this purpose. Briefly, a request context is a dictionary of key/value string
pairs that a client can configure and send along as "out of band" metadata accompanying a request. Ice provides several
ways for a client to establish a request context:

- Implicit - provides a default request context for every request on all proxies
- Per-proxy - configures a default request context for every request on a particular proxy
- Explicit - specifies a request context at the time of invocation, overriding any default context

Our goal here is to transfer information from a client to a filter. Consequently, we don't recommend using implicit
contexts because the context will add overhead to _every_ invocation the client makes, not just the ones that involve
the filter. To decide whether to use per-proxy or explicit contexts, we first must understand the circumstances in which
each kind of filter receives a request context:

- Replica group filter Most invocations involving a replica group filter occur when the Ice run time in a client issues
  requests on a registry. This internal activity is triggered by the client's invocation on a proxy, but Ice doesn't use
  the client's proxy or the request context that the client may have configured for its proxy or passed explicitly to
  the invocation. Rather, the Ice run time uses the locator that the client configured for its proxy or communicator. As
  a result, the request contexts passed to a replica group filter are those configured for the _locator_ proxy. (The
  only exception is when a client invokes `findAllReplicas` directly on the registry via its `Query` interface; refer to
  the discussion of type filters below for more details.)

  There are several ways you can configure a request context for the locator proxy. If a client configures its locator
  proxy statically using properties, the simplest solution is to add [Context properties](../proxy-properties) to the
  client's configuration, such as:

  ```config
  Ice.Default.Locator=...
  Ice.Default.Locator.Context.someKey=someValue
  ```

  If you need to define the context at run time, you can obtain the locator proxy by calling `getDefaultLocator` on the
  communicator, create a new locator proxy with the desired context by calling `ice_context`, and then replace the
  locator proxy by calling `setDefaultLocator`.

  Both of these approaches are examples of per-proxy request contexts.

- Type filter Invocations involving type filters occur when a client invokes directly on the registry using its `Query`
  interface. To use per-proxy request contexts, configure the `Query` proxy as necessary. Explicit request contexts can
  also be used when querying the registry.

So far we've discussed how client-specific information can be passed to a filter, but what if the filter needs to obtain
more information about the object adapters (in the case of a replica group filter) or objects (in the case of a type
filter) in order to perform its duties? This is where the registry's [facade object](../load-balancing) comes in handy,
as with it the filter can retrieve information about the deployment. For example, a replica group filter can use
server-specific properties as a form of metadata. The registry supplies the filter with a list of object adapter
identifiers; each object adapter is hosted by a server, and the filter can look up property values for that server using
the facade.

## Implementing a Custom Replica Group Filter

A replica group filter must define a subclass of
[IceGrid::ReplicaGroupFilter](https://code.zeroc.com/manual/IceGrid/ReplicaGroupFilter).

{% callout type="warning" %}

The `filter` implementation must not block.

{% /callout %}

The replica group's descriptor specifies the filter:

```xml
<replica-group id="ReplicatedPricingAdapter" filter="filterByCurrency">
  <load-balancing type="random"/>
  <object identity="pricing" type="::Demo::PricingEngine"/>
</replica-group>
```

Notice that the filter identifier `filterByCurrency` matches that used when the plug-in
[registered the filter](../load-balancing).

In this example, the client uses a [request context](../load-balancing) to indicate the desired currency. The context is
configured on the locator proxy in the client's configuration file:

```config
Ice.Default.Locator=...
Ice.Default.Locator.Context.currency=USD
```

Here we use the [Context](../proxy-properties) proxy property to statically assign a request context to the locator
proxy, which means every invocation on the locator proxy includes the key/value pair `currency/USD`.

In addition to configuring the replica group filter, the deployment descriptor plays another important role here by
defining server-specific properties that the filter uses in its implementation:

```xml
<server-template id="PricingServer">
  <parameter name="index"/>
  <parameter name="currencies"/>
  <server id="PricingServer-${index}" exe="./server" activation="on-demand">
    <adapter name="Pricing"
             endpoints="tcp -h localhost"
             replica-group="ReplicatedPricingAdapter"/>
    <property name="Identity" value="pricing"/>
    <property name="Currencies" value="${currencies}"/>
    ...
  </server>
</server-template>

<node name="node1">
  <server-instance template="PricingServer" index="1" currencies="EUR, GBP, JPY"/>
  <server-instance template="PricingServer" index="2" currencies="USD, GBP, AUD"/>
  <server-instance template="PricingServer" index="3" currencies="EUR, USD, INR"/>
  <server-instance template="PricingServer" index="4" currencies="JPY, GBP, AUD"/>
  <server-instance template="PricingServer" index="5" currencies="GBP, AUD"/>
  <server-instance template="PricingServer" index="6" currencies="EUR, USD"/>
</node>
```

As a convenience, the descriptor file uses a server template to define several servers, with each server supporting a
specific set of currencies. The template adds to the property set of each server a property named `Currencies`
representing the currencies that the server supports.

Finally, you can see how all of this ties together in the filter implementation:

```cpp
Ice::StringSeq
ReplicaGroupFilterI::filter(const string& replicaGroupId,
                            const Ice::StringSeq& adapters,
                            const Ice::ConnectionPtr& connection,
                            const Ice::Context& ctx)
{
    auto p = ctx.find("currency");
    if(p == ctx.end())
    {
        return adapters;
    }

    string currency = p->second;

    Ice::StringSeq filteredAdapters;
    for (const auto& adapter : adapters)
    {
        if (_facade->getPropertyForAdapter(adapter, "Currencies")
            .find(currency) != string::npos)
        {
            filteredAdapters.push_back(adapter);
        }
    }
    return filteredAdapters;
}
```

The code first checks the request context for a value associated with the key `currency` and returns the adapter list
unmodified if no entry is found. Next, the method builds a new list of adapters by iterating over the adapter list in
its existing order and calling `getPropertyForAdapter` on the facade for each adapter. This method uses the registry's
deployment information to find the server hosting the given adapter and then searches the server's configuration
properties for one matching the given property name. If the `Currencies` property contains the client's specified
currency, the adapter is added to the list that is eventually returned by the filter.

As this example demonstrates, request contexts are a convenient way to supply a filter with client-specific information,
and server properties can serve as a simple database when a filter needs to tailor its results based on server
attributes.

## Implementing a Custom Type Filter

A replica group filter must define a subclass of
[IceGrid::TypeFilter](https://code.zeroc.com/manual/IceGrid/TypeFilter).

{% callout type="warning" %}

The `filter` implementation must not block.

{% /callout %}

Refer to the previous section for more information on implementing a filter.

##### See Also

- [Object Adapter Replication](../object-adapter-replication)
- [Connection Establishment](../connection-establishment)
- [Replica-Group Descriptor Element](../replica-group-descriptor-element)
- [Load-Balancing Descriptor Element](../load-balancing-descriptor-element)
- [Well-Known Objects](../well-known-objects)
- [IceGrid Troubleshooting](../icegrid-troubleshooting)
