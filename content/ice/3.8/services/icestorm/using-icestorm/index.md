---
title: Using IceStorm
pages:
  - implementing-an-icestorm-publisher
  - using-an-icestorm-publisher-object
  - implementing-an-icestorm-subscriber
  - publishing-to-a-specific-subscriber
---

Now we'll expand on the earlier [weather monitoring example](..), and discuss how to create a publisher and a
subscriber.

## IceStorm API

Publishers, subscribers and administrative tools use the following operations of the
[TopicManager](https://code.zeroc.com/ice/3.8/api/slice/interfaceIceStorm_1_1TopicManager.html) and
[Topic](https://code.zeroc.com/ice/3.8/api/slice/interfaceIceStorm_1_1Topic.html) interfaces:

| Operation                                                 | Description                                                                                                        |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `TopicManager::createOrRetrieve`                          | Returns the topic with the given name, and creates this topic if it does not exist.                                |
| `TopicManager::create`                                    | Creates a topic, and throws `TopicExists` if a topic with this name exists.                                        |
| `TopicManager::retrieve`                                  | Returns an existing topic, and throws `NoSuchTopic` if no topic has this name.                                     |
| `TopicManager::retrieveAll`                               | Returns all the topics of the topic manager, keyed by name.                                                        |
| `Topic::getPublisher`, `Topic::getNonReplicatedPublisher` | Return the topic's [publisher object](./using-an-icestorm-publisher-object).                                       |
| `Topic::subscribeAndGetPublisher`                         | Subscribes a subscriber object, and returns its [per-subscriber publisher](./publishing-to-a-specific-subscriber). |
| `Topic::unsubscribe`                                      | Removes the subscription of a subscriber object.                                                                   |
| `Topic::getName`, `Topic::getSubscribers`                 | Return the name of the topic, and the identities of its subscribers.                                               |
| `Topic::link`, `Topic::unlink`, `Topic::getLinkInfoSeq`   | Create, destroy and list the links of a [federated](../topic-federation) topic.                                    |
| `Topic::destroy`                                          | Destroys the topic.                                                                                                |

## See Also

- [IceStorm](..)
