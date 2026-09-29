---
title: IceStorm Concepts
---

## Message

An IceStorm _message_ is strongly typed and is represented by an invocation of a Slice operation: the operation name
identifies the type of the message, and the operation parameters define the message contents. A message is published by
invoking the operation on an IceStorm proxy in the normal fashion. Similarly, subscribers receive the message as a
regular operation dispatch. As a result, IceStorm uses the "push" model for message delivery; polling is not supported.

## IceStorm Topics

An application indicates its interest in receiving messages by subscribing to a _topic_. An IceStorm server supports any
number of topics, which are created dynamically and distinguished by unique names. Each topic can have multiple
publishers and subscribers.

A topic is essentially equivalent to an application-defined Slice interface: the operations of the interface define the
types of messages supported by the topic. A publisher uses a proxy for the topic interface to send its messages, and a
subscriber implements the topic interface in order to receive the messages. This is no different than if the publisher
and subscriber were communicating directly in the traditional client-server style; the interface represents the contract
between the client (the publisher) and the server (the subscriber), except IceStorm transparently forwards each message
to multiple recipients.

IceStorm does not verify that publishers and subscribers are using compatible interfaces, therefore applications must
ensure that topics are used correctly.

## Unidirectional Messages

IceStorm messages are [unidirectional](../oneway-invocations), that is, they must have `void` return type, cannot have
out-parameters, and cannot raise user exceptions. It follows that a publisher cannot receive replies from its
subscribers. Any of the Ice transports (TCP, SSL, UDP, etc.) can be used to publish and receive messages.

## Federation

IceStorm supports the formation of topic graphs, also known as [federation](../topic-federation). A topic graph is
formed by creating links between topics, where a _link_ is a unidirectional association from one topic to another. Each
link has a _cost_ that may restrict message delivery on that link. A message published on a topic is also published on
all of the topic's links for which the message cost does not exceed the link cost.

Once a message has been published on a link, the receiving topic publishes the message to its subscribers, but does not
publish it on any of its links. In other words, IceStorm messages propagate at most one hop from the originating topic
in a federation.

The following figure presents an example of topic federation. Topic T1 has links to T2 and T3, as indicated by the
dotted arrows. Solid arrows show publishers sending messages to topics and topics delivering messages to subscribers.
The subscribers S1 and S2 receive all messages published on T2, as well as those published on T1. Subscriber S3 receives
messages only from T1, and S4 receives messages from both T3 and T1.

This section discusses several concepts that are important for understanding IceStorm's capabilities.

![Publisher P1 publishes to T2, P2 to T1, and P3 to T3. T1 has dotted links to T2 and T3. Solid arrows show delivery from publishers to topics and from T1 to S3, T2 to S1 and S2, and T3 to S4.](/attachments/3.8/icestorm-concepts/topic-federation.svg)

IceStorm makes no attempt to prevent a subscriber from receiving duplicate messages. For example, if a subscriber is
subscribed to both T2 and T3, then it would receive two requests for each message published on T1.

## Quality of Service

IceStorm allows each subscriber to specify its own [_quality of service_](../icestorm-quality-of-service) (QoS)
parameters that affect the delivery of its messages. Quality of service parameters are represented as a dictionary of
name-value pairs.

## Replication

IceStorm supports [replication](../highly-available-icestorm) to provide higher availability for publishers and
subscribers.

## Persistent Mode

IceStorm's default behavior maintains information about topics, links, and subscribers in a database. However, a message
sent via IceStorm is not stored persistently, but rather is discarded as soon as it is delivered to the topic's current
set of subscribers. If an error occurs during delivery to a subscriber, IceStorm does not queue messages for that
subscriber.

## Transient Mode

IceStorm can optionally run in a fully transient mode in which no database is required. Replication is not supported in
this mode.

## Subscriber Errors

IceStorm automatically removes a subscription from a topic if a subscriber failure occurs while attempting to deliver a
message. For example, IceStorm may be unable to establish a connection to the subscriber using the proxy that the
subscriber provided, meaning the subscriber is not currently active at the proxy's endpoints, or those endpoints are
inaccessible to IceStorm. Another common failure scenario is a subscriber that allows an exception to propagate back to
IceStorm. This is important if you make changes to a Slice data type or operation signature: if you do, you must ensure
that both publishers and subscribers use the same Slice definitions; if you do not, the subscriber is likely to
encounter marshaling errors when receiving an event from IceStorm with a mismatched Slice definition. If the subscriber
allows this error to propagate back to IceStorm, its subscription will be canceled.

{% callout type="info" %}

Use the `retryCount` [quality of service](../icestorm-quality-of-service) parameter to configure IceStorm's behavior in
error situations.

{% /callout %}

## See Also

- [Topic Federation](../topic-federation)
- [IceStorm Quality of Service](../icestorm-quality-of-service)
- [Configuring IceStorm](../configuring-icestorm)
