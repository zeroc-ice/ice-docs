{% language-section name="adapter.messagesizemax" %}

## _adapter_.AdapterId

{% synopsis %}

`adapter.AdapterId=id`

{% /synopsis %}

{% description %}

Assigns an adapter ID to this object adapter. An object adapter with an adapter ID is called an _indirect adapter_.

This ID must be unique among all object adapters using the same [locator](../../runtime/locators) instance. If a locator
proxy is defined using [adapter.Locator](#adapter.locator) or [Ice.Default.Locator](../ice-default-properties), this
object adapter registers its endpoints with the locator registry upon activation.

{% /description %}

## _adapter_.AllowedOrigins

{% synopsis %}

`adapter.AllowedOrigins=originList`

{% /synopsis %}

{% description %}

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

{% /description %}

### Example {% id="adapter.allowedorigins-example" %}

```config
MyAdapter.Endpoints=wss -h api.example.com -p 443
MyAdapter.AllowedOrigins=https://web.example.com, https://admin.example.com
```

## _adapter_.Connection.CloseTimeout

{% synopsis %}

`adapter.Connection.CloseTimeout=num` (in seconds)

{% /synopsis %}

{% description %}

Overrides the setting of [Ice.Connection.Server.CloseTimeout](../ice-connection-properties) for this object adapter.

{% /description %}

## _adapter_.Connection.ConnectTimeout

{% synopsis %}

`adapter.Connection.ConnectTimeout=num` (in seconds)

{% /synopsis %}

{% description %}

Overrides the setting of [Ice.Connection.Server.ConnectTimeout](../ice-connection-properties) for this object adapter.

{% /description %}

## _adapter_.Connection.EnableIdleCheck

{% synopsis %}

`adapter.Connection.EnableIdleCheck=num`

{% /synopsis %}

{% description %}

Overrides the setting of [Ice.Connection.Server.EnableIdleCheck](../ice-connection-properties) for this object adapter.

{% /description %}

## _adapter_.Connection.IdleTimeout

{% synopsis %}

`adapter.Connection.IdleTimeout=num` (in seconds)

{% /synopsis %}

{% description %}

Overrides the setting of [Ice.Connection.Server.IdleTimeout](../ice-connection-properties) for this object adapter.

{% /description %}

## _adapter_.Connection.InactivityTimeout

{% synopsis %}

`adapter.Connection.InactivityTimeout=num` (in seconds)

{% /synopsis %}

{% description %}

Overrides the setting of [Ice.Connection.Server.InactivityTimeout](../ice-connection-properties) for this object
adapter.

{% /description %}

## _adapter_.Connection.MaxDispatches

{% synopsis %}

`adapter.Connection.MaxDispatches=num`

{% /synopsis %}

{% description %}

Overrides the setting of [Ice.Connection.Server.MaxDispatches](../ice-connection-properties) for this object adapter.

{% /description %}

## _adapter_.Endpoints

{% synopsis %}

`adapter.Endpoints=endpoints`

{% /synopsis %}

{% description %}

Sets the [physical endpoints](../../runtime/dispatch/object-adapter-endpoints) of this object adapter. These endpoints
correspond to the network interfaces on which the object adapter accepts connections and receives requests.

{% /description %}

## _adapter_.Locator

{% synopsis %}

`adapter.Locator=locator`

{% /synopsis %}

{% description %}

Specifies the [locator](../../runtime/locators) of this object adapter. The value is a stringified proxy to an
`Ice::Locator` object.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

{% /description %}

## _adapter_.MaxConnections

{% synopsis %}

`adapter.MaxConnections=num`

{% /synopsis %}

{% description %}

When `num` is greater than `0`, Ice limits the number of incoming connections separately for each listening endpoint of
this object adapter. Once an endpoint reaches the limit, Ice accepts and immediately closes additional connections to
that endpoint until an existing connection closes. UDP endpoints are exempt from this limit.

The default value is `0`. A value of `0` or less disables the limit.

{% /description %}

## _adapter_.MessageSizeMax

{% synopsis %}

`adapter.MessageSizeMax=num` (in KiB)

{% /synopsis %}

{% description %}

Limits the size of the Ice protocol messages this adapter receives, in KiB (1024 bytes). The limit applies to the whole
message, including the protocol header; for a compressed message, it also applies to the decompressed size. If not
defined, the adapter uses the communicator's [Ice.MessageSizeMax](../ice-properties) limit.

A value of `0` or less selects the maximum supported size of 2,147,483,647 bytes. A positive value must be at most
2,097,151 KiB.

This property is logically a connection property, and only applies to messages received over network connections created
by this object adapter.

{% /description %}

{% /language-section %}

{% language-section name="adapter.replicagroupid" %}

## _adapter_.PublishedHost

{% synopsis %}

`adapter.PublishedHost=host`

{% /synopsis %}

{% description %}

Specifies the published host for this object adapter. A published host is usually a DNS name, but it can also be an IP
address.

The published host is used by the algorithm that computes the published endpoints of an object adapter, when
`adapter.PublishedEndpoints` is not set. See
[Published Object Adapter Endpoints](../../runtime/dispatch/object-adapter-endpoints). This property is particularly
useful when the object adapter endpoints do not specify port numbers.

{% /description %}

## _adapter_.ReplicaGroupId

{% synopsis %}

`adapter.ReplicaGroupId=id`

{% /synopsis %}

{% description %}

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

{% /description %}

{% /language-section %}

{% language-section name="adapter.threadpool.threadidletime" %}

## _adapter_.ThreadPool.Serialize

{% synopsis %}

`adapter.ThreadPool.Serialize=num`

{% /synopsis %}

{% description %}

If `num` is a value greater than 0, the adapter's thread pool serializes all messages from each connection. It is not
necessary to enable this feature in a thread pool whose maximum size is 1 thread. When a thread pool dispatches requests
implemented with AMD, it serializes the dispatching of requests from each connection, but it does not wait for a request
to complete before it dispatches the next request.

In a [multi-threaded pool](../../runtime/threading-model), enabling serialization allows requests from different
connections to be dispatched concurrently while preserving the order of messages on each connection. Note that
serialization can have a significant impact on latency and throughput. If not defined, the default value is 0.

{% /description %}

## _adapter_.ThreadPool.Size

{% synopsis %}

`adapter.ThreadPool.Size=num`

{% /synopsis %}

{% description %}

A communicator creates a default server thread pool that dispatches requests to its object adapters. An object adapter
can also be configured with its own [thread pool](../../runtime/threading-model). This is useful in avoiding deadlocks
due to thread starvation by ensuring that a minimum number of threads is available for dispatching requests to certain
Ice objects.

The adapter uses the communicator's server thread pool when no `adapter.ThreadPool.*` property is set. Setting any
property with this prefix creates a dedicated pool. For example, setting only `adapter.ThreadPool.SizeMax=4` creates a
pool with one initial thread and a maximum of four threads.

`num` is the initial number of threads in the dedicated pool. Its default value is `1`. See
[Ice.ThreadPool._name_.Size](../ice-threadpool-properties) for more information.

{% /description %}

## _adapter_.ThreadPool.SizeMax

{% synopsis %}

`adapter.ThreadPool.SizeMax=num`

{% /synopsis %}

{% description %}

`num` is the maximum number of threads for the [thread pool](../../runtime/threading-model). See
[Ice.ThreadPool._name_.SizeMax](../ice-threadpool-properties) for more information.

The default value is the value of [_adapter_.ThreadPool.Size](#adapter.threadpool.size), meaning the thread pool can
never grow larger than its initial size.

{% /description %}

## _adapter_.ThreadPool.SizeWarn

{% synopsis %}

`adapter.ThreadPool.SizeWarn=num`

{% /synopsis %}

{% description %}

Whenever `num` threads are active in a [thread pool](../../runtime/threading-model), a "low on threads" warning is
printed. The default value is 0, which disables the warning.

{% /description %}

## _adapter_.ThreadPool.StackSize

{% synopsis %}

`adapter.ThreadPool.StackSize=num`

{% /synopsis %}

{% description %}

`num` is the stack size (in bytes) of threads in the [thread pool](../../runtime/threading-model). The default value is
0, meaning the operating system's default is used.

{% /description %}

## _adapter_.ThreadPool.ThreadIdleTime

{% synopsis %}

`adapter.ThreadPool.ThreadIdleTime=num`

{% /synopsis %}

{% description %}

In a dynamically-sized [thread pool](../../runtime/threading-model), Ice reaps a thread after it is idle for `num`
seconds. Setting this property to 0 disables idle thread reaping. If not specified, the default value is 60 seconds. See
[Ice.ThreadPool._name_.ThreadIdleTime](../ice-threadpool-properties) for more information.

{% /description %}

## _adapter_.ThreadPool.ThreadPriority

{% synopsis %}

`adapter.ThreadPool.ThreadPriority=value`

{% /synopsis %}

{% description %}

`value` specifies a thread priority for the object adapter's [thread pool](../../runtime/threading-model). The object
adapter creates its threads with the specified priority. Leaving this property unset causes the adapter to create
threads with the priority specified by [Ice.ThreadPriority](../ice-properties).

`value` can be `Lowest`, `BelowNormal`, `Normal`, `AboveNormal`, or `Highest`.

The named values can also include the `ThreadPriority.` prefix, for example `ThreadPriority.AboveNormal`.

{% /description %}

{% /language-section %}
