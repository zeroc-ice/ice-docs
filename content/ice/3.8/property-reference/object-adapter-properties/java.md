{% language-section name="adapter.messagesizemax" %}

## _adapter_.AdapterId

{% property-synopsis %}

`adapter.AdapterId=id`

{% /property-synopsis %}

{% property-description %}

Assigns an adapter ID to this object adapter. An object adapter with an adapter ID is called an _indirect adapter_.

This ID must be unique among all object adapters using the same [locator](../../runtime/locators) instance. If a locator
proxy is defined using [adapter.Locator](#adapter.locator) or [Ice.Default.Locator](../ice-default-properties), this
object adapter registers its endpoints with the locator registry upon activation.

{% /property-description %}

## _adapter_.AllowedOrigins

{% property-synopsis %}

`adapter.AllowedOrigins=originList`

{% /property-synopsis %}

{% property-description %}

Restricts which HTTP Origin headers are accepted on the WebSocket upgrade request received by this object adapter. This
property has effect only for adapters with WebSocket endpoints (`ws` or `wss`).

originList is a comma or whitespace-separated list of origins. Each entry has the form `scheme://host[:port]`, where
scheme is `http` or `https` and host is a DNS name or IP address. The scheme and host are compared case-insensitively;
the default port for the scheme (80 for http, 443 for https) is omitted during comparison, so `https://web.example.com`
and `https://web.example.com:443` match the same origin.

The default value (empty) disables the check. A `*` entry also disables it, whatever the other entries are. Ice reads
this property when creating an adapter with WebSocket endpoints.

When the check is enabled, Ice checks each incoming WebSocket upgrade request as follows:

If the request has no Origin header, the upgrade is accepted. Browsers always send Origin; non-browser Ice clients do
not, so the check only filters browser-originated traffic. If the request has an Origin header that canonicalizes to an
entry in the list, the upgrade is accepted. An unlisted or malformed origin causes Ice to reject the upgrade and close
the connection.

This property is intended to mitigate cross-site WebSocket hijacking against browser-based Ice clients (Ice for
JavaScript).

{% /property-description %}

### Example {% id="adapter.allowedorigins-example" %}

```config
MyAdapter.Endpoints=wss -h api.example.com -p 443
MyAdapter.AllowedOrigins=https://web.example.com, https://admin.example.com
```

## _adapter_.Connection.CloseTimeout

{% property-synopsis %}

`adapter.Connection.CloseTimeout=num` (in seconds)

{% /property-synopsis %}

{% property-description %}

Overrides the setting of [Ice.Connection.Server.CloseTimeout](../ice-connection-properties) for this object adapter.

{% /property-description %}

## _adapter_.Connection.ConnectTimeout

{% property-synopsis %}

`adapter.Connection.ConnectTimeout=num` (in seconds)

{% /property-synopsis %}

{% property-description %}

Overrides the setting of [Ice.Connection.Server.ConnectTimeout](../ice-connection-properties) for this object adapter.

{% /property-description %}

## _adapter_.Connection.EnableIdleCheck

{% property-synopsis %}

`adapter.Connection.EnableIdleCheck=num`

{% /property-synopsis %}

{% property-description %}

Overrides the setting of [Ice.Connection.Server.EnableIdleCheck](../ice-connection-properties) for this object adapter.

{% /property-description %}

## _adapter_.Connection.IdleTimeout

{% property-synopsis %}

`adapter.Connection.IdleTimeout=num` (in seconds)

{% /property-synopsis %}

{% property-description %}

Overrides the setting of [Ice.Connection.Server.IdleTimeout](../ice-connection-properties) for this object adapter.

{% /property-description %}

## _adapter_.Connection.InactivityTimeout

{% property-synopsis %}

`adapter.Connection.InactivityTimeout=num` (in seconds)

{% /property-synopsis %}

{% property-description %}

Overrides the setting of [Ice.Connection.Server.InactivityTimeout](../ice-connection-properties) for this object
adapter.

{% /property-description %}

## _adapter_.Connection.MaxDispatches

{% property-synopsis %}

`adapter.Connection.MaxDispatches=num`

{% /property-synopsis %}

{% property-description %}

Overrides the setting of [Ice.Connection.Server.MaxDispatches](../ice-connection-properties) for this object adapter.

{% /property-description %}

## _adapter_.Endpoints

{% property-synopsis %}

`adapter.Endpoints=endpoints`

{% /property-synopsis %}

{% property-description %}

Sets the [physical endpoints](../../runtime/dispatch/object-adapter-endpoints) of this object adapter. These endpoints
correspond to the network interfaces on which the object adapter accepts connections and receives requests.

{% /property-description %}

## _adapter_.Locator

{% property-synopsis %}

`adapter.Locator=locator`

{% /property-synopsis %}

{% property-description %}

Specifies the [locator](../../runtime/locators) of this object adapter. The value is a stringified proxy to an
`Ice::Locator` object.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

{% /property-description %}

## _adapter_.MaxConnections

{% property-synopsis %}

`adapter.MaxConnections=num`

{% /property-synopsis %}

{% property-description %}

When `num` is greater than `0`, Ice limits the number of incoming connections separately for each listening endpoint of
this object adapter. Once an endpoint reaches the limit, Ice accepts and immediately closes additional connections to
that endpoint until an existing connection closes. UDP endpoints are exempt from this limit.

The default value is `0`. A value of `0` or less disables the limit.

{% /property-description %}

## _adapter_.MessageSizeMax

{% property-synopsis %}

`adapter.MessageSizeMax=num` (in KiB)

{% /property-synopsis %}

{% property-description %}

Limits the size of the Ice protocol messages this adapter receives, in KiB (1024 bytes). The limit applies to the whole
message, including the protocol header; for a compressed message, it also applies to the decompressed size. If not
defined, the adapter uses the communicator's [Ice.MessageSizeMax](../ice-properties) limit.

A value of `0` or less selects the maximum supported size of 2,147,483,647 bytes. A positive value must be at most
2,097,151 KiB.

This property is logically a connection property, and only applies to messages received over network connections created
by this object adapter.

{% /property-description %}

{% /language-section %}

{% language-section name="adapter.replicagroupid" %}

## _adapter_.PublishedHost

{% property-synopsis %}

`adapter.PublishedHost=host`

{% /property-synopsis %}

{% property-description %}

Specifies the published host for this object adapter. A published host is usually a DNS name, but it can also be an IP
address.

The published host is used by the algorithm that computes the published endpoints of an object adapter, when
`adapter.PublishedEndpoints` is not set. See
[Published Object Adapter Endpoints](../../runtime/dispatch/object-adapter-endpoints). This property is particularly
useful when the object adapter endpoints do not specify port numbers.

{% /property-description %}

## _adapter_.ReplicaGroupId

{% property-synopsis %}

`adapter.ReplicaGroupId=id`

{% /property-synopsis %}

{% property-description %}

Identifies the group of [replicated object adapters](../../services/icegrid/object-adapter-replication) to which this
adapter belongs. The replica group is treated as a virtual object adapter, so that an indirect proxy of the form
`identity@id` refers to the object adapters in the group. During binding, a client will attempt to establish a
connection to an endpoint of one of the participating object adapters, and automatically try others until a connection
is successfully established or all attempts have failed. Similarly, an outstanding request will, when permitted,
automatically fail over to another object adapter of the replica group upon connection failure. The set of endpoints
actually used by the client during binding is determined by the locator's configuration policies.

Defining a value for this property has no effect unless [_adapter_.AdapterId](#adapter.adapterid) is also defined.
Furthermore, the locator registry may require replica groups to be defined in advance (see
[IceGrid.Registry.DynamicRegistration](../icegrid-properties)), otherwise `Ice.NotRegisteredException` is thrown upon
adapter activation. Regardless of whether an object adapter is replicated, it can always be addressed individually in an
indirect proxy if it defines a value for [_adapter_.AdapterId](#adapter.adapterid).

{% /property-description %}

{% /language-section %}

{% language-section name="adapter.threadpool.threadidletime" %}

## _adapter_.ThreadPool.Serialize

{% property-synopsis %}

`adapter.ThreadPool.Serialize=num`

{% /property-synopsis %}

{% property-description %}

If `num` is a value greater than `0`, the adapter's thread pool serializes all messages from each connection. It is not
necessary to enable this feature in a thread pool whose maximum size is 1 thread. When a thread pool dispatches requests
implemented with AMD, it serializes the dispatching of requests from each connection, but it does not wait for a request
to complete before it dispatches the next request.

In a [multi-threaded pool](../../runtime/threading-model), enabling serialization allows requests from different
connections to be dispatched concurrently while preserving the order of messages on each connection. Note that
serialization can have a significant impact on latency and throughput. If not defined, the default value is `0`.

{% /property-description %}

## _adapter_.ThreadPool.Size

{% property-synopsis %}

`adapter.ThreadPool.Size=num`

{% /property-synopsis %}

{% property-description %}

A communicator creates a default server thread pool that dispatches requests to its object adapters. An object adapter
can also be configured with its own [thread pool](../../runtime/threading-model). This is useful in avoiding deadlocks
due to thread starvation by ensuring that a minimum number of threads is available for dispatching requests to certain
Ice objects.

The adapter uses the communicator's server thread pool when no `adapter.ThreadPool.*` property is set. Setting any
property with this prefix creates a dedicated pool. For example, setting only `adapter.ThreadPool.SizeMax=4` creates a
pool with one initial thread and a maximum of four threads.

`num` is the initial number of threads in the dedicated pool. Its default value is `1`. See
[Ice.ThreadPool._name_.Size](../ice-threadpool-properties) for more information.

{% /property-description %}

## _adapter_.ThreadPool.SizeMax

{% property-synopsis %}

`adapter.ThreadPool.SizeMax=num`

{% /property-synopsis %}

{% property-description %}

`num` is the maximum number of threads for the [thread pool](../../runtime/threading-model). See
[Ice.ThreadPool._name_.SizeMax](../ice-threadpool-properties) for more information.

The default value is the value of [_adapter_.ThreadPool.Size](#adapter.threadpool.size), meaning the thread pool can
never grow larger than its initial size.

{% /property-description %}

## _adapter_.ThreadPool.SizeWarn

{% property-synopsis %}

`adapter.ThreadPool.SizeWarn=num`

{% /property-synopsis %}

{% property-description %}

Whenever `num` threads are active in a [thread pool](../../runtime/threading-model), a "low on threads" warning is
printed. The default value is `0`, which disables the warning.

{% /property-description %}

## _adapter_.ThreadPool.StackSize

{% property-synopsis %}

`adapter.ThreadPool.StackSize=num`

{% /property-synopsis %}

{% property-description %}

`num` is the stack size (in bytes) of threads in the [thread pool](../../runtime/threading-model). The default value is
`0`, meaning the operating system's default is used.

{% /property-description %}

## _adapter_.ThreadPool.ThreadIdleTime

{% property-synopsis %}

`adapter.ThreadPool.ThreadIdleTime=num`

{% /property-synopsis %}

{% property-description %}

In a dynamically-sized [thread pool](../../runtime/threading-model), Ice reaps a thread after it is idle for `num`
seconds. Setting this property to `0` disables idle thread reaping. If not specified, the default value is 60 seconds.
See [Ice.ThreadPool._name_.ThreadIdleTime](../ice-threadpool-properties) for more information.

{% /property-description %}

## _adapter_.ThreadPool.ThreadPriority

{% property-synopsis %}

`adapter.ThreadPool.ThreadPriority=value`

{% /property-synopsis %}

{% property-description %}

`value` specifies a thread priority for the object adapter's [thread pool](../../runtime/threading-model). The object
adapter creates its threads with the specified priority. Leaving this property unset causes the adapter to create
threads with the priority specified by [Ice.ThreadPriority](../ice-properties).

`value` can be `MIN_PRIORITY`, `NORM_PRIORITY`, `MAX_PRIORITY`, or an integer between `1` and `10`.

The named values can also include the `java.lang.Thread.` prefix, for example `java.lang.Thread.NORM_PRIORITY`.

{% /property-description %}

{% /language-section %}
