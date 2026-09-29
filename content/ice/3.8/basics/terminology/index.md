---
title: Terminology
---

Every computing technology creates its own vocabulary as it evolves. Ice is no exception. However, the amount of new
jargon used by Ice is minimal. Rather than inventing new terms, we have used existing terminology as much as possible.
If you have used another RPC framework in the past, you will be familiar with much of what follows. (However, we suggest
you at least skim the material because a few terms used by Ice _do_ differ from the corresponding terms used by other
RPC frameworks.)

# Clients and Servers

The terms _client_ and _server_ are not firm designations for particular parts of an application; rather, they denote
roles that are taken by parts of an application for the duration of a request:

- Clients are active entities. They issue requests for service to servers.
- Servers are passive entities. They provide services in response to client requests.

Frequently, servers are not "pure" servers, in the sense that they never issue requests and only respond to requests.
Instead, servers often act as a server on behalf of some client but, in turn, act as a client to another server in order
to satisfy their client's request.

Similarly, clients often are not "pure" clients, in the sense that they only request service from an object. Instead,
clients are frequently client-server hybrids. For example, a client might start a long-running operation on a server; as
part of starting the operation, the client can provide a _callback object_ to the server that is used by the server to
notify the client when the operation is complete. In that case, the client acts as a client when it starts the
operation, and as a server when it is notified that the operation is complete.

Such role reversal is common in many systems, so, frequently, client-server systems could be more accurately described
as _peer-to-peer_ systems.

# Ice Objects

An _Ice object_ is a conceptual entity, or abstraction. An Ice object can be characterized by the following points:

- An Ice object is an entity in the local or a remote address space that can respond to client requests.
- A single Ice object can be instantiated in a single server or, redundantly, in multiple servers. If an object has
  multiple simultaneous instantiations, it is still a single Ice object.
- Each Ice object has one or more _interfaces_. An interface is a collection of named _operations_ that are supported by
  an object. Clients issue requests by invoking operations.
- An operation has zero or more _parameters_ as well as a _return value_. Parameters and return values have a specific
  _type_. Parameters are named and have a direction: in-parameters are initialized by the client and passed to the
  server; out-parameters are initialized by the server and passed to the client. (The return value is simply a special
  out-parameter.)
- An Ice object has a distinguished interface, known as its _main interface_. In addition, an Ice object can provide
  zero or more alternate interfaces, known as _facets_. Clients can select among the facets of an object to choose the
  interface they want to work with.
- Each Ice object has a unique _object identity_. An object's identity is an identifying value that distinguishes the
  object from other objects. It’s comparable to a URI path. These identities don’t need to be globally unique - they
  just need to be unique enough for your application. The Ice runtime occasionally assumes two objects with the same
  identity are the same, regardless of other addressing information. For example, the Ice runtime considers that two
  Locators with the same identity are identical, or replica of one another, even when they are hosted on different
  servers.

# Proxies

For a client to be able to contact an Ice object, the client must hold a _proxy_ for the Ice object. A proxy is an
artifact that is local to the client's address space; it represents the (possibly remote) Ice object for the client. A
proxy acts as the local ambassador for an Ice object: when the client invokes an operation on the proxy, the Ice
runtime:

1. Locates the Ice object
2. Activates the Ice object's server if it is not running
3. Activates the Ice object within the server
4. Transmits any in-parameters to the Ice object
5. Waits for the operation to complete
6. Returns any out-parameters and the return value to the client (or throws an exception in case of an error)

A proxy encapsulates all the necessary information for this sequence of steps to take place. In particular, a proxy
contains:

- Addressing information that allows the client-side runtime to contact the correct server
- An object identity that identifies which particular object in the server is the target of a request
- An optional facet identifier that determines which particular facet of an object the proxy refers to

# Invocation and Dispatch

The process of calling an operation on an Ice object using a proxy is called an _invocation_. The invocation encompasses
all the client-side activity related to this call: creating the request to send to the server, establishing the
connection to the server (if needed), unmarshaling the return value from the response, and more.

On the other end, the processing of an incoming request is called a _dispatch_. A dispatch accepts an incoming request,
unmarshals its payload, calls into application code, and eventually returns a response.

# Stringified Proxies

The information in a proxy can be expressed as a string. For example, the string:

```text
SimplePrinter:tcp -p 10000
```

is a human-readable representation of a proxy. The Ice runtime provides API calls that allow you to convert a proxy to
its stringified form and vice versa. This is useful, for example, to store proxies in database tables or text files.

Provided that a client knows the identity of an Ice object and its addressing information, it can create a proxy "out of
thin air" by supplying that information. In other words, no part of the information inside a proxy is considered opaque;
a client needs to know only an object's identity, addressing information, and (to be able to invoke an operation) the
object's type in order to contact the object.

# Direct Proxies

A _direct proxy_ is a proxy that embeds an object's identity, together with the address at which its server runs. The
address is completely specified by:

- a transport identifier (such TCP/IP or UDP)
- a transport-specific address (such as a host name and port number)

To contact the object denoted by a direct proxy, the Ice runtime uses the addressing information in the proxy to contact
the server; the identity of the object is sent to the server with each request made by the client.

