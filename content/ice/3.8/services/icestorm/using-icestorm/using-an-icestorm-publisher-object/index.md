---
title: Using an IceStorm Publisher Object
---

Each topic creates a publisher object for the express purpose of publishing messages. It is a special object in that it
implements an Ice interface that allows the object to receive and forward requests (i.e., IceStorm messages) without
requiring knowledge of the operation types.

## Type Safety Considerations for the Publisher Object

`Topic::getPublisher` returns an untyped proxy to the topic's publisher object, and the publisher creates a proxy of the
expected interface from it. The publisher object forwards every request it receives to the subscribers without checking
the operation or its parameters. A type mismatch between the publisher and a subscriber shows up only when the
subscriber dispatches the request; for a subscriber registered with a twoway proxy, IceStorm treats the resulting
exception as a delivery failure. The publisher itself is never notified: a twoway invocation on the publisher object
completes once the publisher object has queued the message, whatever happens during delivery. It is up to you to ensure
that publishers and subscribers use the same Slice interface.

## Publish Using Oneway or Twoway Invocations?

IceStorm messages are unidirectional, but publishers may use either oneway or twoway invocations when sending messages
to the publisher object. Each invocation style has advantages and disadvantages that you should consider when deciding
which one to use. The differences between the invocation styles affect a publisher in four ways:

- Efficiency Oneway invocations have the advantage in efficiency because the Ice run time in the publisher does not
  await a reply to each message (and, of course, no reply is sent by IceStorm on the wire).

- Ordering The use of oneway invocations by a publisher may affect the order in which subscribers receive messages. If
  ordering is important, use twoway invocations with a [reliability QoS](../../icestorm-quality-of-service) of
  `ordered`, or use a single thread in the subscriber.

- Reliability [Oneway invocations can be lost](../../../../runtime/invocation/invocation-mode/oneway-invocations) under
  certain circumstances, even when they are sent over a reliable transport such as TCP. If the loss of messages is
  unacceptable, or you are unable to address the potential causes of lost oneway messages, then twoway invocations are
  recommended.

- Delays A publisher may experience network-related delays when sending messages to IceStorm if subscribers are slow in
  processing messages. Twoway invocations are more susceptible to these delays than oneway invocations.

## Selecting a Transport for the Publisher Object

Each publisher can select its own transport for message delivery, therefore the transport used by a publisher to
communicate with IceStorm has no effect on how IceStorm delivers messages to its subscribers.

For example, a publisher can use a UDP transport if the possibility of lost messages is acceptable (and if IceStorm
provides a UDP endpoint to publishers). However, the TCP or SSL transports are generally recommended for IceStorm's
publisher endpoint in order to ensure that published messages are delivered reliably to IceStorm, even if they may not
be delivered reliably to some subscribers.

## Using Request Contexts with the Publisher Object

A [request context](../../../../runtime/invocation/request-contexts) is an optional argument of all remote invocations.
If a publisher supplies a request context when publishing a message, IceStorm will forward it intact to subscribers.

Services such as [Glacier2](../../../glacier2/how-glacier2-uses-request-contexts) employ request contexts to provide
applications with more control over the service's behavior.

## See Also

- [IceStorm Quality of Service](../../icestorm-quality-of-service)
- [Oneway Invocations](../../../../runtime/invocation/invocation-mode/oneway-invocations)
- [Request Contexts](../../../../runtime/invocation/request-contexts)
- [How Glacier2 Uses Request Contexts](../../../glacier2/how-glacier2-uses-request-contexts)
- [Batched Invocations](../../../../runtime/invocation/invocation-mode/batched-invocations)
