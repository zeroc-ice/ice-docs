{% language-section name="lang-1" %}

# _adapter_.AdapterId

#### Synopsis

`adapter.AdapterId=id`

#### Description

Assigns an adapter ID to this object adapter. An object adapter with an adapter ID is called an _indirect adapter_.

This ID must be unique among all object adapters using the same [locator](../locators) instance. If a locator proxy is
defined using [adapter.Locator](../object-adapter-properties#adapter.locator) or
[Ice.Default.Locator](../ice-default-properties), this object adapter registers its endpoints with the locator registry
upon activation.

# _adapter_.AllowedOrigins

#### Synopsis

`adapter.AllowedOrigins=originList`

#### Description

Restricts which HTTP Origin headers are accepted on the WebSocket upgrade request received by this object adapter. This
property has effect only for adapters with WebSocket endpoints (`ws` or `wss`).

originList is a comma or whitespace-separated list of origins. Each entry has the form `scheme://host[:port]`, where
scheme is `http` or `https` and host is a DNS name or IP address. The scheme and host are compared case-insensitively;
the default port for the scheme (80 for http, 443 for https) is omitted during comparison, so `https://web.example.com`
and `https://web.example.com:443` match the same origin.

The literal value `*` allows any origin. The default value (empty) disables the check entirely.

When this property is set to a non-empty value other than `*`, each incoming WebSocket upgrade request is checked as
follows:

If the request has no Origin header, the upgrade is accepted. Browsers always send Origin; non-browser Ice clients do
not, so the check only filters browser-originated traffic. If the request has an Origin header that canonicalizes to an
entry in the list, the upgrade is accepted. Otherwise the upgrade is rejected and the connection is closed.

This property is intended to mitigate cross-site WebSocket hijacking against browser-based Ice clients (Ice for
JavaScript). Non-browser Ice clients are unaffected.

#### Example

```config
MyAdapter.Endpoints=wss -h api.example.com -p 443
MyAdapter.AllowedOrigins=https://web.example.com, https://admin.example.com
```

# _adapter_.Connection.CloseTimeout

#### Synopsis

`adapter.Connection.CloseTimeout=num` (in seconds)

#### Description

Overrides the setting of [Ice.Connection.Server.CloseTimeout](../ice-connection-properties) for this object adapter.

# _adapter_.Connection.ConnectTimeout

#### Synopsis

`adapter.Connection.ConnectTimeout=num` (in seconds)

#### Description

Overrides the setting of [Ice.Connection.Server.ConnectTimeout](../ice-connection-properties) for this object adapter.

# _adapter_.Connection.EnableIdleCheck

#### Synopsis

`adapter.Connection.EnableIdleCheck=num`

#### Description

Overrides the setting of [Ice.Connection.Server.EnableIdleCheck](../ice-connection-properties) for this object adapter.

# _adapter_.Connection.IdleTimeout

#### Synopsis

`adapter.Connection.IdleTimeout=num` (in seconds)

#### Description

Overrides the setting of [Ice.Connection.Server.IdleTimeout](../ice-connection-properties) for this object adapter.

# _adapter_.Connection.InactivityTimeout

#### Synopsis

`adapter.Connection.InactivityTimeout=num` (in seconds)

#### Description

Overrides the setting of [Ice.Connection.Server.InactivityTimeout](../ice-connection-properties) for this object
adapter.

# _adapter_.Connection.MaxDispatches

#### Synopsis

`adapter.Connection.MaxDispatches=num`

#### Description

Overrides the setting of [Ice.Connection.Server.MaxDispatches](../ice-connection-properties) for this object adapter.

# _adapter_.Endpoints

#### Synopsis

`adapter.Endpoints=endpoints`

#### Description

Sets the [physical endpoints](../object-adapter-endpoints) of this object adapter. These endpoints correspond to the
network interfaces on which the object adapter accepts connections and receives requests.

# _adapter_.Locator

#### Synopsis

`adapter.Locator=locator`

#### Description

Specifies the [locator](../locators) of this object adapter. The value is a stringified proxy to an `Ice::Locator`
object.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

# _adapter_.MaxConnections

#### Synopsis

`adapter.MaxConnections=num`

#### Description

When `num` is greater than `0`, this object adapter accepts a maximum of `num` incoming connections. Once the limit is
reached, an incoming connection must be closed before this object adapter accepts a new incoming connection.

The limit is infinite when `num` is `0` or less.

The default value for max connections is `0`.

# _adapter_.MessageSizeMax

#### Synopsis

`adapter.MessageSizeMax=num`

#### Description

Overrides the setting of [Ice.MessageSizeMax](../ice-properties) to limit the size of messages that can be received by
this object adapter. If not defined, the adapter uses the value of `Ice.MessageSizeMax`.

This property is logically a connection property, and only applies to messages received over network connections created
by this object adapter.

{% /language-section %}

{% language-section name="lang-2" %}

# _adapter_.PublishedHost

#### Synopsis

`adapter.PublishedHost=host`

#### Description

Specifies the published host for this object adapter. A published host is usually a DNS name, but it can also be an IP
address.

The published host is used by the algorithm that computes the published endpoints of an object adapter, when
`adapter.PublishedEndpoints` is not set. See [Published Object Adapter Endpoints](../object-adapter-endpoints). This
property is particularly useful when the object adapter endpoints do not specify port numbers.

# _adapter_.ReplicaGroupId

#### Synopsis

`adapter.ReplicaGroupId=id`

#### Description

Identifies the group of [replicated object adapters](../object-adapter-replication) to which this adapter belongs. The
replica group is treated as a virtual object adapter, so that an indirect proxy of the form `identity@id` refers to the
object adapters in the group. During binding, a client will attempt to establish a connection to an endpoint of one of
the participating object adapters, and automatically try others until a connection is successfully established or all
attempts have failed. Similarly, an outstanding request will, when permitted, automatically fail over to another object
adapter of the replica group upon connection failure. The set of endpoints actually used by the client during binding is
determined by the locator's configuration policies.

Defining a value for this property has no effect unless
[_adapter_.AdapterId](../object-adapter-properties#adapter.adapterid) is also defined. Furthermore, the locator registry
may require replica groups to be defined in advance (see [IceGrid.Registry.DynamicRegistration](../icegrid-properties)),
otherwise `Ice.NotRegisteredException` is thrown upon adapter activation. Regardless of whether an object adapter is
replicated, it can always be addressed individually in an indirect proxy if it defines a value for
[_adapter_.AdapterId](../object-adapter-properties#adapter.adapterid).

{% /language-section %}

{% language-section name="lang-3" %}

# _adapter_.ThreadPool.Serialize

#### Synopsis

`adapter.ThreadPool.Serialize=num`

#### Description

If `num` is a value greater than 0, the adapter's thread pool serializes all messages from each connection. It is not
necessary to enable this feature in a thread pool whose maximum size is 1 thread. When a thread pool dispatches requests
implemented with AMD, it serializes the dispatching of requests from each connection, but it does not wait for a request
to complete before it dispatches the next request.

In a [multi-threaded pool](../threading-model), enabling serialization allows requests from different connections to be
dispatched concurrently while preserving the order of messages on each connection. Note that serialization can have a
significant impact on latency and throughput. If not defined, the default value is 0.

# _adapter_.ThreadPool.Size

#### Synopsis

`adapter.ThreadPool.Size=num`

#### Description

A communicator creates a default server thread pool that dispatches requests to its object adapters. An object adapter
can also be configured with its own [thread pool](../threading-model). This is useful in avoiding deadlocks due to
thread starvation by ensuring that a minimum number of threads is available for dispatching requests to certain Ice
objects.

`num` is the initial number of threads in the thread pool. The default value is 0, meaning that an object adapter by
default uses the communicator's server thread pool. See [Ice.ThreadPool._name_.Size](../ice-threadpool-properties) for
more information.

# _adapter_.ThreadPool.SizeMax

#### Synopsis

`adapter.ThreadPool.SizeMax=num`

#### Description

`num` is the maximum number of threads for the [thread pool](../threading-model). See
[Ice.ThreadPool._name_.SizeMax](../ice-threadpool-properties) for more information.

The default value is the value of [_adapter_.ThreadPool.Size](../object-adapter-properties#adapter.threadpool.size),
meaning the thread pool can never grow larger than its initial size.

# _adapter_.ThreadPool.SizeWarn

#### Synopsis

`adapter.ThreadPool.SizeWarn=num`

#### Description

Whenever `num` threads are active in a [thread pool](../threading-model), a "low on threads" warning is printed. The
default value is 0, which disables the warning.

# _adapter_.ThreadPool.StackSize

#### Synopsis

`adapter.ThreadPool.StackSize=num`

#### Description

`num` is the stack size (in bytes) of threads in the [thread pool](../threading-model). The default value is 0, meaning
the operating system's default is used.

# _adapter_.ThreadPool.ThreadIdleTime

#### Synopsis

`adapter.ThreadPool.ThreadIdleTime=num`

#### Description

In a dynamically-sized [thread pool](../threading-model), Ice reaps a thread after it is idle for `num` seconds. Setting
this property to 0 disables idle thread reaping. If not specified, the default value is 60 seconds. See
[Ice.ThreadPool._name_.ThreadIdleTime](../ice-threadpool-properties) for more information.

# _adapter_.ThreadPool.ThreadPriority

#### Synopsis

`adapter.ThreadPool.ThreadPriority=value`

#### Description

`value` specifies a thread priority for the object adapter's [thread pool](../threading-model). The object adapter
creates its threads with the specified priority. Leaving this property unset causes the adapter to create threads with
the priority specified by [Ice.ThreadPool.Server.ThreadPriority](../ice-threadpool-properties) or, if that property is
unset, the priority specified by [Ice.ThreadPriority](../ice-properties).

`value` can be `Lowest`, `BelowNormal`, `Normal`, `AboveNormal`, or `Highest`.

{% /language-section %}