# Indirect Proxies

An _indirect proxy_ has two forms. It may provide only an object's identity, or it may specify an identity together with
an object adapter identifier. An object that is accessible using only its identity is called a well-known object, and
the corresponding proxy is a [well-known proxy](../well-known-proxy). For example, the string:

```text
SimplePrinter
```

is a [valid proxy for a well-known object](../well-known-proxy) with the identity `SimplePrinter`.

An indirect proxy that includes an object adapter identifier has the stringified form

```text
SimplePrinter@PrinterAdapter
```

Any object of the object adapter can be accessed using such a proxy, regardless of whether that object is also a
well-known object.

Notice that an indirect proxy contains no addressing information. To determine the correct server, the client-side
runtime passes the proxy information to a [location service](../locators). In turn, the location service uses the object
identity or the object adapter identifier as the key in a lookup table that contains the address of the server and
returns the current server address to the client. The client-side runtime now knows how to contact the server and
dispatches the client request as usual.

The entire process is similar to the mapping from Internet domain names to IP address by the Domain Name Service (DNS):
when we use a domain name, such as `zeroc.com`, to look up a web page, the host name is first resolved to an IP address
behind the scenes and, once the correct IP address is known, the IP address is used to connect to the server. With Ice,
the mapping is from an object identity or object adapter identifier to a transport-address pair, but otherwise very
similar. The client-side runtime knows how to contact the location service via configuration (just as web browsers know
which DNS server to use via configuration).

# Direct Versus Indirect Binding

The process of resolving the information in a proxy to transport-address pair is known as _binding_. Not surprisingly,
_direct binding_ is used for direct proxies, and _indirect binding_ is used for indirect proxies.

The main advantage of indirect binding is that it allows us to move servers around (that is, change their address)
without invalidating existing proxies that are held by clients. In other words, direct proxies avoid the extra lookup to
locate the server but no longer work if a server is moved to a different machine. On the other hand, indirect proxies
continue to work even if we move (or _migrate_) a server.

# Fixed Proxies

A _fixed proxy_ is a proxy that is bound to a particular connection: instead of containing addressing information or an
adapter ID, the proxy contains a connection handle. The connection handle stays valid only for as long as the connection
stays open so, once the connection is closed, the proxy no longer works (and will never work again). Fixed proxies
cannot be marshaled, that is, they cannot be passed as parameters on operation invocations. Fixed proxies are used to
allow [bidirectional communication](../bidirectional-connections), so a server can make callbacks to a client without
having to open a new connection.

# Routed Proxies

A _routed proxy_ is a proxy that forwards all invocations to a specific target object, instead of sending invocations
directly to the actual target. Routed proxies are useful for implementing services such as [Glacier2](../glacier2),
which enables clients to communicate with servers that are behind a firewall.

# Replication

In Ice, _replication_ involves making object adapters (and their objects) available at multiple addresses. The goal of
replication is usually to provide redundancy by running the same server on several computers. If one of the computers
should happen to fail, a server still remains available on the others.

The use of replication implies that applications are designed for it. In particular, it means a client can access an
object via one address and obtain the same result as from any other address. Either these objects are stateless, or
their implementations are designed to synchronize with a database (or each other) in order to maintain a consistent view
of each object's state.

Ice supports a limited form of replication when a proxy specifies multiple addresses for an object. The Ice runtime
selects one of the addresses at random for its [initial connection attempt](../connection-establishment) and tries all
of them in the case of a failure. For example, consider this proxy:

```text
SimplePrinter:tcp -h server1 -p 10001:tcp -h server2 -p 10002
```

The proxy states that the object with identity `SimplePrinter` is available using TCP at two addresses, one on the host
`server1` and another on the host `server2`. The burden falls to users or system administrators to ensure that the
servers are actually running on these computers at the specified ports.

# Replica Groups

In addition to the proxy-based replication described above, Ice supports a more useful form of replication known as
_replica groups_ that requires the use of a [location service](../locators).

A replica group has a unique identifier and consists of any number of object adapters. An object adapter may be a member
of at most one replica group; such an adapter is considered to be a _replicated object adapter_.

After a replica group has been established, its identifier can be used in an indirect proxy in place of an adapter
identifier. For example, a replica group identified as `PrinterAdapters` can be used in a proxy as shown below:

```text
SimplePrinter@PrinterAdapters
```

The replica group is treated by the location service as a "virtual object adapter." The behavior of the location service
when resolving an indirect proxy containing a replica group id is an implementation detail. For example, the location
service could decide to return the addresses of all object adapters in the group, in which case the client's Ice runtime
would select one of the addresses at random using the limited form of replication discussed earlier. Another possibility
is for the location service to return only one address, which it decided upon using some heuristic.

Regardless of the way in which a location service resolves a replica group, the key benefit is indirection: the location
service as a middleman can add more intelligence to the binding process.

# Dispatcher

