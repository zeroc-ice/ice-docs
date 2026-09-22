---
id: reader
title: Reader
---

A **reader** represents the subscriber side of a DataStorm publish–subscribe application. You create readers to receive
data published by [writers](../writer).

Readers receive data [samples](../sample) from a specific topic. Each reader is associated with a single
[topic](../topic), but multiple readers can be created for the same topic. The reader’s `Key`, `Value`, and `UpdateTag`
template parameters must match the corresponding types of the topic from which it is created.

When a reader is created, DataStorm **notifies connected peers**. Writers whose configuration matches the reader (topic,
keys/filters) will **attach** so they can send samples to that reader.

You can optionally assign a **name** to a reader at creation time. This name is surfaced to writers and is used in
**listener notifications** (connected writers/keys).

Readers keep a **history (queue) of unread samples**. When samples are retrieved (e.g., with `getNextUnread` or
`getAllUnread`), they are removed from the queue.

## Reader Types

- **Single-key reader** — reads samples for a single key.
- **Multi-key reader** — reads samples for a set of predefined keys.
- **Any-key reader** — reads samples for any key (no keys provided at creation).
- **Filtered-key reader** — reads samples for keys matching a **key filter** (name + criteria value).

You create readers using the corresponding reader class constructors or via
[makeXxxReader](https://code.zeroc.com/ice/3.8/api/cpp/namespaceDataStorm.html#header-func-members) helper functions.
Using the `makeXxxReader` helpers lets the compiler **deduce template parameters** (`Key`, `Value`, `UpdateTag`) from
the topic.

### Attachment behavior

- Single-key: writers with the same key attach.
- Multi-key: writers attach if at least one of the reader’s keys matches.
- Any-key: all writers for the topic attach (since any key can be received).
- Filtered-key: writers attach if their key matches the reader’s key filter (name + criteria).

### Single-Key Reader

```cpp
// Constructor
Topic<string, float> temperatures{node, "temperatures"};
SingleKeyReader<string, float> reader{
    temperatures,
      "floor1/kitchen",
      "kitchen-reader"};
```

Or

```cpp
// Helper (template params deduced)
Topic<string, float> temperatures{node, "temperatures"};
auto reader = makeSingleKeyReader(temperatures, "floor1/kitchen", "kitchen-reader");
```

### Multi-Key Reader

```cpp
// Constructor
Topic<string, float> temperatures{node, "temperatures"};
MultiKeyReader<string, float> reader{
    temperatures,
    {"floor1/kitchen", "floor1/living-room"},
    "first-floor-reader"};
```

Or

```cpp
// Helper (template params deduced)
Topic<string, float> temperatures{node, "temperatures"};
auto reader = makeMultiKeyReader(
    temperatures,
    {"floor1/kitchen", "floor1/living-room"},
    "first-floor-reader");
```

### Any-Key Reader

```cpp
// Constructor: empty key set
Topic<string, float> temperatures{node, "temperatures"};
MultiKeyReader<string, float> reader{temperatures, {}, "temperature-reader"};
```

Or

```cpp
// Helper (template params deduced)
Topic<string, float> temperatures{node, "temperatures"};
auto reader = makeAnyKeyReader(temperatures, "temperature-reader");
```

### Filtered-Key Reader

```cpp
// Constructor
Topic<string, float> temperatures{node, "temperatures"};
FilteredKeyReader<string, float> reader{
    temperatures,
    Filter<string>("startsWith", "floor1/"),
    "temperature-reader"};
```

Or

```cpp
// Helper (template params deduced)
Topic<string, float> temperatures{node, "temperatures"};
auto reader = makeFilteredKeyReader(
    temperatures,
    Filter<string>("startsWith", "floor1/"),
    "temperature-reader");
```

## Sample Filters

All reader types support sample filtering. A reader specifies the sample filter (name + criteria), but the filter is
executed by the writer. This minimizes network usage: only samples matching the filter are sent. Unlike key filters
(which test only keys), sample filters can inspect the entire sample.

- The filter name must match a sample filter registered on the publisher’s topic.
- The criteria type must match the type used to register the filter; otherwise, the writer cannot unmarshal the
  criteria.

Example: receive temperatures greater than 26 °C:

```cpp
Topic<string, float> temperatures{node, "temperatures"};
auto reader = makeSingleKeyReader(
    temperatures,
    Filter<float>("greater-than", 26.0f),
    "floor1/kitchen",
    "kitchen-reader");
```

{% callout type="info" %}

Sample filters are specified on readers but must be defined on the writer’s topic. Criteria types can be any
[custom type](../custom-types) for which your application provides encoding/decoding templates.

{% /callout %}

## Reading Samples

Readers provide methods to retrieve unread samples:

- [getNextUnread](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Reader_abcc04c4d8b962f3d541b2086d998d0e1.html#abcc04c4d8b962f3d541b2086d998d0e1)
  — retrieves the next unread sample (removes it from the queue).
- [getAllUnread](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Reader_ab1b7e7d6a25c652d848d0d425cf4bddf.html#ab1b7e7d6a25c652d848d0d425cf4bddf)
  — retrieves all unread samples (removes them from the queue).
- [waitForUnread](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Reader_ae7b3fbe25f9eb33e15d3c4aebf7777ac.html#ae7b3fbe25f9eb33e15d3c4aebf7777ac)
  — blocks until the given number of unread samples are available.
- [hasUnread](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Reader_ab0a08e79d3a4eaf5dcb2facfba50d695.html#ab0a08e79d3a4eaf5dcb2facfba50d695)
  — checks if there are unread samples in the queue.

If the node is shutdown, blocking methods (e.g., `waitForUnread`, `getNextUnread`) throw
[NodeShutdownException](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1NodeShutdownException.html).

You can register a callback with
[onSamples](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Reader_ae800f5b1148ddd9adb10b8d3ded203ca.html#ae800f5b1148ddd9adb10b8d3ded203ca).
Once registered, if unread samples are already queued, the callback is invoked immediately with those samples. Callbacks
are executed by the node’s callback executor. By default, the executor uses a dedicated thread; you can supply a custom
executor via
[NodeOptions::customExecutor](https://code.zeroc.com/ice/3.8/api/cpp/structDataStorm_1_1NodeOptions_a3df111998db4f25bc2d877b0ac96ba20.html#a3df111998db4f25bc2d877b0ac96ba20)
when constructing the node.

## Reader Configuration

Reader behavior is configurable via
[DataStorm::ReaderConfig](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1ReaderConfig.html). You can set:

- **Global defaults** — [DataStorm.Topic.*](../datastorm-topic-properties) properties (e.g.,
  DataStorm.Topic.SampleCount)
- **Topic-level defaults** — by calling
  [Topic::setReaderDefaultConfig](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Topic_ae005c107f689e1e309e49a4c1421ed2a.html#ae005c107f689e1e309e49a4c1421ed2a)
- **Per-reader configuration** — via the reader constructor or or
  [makeXxxReader](https://code.zeroc.com/ice/3.8/api/cpp/namespaceDataStorm.html#r_a6959df6a3e35c9e37a4ed065757fc0fc)
  helper

**Precedence:** lower levels override higher ones (per-reader config > topic defaults > global properties).

### Options

#### Sample Count (sampleCount)

How many samples to keep in the unread queue. When the queue is full, the oldest samples are discarded. Default: keep
all samples.

#### Sample Lifetime (sampleLifetime)

How long to keep a sample in the unread queue. Samples older than this duration are automatically removed.

#### Clear History (`clearHistory`)

Controls when the reader’s unread sample queue is cleared, based on sample events
([ClearHistoryPolicy](https://code.zeroc.com/ice/3.8/api/cpp/namespaceDataStorm_a2c7845f01c34e16389d4e1fa54f30c05.html#a2c7845f01c34e16389d4e1fa54f30c05)):

- **OnAdd** — clears the unread queue after receiving an `Add` sample.
- **OnRemove** — clears the unread queue after receiving a `Remove` sample.
- **OnAll** — clears the queue after receiving any sample.
- **OnAllExceptPartialUpdate** — clears the queue after receiving any sample except a `PartialUpdate`.
- **Never** — never clears the queue automatically.

#### Discard Policy (discardPolicy)

Whether to discard samples on receipt of new samples
([DiscardPolicy](https://code.zeroc.com/ice/3.8/api/cpp/namespaceDataStorm_aea43ef98e7e3436abc965908aa19b473.html#aea43ef98e7e3436abc965908aa19b473)):

- **None**— never discard
- **SendTime**— discard if the new sample’s timestamp is older than the last received
- **Priority**— keep only samples from the highest-priority connected writers

### Coordination & Listeners

#### Coordination methods

- [hasWriters](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Reader_ae69539f596e0bc112d1bc941e029487b.html#ae69539f596e0bc112d1bc941e029487b)
  — checks whether any writers are currently connected.
- [waitForWriters](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Reader_a99b0977be1c023ea0a07a83b2a8c62b4.html#a99b0977be1c023ea0a07a83b2a8c62b4)
  — wait for writers to connect.
- [waitForNoWriters](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Reader_a38b41ff9bcebfb9f17edc4899be49ccb.html#a38b41ff9bcebfb9f17edc4899be49ccb)
  — blocks until all readers disconnect.
- [getConnectedKeys](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Reader_a03ef25596619a659835b4358b571ecb2.html#a03ef25596619a659835b4358b571ecb2)
  — returns the set of keys for which at least one writer is connected.
- [getConnectedWriters](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Reader_a239f6b4b40dc8ca97beb465f66c3b142.html#a239f6b4b40dc8ca97beb465f66c3b142)
  — returns the names of connected readers.

#### Connected Keys Listener

- Use
  [onConnectedKeys(initCallback, updateCallback)](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Reader_ab1257d44f1504f39994f865c6f096b79.html#ab1257d44f1504f39994f865c6f096b79)
  to register callbacks that monitor connected keys:

  - The `initCallback` is called immediately after registration with the initial set of connected keys.
  - The `updateCallback` is called whenever a key is connected or disconnected.

#### Connected Writers Listener

- Use
  [onConnectedWriters(initCallback, updateCallback)](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Reader_a141f030489315d97fa5c7464c32556a2.html#a141f030489315d97fa5c7464c32556a2)
  to register callbacks that monitor connected writers:

  - The `initCallback` is called immediately after registration with the initial set of connected readers.
  - The `updateCallback` is called whenever a reader connects or disconnects.
