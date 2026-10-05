---
title: Default Servants
---

## Overview of Default Servants

The [Active Servant Map](../active-servant-map) (ASM) is a simple lookup table that maintains a one-to-one mapping
between object identities and servants. Although the ASM is easy to understand and offers efficient indexing, it does
not scale well when the number of objects is very large. Scalability is a common problem with object-oriented
middleware: servers frequently are used as front ends to large databases that are accessed remotely by clients. The
server's job is to present an object-oriented view to clients of a very large number of records in the database.
Typically, the number of records is far too large to instantiate servants for even a fraction of the database records.

A common technique for solving this problem is to use _default servants_. A default servant is a servant that, for each
request, takes on the persona of a different Ice object. In other words, the servant changes its behavior according to
the [object identity](../../object-identity) that is accessed by a request, on a per-request basis. In this way, it is
possible to allow clients access to an unlimited number of Ice objects with only a single servant in memory.

Default servant implementations are attractive not only because of the memory savings they offer, but also because of
the simplicity of implementation: in essence, a default servant is a facade [\[1\]](#references) to the persistent state
of an object in the database. This means that the programming required to implement a default servant is typically
minimal: it simply consists of the code required to read and write the corresponding database records.

A default servant is a regular servant that you implement and register with an [object adapter](..). For each incoming
request, the object adapter first attempts to locate a servant in its ASM. If no servant is found, the object adapter
dispatches the request to a default servant. With this design, a default servant is the object adapter's servant of last
resort if no match was found in the ASM.

Implementing a default servant requires a somewhat different mindset than the typical "one servant per Ice object"
strategy used in less advanced applications. The most important quality of a default servant is its statelessness: it
must be prepared to dispatch multiple requests simultaneously for different objects. The price we have to pay for the
unlimited scalability and reduced memory footprint is performance: default servants typically make a database access for
every invoked operation, which is obviously slower than caching state in memory as part of a servant that has been added
to the ASM. However, this does not mean that default servants carry an unacceptable performance penalty: databases often
provide sophisticated caching, so even though the operation implementations read and write the database, as long as they
access cached state, performance may be entirely acceptable.

## Default Servant API

The default servant API consists of the following methods on the object adapter class:

{% language-section name="mapping" /%}

As you can see, the object adapter allows you to add and remove default servants. Note that, when you register a default
servant, you must provide an argument for the `category` parameter. The value of the `category` parameter controls which
object identities the default servant is responsible for: only object identities with a matching `category` member
trigger a dispatch to this default servant. An incoming request for which no explicit entry exists in the ASM and with a
category for which no default servant is registered returns an `ObjectNotExistException` to the client.

`addDefaultServant` has the following semantics:

- You can register exactly one default servant for a specific category. Attempts to call `addDefaultServant` for the
  same category more than once raise an `AlreadyRegisteredException`.
- You can register different default servants for different categories, or you can register the same single default
  servant multiple times (each time for a different category). In the former case, the category is implicit in the
  default servant instance that is called by the Ice runtime; in the latter case, the servant can find out which
  category the incoming request is for by examining the object identity member of the `Current` object that is passed to
  the dispatched operation.
- It is legal to register a default servant for the empty category. Such a servant is used if a request comes in for
  which no entry exists in the ASM, and whose category does not match the category of any other registered default
  servant.

`removeDefaultServant` removes the default servant for the specified category. Attempts to remove a non-existent default
servant raise `NotRegisteredException`. The operation returns the removed default servant. Once a default servant is
successfully removed for the specified category, the Ice runtime guarantees that no new incoming requests for that
category are dispatched to the servant.

{% callout type="note" %}

Default servants have “servant” in their names, and are indeed often servants – concrete classes that dispatch requests
on their own.

Nevertheless, the servant aspect is unimportant: the dispatch pipeline that uses these default servants only cares about
dispatchers. Servants are just one particular kind of dispatchers, and you can actually use any kind of dispatcher as
default servants.

{% /callout %}

## Guidelines for Implementing Default Servants

This section provides some guidelines to assist you in implementing default servants effectively.

### Object Identity Is the Key

When an incoming request is dispatched to the default servant, the target object identity is provided in the `Current`
argument. The `name` field of the identity typically supplies everything the default servant requires in order to
satisfy the request. For instance, it may serve as the key in a database query.

Naturally, the client can also pass arguments to the operation that assist the default servant in retrieving whatever
state it requires. However, this approach can easily introduce implementation artifacts into your Slice interfaces, and
in most cases the client should not need to know that the server is implemented with a default servant. If at all
possible, use only the object identity.

### Minimize Contention

For better scalability, the default servant's implementation should strive to eliminate contention among the dispatch
threads. As an example, when a database holds the default servant's state, each of the servant's operations usually
begins with a query. Assuming that the database API is thread-safe, the servant needs to perform no explicit locking of
its own. With a copy of the state in hand, the implementation can work with function-local data to satisfy the request.

### Combine Strategies

The ASM still plays a useful role even in applications that are ideally suited for default servants. For example, there
is no need to implement a singleton object as a default servant: if there can only be one instance of the object,
implementing it as a default servant does nothing to improve your application's scalability.

Applications often install a handful of servants in the ASM while servicing the majority of requests in a default
servant. For example, a database application might install a singleton query object in the ASM while using a default
servant to process all invocations on the database records.

### Categories Denote Interfaces

In general, all of the objects serviced by a default servant must have the same interface. If you only need a default
servant for one interface, you can register the default servant with an empty category string. However, to implement
several interfaces, you will need a default servant implementation for each one. Furthermore, you must take steps to
ensure that the object adapter dispatches an incoming request to the appropriate default servant. The `category` field
of the object identity is intended to serve this purpose.

For example, a process control system might have interfaces named `Sensor` and `Switch`. To direct requests to the
proper default servant, the application uses the strings `Sensor` or `Switch` as the category of each object's identity,
and registers corresponding default servants having those same categories with the object adapter.

### Plan for the Future

If you suspect that you might eventually need to implement more than one interface with default servants, we recommend
using a non-empty category even if you start out having only one default servant. Adding another default servant later
becomes much easier if the application is already designed to operate correctly with categories.

### Throw Exceptions

If a request arrives for an object that no longer exists, it is the default servant's responsibility to throw
`ObjectNotExistException`.

## See Also

- [The Active Servant Map](../active-servant-map)
- [Object Identity](../../object-identity)
- [Object Adapters](..)
- [The Ice Threading Model](../../threading-model)

## References

1. Gamma, E., et al. 1994.
   [Design Patterns](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612). Reading,
   MA: Addison-Wesley.