A dispatcher is a programming language abstraction for [dispatch](../terminology#invocation-and-dispatch): a dispatcher
simply accepts a request and returns the corresponding response.

# Servants

As we mentioned, an [Ice Object](../terminology#ice-objects) is a conceptual entity that has a type, identity, and
addressing information. However, client requests ultimately must end up with a concrete server-side processing entity
that can provide the behavior for an operation invocation. To put this differently, a client request must ultimately end
up executing code inside the server, with that code written in a specific programming language and executing on a
specific processor.

The server-side artifact that provides this behavior is known as a _servant_. A servant provides substance for (or
_incarnates_) one or more Ice objects. It’s also a [Dispatcher](../terminology#dispatcher).

In practice, a servant is simply an instance of a class that is written by the server developer and that is registered
with the server-side runtime as the servant for one or more Ice objects. Methods on the class correspond to the
operations on the Ice object's interface and provide the behavior for the operations.

A single servant can incarnate a single Ice object at a time or several Ice objects simultaneously. If the former, the
identity of the Ice object incarnated by the servant is implicit in the servant. If the latter, the servant is provided
the identity of the Ice object with each request, so it can decide which object to incarnate for the duration of the
request.

Conversely, a single Ice object can have multiple servants. For example, we might choose to create a proxy for an Ice
object with two different addresses for different machines. In that case, we will have two servers, with each server
containing a servant for the same Ice object. When a client invokes an operation on such an Ice object, the client-side
runtime sends the request to exactly one server. In other words, multiple servants for a single Ice object allow you to
build redundant systems: the client-side runtime attempts to send the request to one server and, if that attempt fails,
sends the request to the second server. An error is reported back to the client-side application code only if that
second attempt also fails.

# At-Most-Once Semantics

Ice requests have _at-most-once_ semantics: the Ice runtime does its best to deliver a request to the correct
destination and, depending on the exact circumstances, may retry a failed request. Ice guarantees that it will either
deliver the request, or, if it cannot deliver the request, inform the client with an appropriate exception; under no
circumstances is a request delivered twice, that is, retries are attempted only if it is known that a previous attempt
definitely failed.

{% callout type="info" %}

One exception to this rule are datagram invocations over UDP transports. For these, duplicated UDP packets can lead to a
violation of at-most-once semantics.

{% /callout %}

At-most-once semantics are important because they guarantee that operations that are not _idempotent_ can be used
safely. An idempotent operation is an operation that, if executed twice, has the same effect as if executed once. For
example, `x = 1;` is an idempotent operation: if we execute the operation twice, the end result is the same as if we had
executed it once. On the other hand, `x++;` is not idempotent: if we execute the operation twice, the end result is not
the same as if we had executed it once.

Without at-most-once semantics, we can build distributed systems that are more robust in the presence of network
failures. However, realistic systems require non-idempotent operations, so at-most-once semantics are a necessity, even
though they make the system less robust in the presence of network failures. Ice permits you to mark individual
operations as idempotent. For such operations, the Ice runtime uses a more aggressive error recovery mechanism than for
non-idempotent operations.

# Asynchronous Method Invocation

Ice supports _asynchronous method invocation_ (AMI) in most languages. A client can invoke operations _asynchronously_,
which means the client's calling thread does not block while waiting for the invocation to complete. The client passes
the normal parameters and, depending on the language mapping, might also pass a callback that the client-side runtime
invokes upon completion, or the invocation might return a future that the client can eventually use to obtain the
results. The `await` style is also a form of AMI.

# Synchronous Method Invocation

Ice also supports _synchronous method invocation_ (SMI) in some languages. In languages with async/await support, you
should use only AMI, even when Ice supports SMI for backwards compatibility.

The request invocation model used by Ice is a synchronous remote procedure call: an operation invocation behaves like a
local procedure call, that is, the client thread is suspended for the duration of the call and resumes when the call
completes (and all its results are available).

The server cannot distinguish an asynchronous invocation from a synchronous one — either way, the server simply sees
that a client has invoked an operation on an object.

# Asynchronous Method Dispatch

_Asynchronous method dispatch (AMD)_ is the server-side equivalent of AMI. For synchronous dispatch (the default), the
server-side runtime calls into the application code to process a request received from a client. While the operation is
executing (or sleeping, for example, because it is waiting for data), a thread of execution is tied up in the server;
that thread is released only when the operation completes.

With asynchronous method dispatch, the server-side application code is informed of the arrival of a request. However,
instead of being forced to process the request immediately, the server-side application can choose to delay processing
of the request and, in doing so, releases the execution thread for the request. The server-side application code is now
free to do whatever it likes. Eventually, once the results of the operation are available, the server-side application
code makes an API call to inform the server-side Ice runtime that a request that was dispatched previously is now
complete; at that point, the results of the operation are returned to the client.

Synchronous and asynchronous method dispatch are transparent to the client, that is, the client cannot tell whether a
server chose to process a request synchronously or asynchronously.

# Properties

Much of the Ice runtime is configurable via [_properties_](../properties-and-configuration). Properties are name-value
pairs, such as `Ice.Default.Protocol=tcp`. Properties are typically stored in text files and parsed by the Ice runtime
to configure various options, such as the thread pool size, the level of tracing, and various other configuration
parameters.

##### See Also

- [The Slice Language](../slice)
- [The Ice Runtime](../runtime)
