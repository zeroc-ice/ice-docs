---
title: The Active Servant Map
---

Each object adapter maintains a data structure known as the active servant map.

## Role of the Active Servant Map

The _active servant map_ (or _ASM_, for short) is a lookup table that maps object identities to servants: the key is an
identity and facet, and the value is the associated servant.

In most servers, the ASM is the main component of the [dispatch pipeline](../dispatch-pipeline):

![The client proxy contains endpoint 212.8.7.33 and identity Joe. The request reaches the server object adapter, whose active servant map associates Fred, Joe, and Carl with servants. The highlighted Joe entry selects the matching servant.](/images/ice/3.8/active-servant-map/binding-request-to-servant.svg)

_Dispatching a request to the correct servant._

## Design Considerations for the Active Servant Map

Using an adapter's ASM to map Ice objects to servants has a number of design implications:

- Each Ice object is represented by a different servant.

{% callout type="info" %}

It is possible to register a single servant with multiple identities. However, there is little point in doing so because
a [default servant](../default-servants) achieves the same thing.

{% /callout %}

- All servants for all Ice objects are permanently in memory.

Using a separate servant for each Ice object in this fashion is common to many server implementations: the technique is
simple to implement and provides a natural mapping from Ice objects to servants. Typically, on start-up, the server
instantiates a separate servant for each Ice object, activates each servant, and then calls `activate` on the object
adapter to start the flow of requests.

There is nothing wrong with the above design, provided that two criteria are met:

1. The server has sufficient memory available to keep a separate servant instantiated for each Ice object at all times.
2. The time required to initialize all the servants on start-up is acceptable.

For many servers, neither criterion presents a problem: provided that the number of servants is small enough and that
the servants can be initialized quickly, this is a perfectly acceptable design. However, the design does not scale well:
the memory requirements of the server grow linearly with the number of Ice objects so, if the number of objects gets too
large (or if each servant stores too much state), the server runs out of memory.

## Servant Activation and Deactivation

The term _servant activation_ refers to making the presence of a servant for a particular Ice object known to the object
adapter. Activating a servant adds an entry to the Active Servant Map (ASM). Another way of looking at servant
activation is to think of it as creating a link between the [identity](../../object-identity) and facet of an Ice object
and the corresponding programming-language servant that handles requests for that Ice object. Once the object adapter’s
dispatch pipeline has knowledge of this link, it can dispatch incoming requests to the correct servant. Without this
link, that is, without a corresponding entry in the ASM, an incoming request for the identity results in an
`ObjectNotExistException`. While a servant is activated, it is said to _incarnate_ the corresponding Ice object.

The inverse operation is known as _servant deactivation_. Deactivating a servant removes an entry for a particular
identity from the ASM. Thereafter, incoming requests for that identity are no longer dispatched to the servant and
result in an `ObjectNotExistException`.

The object adapter offers a number of methods for managing servant activation and deactivation. We’ll focus on the most
important ones:

{% language-section name="lang-1" /%}

- `add` The `add` method adds a servant with the given identity (and empty facet) to the ASM. Requests are dispatched to
  that servant as soon as `add` is called. The return value is the proxy for the Ice object incarnated by that servant.
  The proxy embeds the identity passed to `add`.

  You cannot call `add` with the same identity more than once: attempts to add an already existing identity to the ASM
  result in an `AlreadyRegisteredException`. (It does not make sense to add two servants with the same identity because
  that would make it ambiguous as to which servant should handle incoming requests for that identity.)

  Note that it is possible to activate the same servant multiple times with different identities. In that case, the same
  single servant incarnates multiple Ice objects.

- `addWithUUID` The `addWithUUID` method behaves the same way as the `add` method but does not require you to supply an
  identity for the servant. Instead, `addWithUUID` generates a UUID as the identity for the corresponding Ice object.
  You can retrieve the generated identity by calling the `ice_getIdentity` method on the returned proxy. `addWithUUID`
  is useful to create identities for temporary objects, such as short-lived session objects, or for persistent objects
  that do not have a natural identity.
- `remove` The `remove` method breaks the association between an identity and its servant by removing the corresponding
  entry from the ASM; it returns a reference to the removed servant. Once the servant is deactivated, new incoming
  requests for the removed identity cause the client to receive an `ObjectNotExistException`. Requests that are
  executing inside the servant at the time `remove` is called are allowed to complete normally. Deactivating an
  [object adapter](../object-adapter-activation-and-deactivation) implicitly calls `remove` on all its servants.

{% callout type="info" %}

The Active Servant Map has “servant” in its name, and uses the term servant in parameter and method names. And indeed,
the objects added to the ASM are often servants.

Nevertheless, the servant aspect is unimportant: the dispatch pipeline that uses the ASM only cares about dispatchers.
Servants are just one particular kind of dispatchers, and you can actually add any kind of dispatcher to the ASM.

{% /callout %}

## See Also

- [Default Servants](../default-servants)
