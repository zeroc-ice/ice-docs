---
id: sample
title: Sample
---

A **sample** is the unit of data exchanged between DataStorm publishers and subscribers. It provides multiple data
members that can be accessed using getter methods. Each sample has three template parameters — `Key`, `Value`, and
`UpdateTag` — which are specified when a topic is created. All samples published to a topic must use the same `Key`,
`Value`, and `UpdateTag` types defined by that topic.

## Members

### Key

The **key** organizes the samples published to a topic. [Readers](../reader) can use keys to filter which samples they
want to receive, and [writers](../writer) can use keys to identify the source or category of the data. You can access
the key with the sample’s
[getKey](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Sample_afc5243abe0a81243fb1ecc2c893a66bd.html#afc5243abe0a81243fb1ecc2c893a66bd)
method.

### Value

The **value** is the application-domain data that writers publish and readers receive. It can be accessed using the
sample’s
[getValue](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Sample_a0664d2f1004fb9ed28be7b817d615b34.html#a0664d2f1004fb9ed28be7b817d615b34)
method.

If no value is available (for example, if the event is `Remove`), `getValue` returns a default-constructed value. You
should check the sample’s event type before calling `getValue()` to ensure the sample actually contains a value.

### Event

The **event** identifies the type of the sample and communicates lifecycle operations to subscribers. It can be obtained
using the
[getEvent](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Sample_aca41d274db507d8a0d107f01cde78094.html#aca41d274db507d8a0d107f01cde78094)
method, which returns a
[SampleEvent](https://code.zeroc.com/ice/3.8/api/cpp/namespaceDataStorm_a0a720b1634b84fcbd71aee7783934754.html#a0a720b1634b84fcbd71aee7783934754)
enumerator:

- **Add** — indicates a new value is being published.
- **Update** — indicates that an existing value has changed.
- **Remove** — indicates that the value has been removed and no value is included in the sample.
- **PartialUpdate** — indicates that the sample contains a partial update to the value.

For `Remove` samples, the value is a default-constructed instance. For `PartialUpdate` samples, the sample also provides
the **update tag**, which can be retrieved using `getUpdateTag()`.

The value returned by
[getValue](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Sample_a74a40504816052b2c489e1777e0064e0.html#a74a40504816052b2c489e1777e0064e0)
for a `PartialUpdate` event is the result of applying the updater associated with the tag returned by
[getUpdateTag](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Sample_a74a40504816052b2c489e1777e0064e0.html#a74a40504816052b2c489e1777e0064e0).
If no updater is registered for this tag, the partial update is ignored and the current value remains unchanged.

### Timestamp

The **timestamp** represents the time at which the sample was written. It is set by the writer when the sample is sent
and can be obtained with the
[getTimestamp](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Sample_ae7a7d2ed6a30461f1c80205dd2b11110.html#ae7a7d2ed6a30461f1c80205dd2b11110)
method, which returns a `std::chrono::time_point<std::chrono::system_clock>` value.

Timestamps are expressed in UTC and are independent of the system’s local time zone, making them suitable for exchanging
data between machines with different regional settings.

### Origin

The **origin** identifies the writer that created the sample. It can be obtained using the
[getOrigin](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Sample_a921bbfef9a9bb86197b7242eab276eda.html#a921bbfef9a9bb86197b7242eab276eda)
method. The origin corresponds to the name of the writer that published the sample.

### Session

The **session** identifies the connection between the two nodes that exchanged the sample. It can be obtained with the
[getSession](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Sample.html) method. This session identifier can
be passed to [Node::getSessionConnection](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Node.html) to
retrieve the corresponding [connection](https://code.zeroc.com/ice/3.8/api/cpp/classIce_1_1Connection.html) between the
two nodes.
