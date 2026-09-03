---
id: writer
title: Writer
---

A **writer** represents the publisher side of a DataStorm publish–subscribe application. Writers are responsible for publishing the data that readers will receive.

A writer publishes **data samples** to a specific topic. Each writer is associated with a single topic, but multiple writers can be created for the same topic. The writer’s `Key`, `Value`, and `UpdateTag` template parameters must match the corresponding types of the topic from which it is created.

When a writer is created, DataStorm **notifies connected peers**. Readers whose configuration matches the writer (topic, or keys) will **attach** so they can receive samples from that writer.

You can optionally assign a **name** to a writer at creation time. This name is visible to readers and is used in **listener notifications** (for connected writers or keys).

Writers maintain a **history queue** of samples they have published. Depending on the reader configuration, this history—or part of it—may be transmitted to readers when they connect.

## Writer Types

- **Single-key writer** — publishes samples for a single key.
- **Multi-key writer** — publishes samples for a set of predefined keys.
- **Any-key writer** — publishes samples for any key (no keys provided at creation).

Writers can be created using the corresponding writer class constructors or the [makeXxxWriter](https://code.zeroc.com/ice/3.8/api/cpp/namespaceDataStorm.html#header-func-members) helper functions. When using the helper functions, the compiler automatically **deduces the template parameters** (`Key`, `Value`, and `UpdateTag`) from the topic.

### Attachment behavior

- **Single-key** — attaches to readers that contain the same key, or to filtered readers whose filter matches that key.
- **Multi-key** — attaches to readers whose configuration matches at least one of the writer’s keys, or to filtered readers whose filter matches any of those keys.
- **Any-key** — attaches to all readers of the topic, since any key can be published.

### Single-Key Writer

```cpp
// Constructor
Topic<string, float> temperatures{node, "temperatures"};
SingleKeyWriter<string, float> writer{
    temperatures,
    "floor1/kitchen",
    "kitchen-writer"};
```

Or

```cpp
// Helper (template params deduced)
Topic<string, float> temperatures{node, "temperatures"};
auto writer = makeSingleKeyWriter(
    temperatures,
    "floor1/kitchen",
    "kitchen-writer");
```

### Multi-Key Writer

```cpp
// Constructor
Topic<string, float> temperatures{node, "temperatures"};
MultiKeyWriter<string, float> writer{
    temperatures,
    {"floor1/kitchen", "floor1/living-room"},
    "first-floor-writer"};
```

Or

```cpp
// Helper (template params deduced)
Topic<string, float> temperatures{node, "temperatures"};
auto writer = makeMultiKeyWriter(
    temperatures,
    {"floor1/kitchen", "floor1/living-room"},
    "first-floor-writer");
```

### Any-Key Writer

```cpp
// Constructor: empty key set
Topic<string, float> temperatures{node, "temperatures"};
MultiKeyWriter<string, float> writer{temperatures, {}, "temperature-writer"};
```

Or

```cpp
// Helper (template params deduced)
Topic<string, float> temperatures{node, "temperatures"};
auto writer = makeAnyKeyWriter(temperatures, "temperature-writer");
```

## Publishing Samples

Writers are responsible for publishing data samples to a topic.

### Single-Key Writer

A [SingleKeyWriter](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1SingleKeyWriter.html) provides the following methods for publishing samples:

- [add](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1SingleKeyWriter_a3441b7234671e1c338bd27a8d09822ea.html#a3441b7234671e1c338bd27a8d09822ea) — publishes an `Add` sample.
- [update](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1SingleKeyWriter_a38009d0e379b141df95c5d01ea0af4bc.html#a38009d0e379b141df95c5d01ea0af4bc) — publishes an `Update` sample.
- [remove](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1SingleKeyWriter_a7182bcef3f036a23ff1d485863a2835b.html#a7182bcef3f036a23ff1d485863a2835b) — publishes a `Remove` sample (no value is included).
- [partialUpdate](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1SingleKeyWriter_a11c59d7511e2728cf6e9a2a52c6ee4bc.html#a11c59d7511e2728cf6e9a2a52c6ee4bc) — returns a function that can be used to publish *partial update* samples for a given update tag.

```cpp
Topic<string, float> temperatures{node, "temperatures"};
SingleKeyWriter<string, float> writer{
    temperatures,
    "floor1/kitchen",
    "kitchen-writer"};

// Publish an Add sample
writer.add(21.0f);

// Publish an Update sample
writer.update(20.0f);

// Publish a Remove sample. Remove samples don’t include a value
writer.remove();
```

### Multi-Key and Any-Key Writers

The [MultiKeyWriter](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1MultiKeyWriter.html)—used for both multi-key and any-key writers—provides the same four methods, but they take an additional key parameter.

- [add](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1MultiKeyWriter_a2b3d80c7e87ca94114e2554c8bc281e6.html#a2b3d80c7e87ca94114e2554c8bc281e6) — publishes an Add sample for the given key.
- [update](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1MultiKeyWriter_a9689decc507ce2168f975043b45f4fcf.html#a9689decc507ce2168f975043b45f4fcf) — publishes an Update sample for the given key.
- [remove](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1MultiKeyWriter_a5e1bea6de396895bd1ed5abd9f1da675.html#a5e1bea6de396895bd1ed5abd9f1da675) — publishes a Remove sample for the given key.
- [partialUpdate](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1MultiKeyWriter_a0a70db44d8990173c19daa26433e09f0.html#a0a70db44d8990173c19daa26433e09f0) — returns a function that can be used to publish partial update samples for the given update tag.

```cpp
Topic<string, float> temperatures{node, "temperatures"};
MultiKeyWriter<string, float> writer{
    temperatures,
    {"floor1/kitchen", "floor1/living-room"},
    "first-floor-writer"};

// Publish an Add sample
writer.add("floor1/kitchen", 21.0f);

// Publish an Update sample
writer.update("floor1/kitchen", 20.0f);

// Publish a Remove sample
writer.remove("floor1/kitchen");
```

## Writer Configuration

Writer behavior is configurable through the [DataStorm::WriterConfig](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1WriterConfig.html) class. Configuration can be provided at multiple levels, allowing both global defaults and per-writer customization.

You can set:

- **Global defaults** — using [DataStorm.Topic.*](../datastorm-topic-properties) properties (e.g., `DataStorm.Topic.SampleCount`)
- **Topic-level defaults** — by calling [Topic::setWriterDefaultConfig](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Topic_ab2a2111a70b838cbc57278ac4c29e645.html#ab2a2111a70b838cbc57278ac4c29e645)
- **Per-writer configuration** — via the writer constructor or [makeXxxWriter](https://code.zeroc.com/ice/3.8/api/cpp/namespaceDataStorm.html#header-func-members) helper functions

**Precedence:** lower levels override higher ones (*per-writer config > topic defaults > global properties*).

### Options

#### Sample Count (`sampleCount`)

Specifies how many samples are kept in the writer’s history queue. When the queue is full, the oldest samples are discarded. Default: keep all samples.

#### Sample Lifetime (`sampleLifetime`)

Specifies how long samples are retained in the writer’s queue. Samples older than this duration are automatically removed.

#### Clear History (`clearHistory`)

Controls when the writer’s sample queue is cleared, based on sample events (`ClearHistoryPolicy`):

- **OnAdd** — clears the queue when publishing an `Add` sample.
- **OnRemove** — clears the queue when publishing a `Remove` sample.
- **OnAll** — clears the queue when publishing any sample.
- **OnAllExceptPartialUpdate** — clears the queue when publishing any sample except a `PartialUpdate`.
- **Never** — never clears the queue automatically.

#### Priority (`priority`)

Specifies the **priority** of the writer. Readers can be configured with a discard policy (see [DiscardPolicy::Priority](https://code.zeroc.com/ice/3.8/api/cpp/namespaceDataStorm_aea43ef98e7e3436abc965908aa19b473.html#aea43ef98e7e3436abc965908aa19b473)) to only accept samples from the writer with the highest priority among those connected to the same topic.

### Coordination & Listeners

Writers provide methods and listener callbacks to coordinate with connected readers.

#### Coordination Methods

- [hasReaders](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Writer_a91b9693902db142aaaefe92f4f024560.html#a91b9693902db142aaaefe92f4f024560) — checks whether any readers are currently connected.
- [waitForReaders](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Writer_a4fcb25334734007f070b1e3c7b6c51f4.html#a4fcb25334734007f070b1e3c7b6c51f4) — wait for readers to connect.
- [waitForNoReaders](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Writer_af19ce42df5c3108b2362d4b38419035d.html#af19ce42df5c3108b2362d4b38419035d) — blocks until all readers disconnect.
- [getConnectedKeys](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Writer_a970d44f9f1e538bfd492c8dc626c99d0.html#a970d44f9f1e538bfd492c8dc626c99d0) — returns the set of keys for which at least one reader is connected.
- [getConnectedReaders](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Writer_a139caf6992bf90fd211abbf3250b8683.html#a139caf6992bf90fd211abbf3250b8683) — returns the names of connected readers.

#### Connected Keys Listener

Use [onConnectedKeys(initCallback, updateCallback)](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Writer_a8e95ce3faae3df238b50727e2e4ff729.html#a8e95ce3faae3df238b50727e2e4ff729) to register callbacks that monitor connected keys:

- The `initCallback` is called immediately after registration with the initial set of connected keys.
- The `updateCallback` is called whenever a key is connected or disconnected.

#### Connected Readers Listener

Use [onConnectedReaders(initCallback, updateCallback)](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Writer_a2abe48f42f26a47a1f143c66ceb5a34c.html#a2abe48f42f26a47a1f143c66ceb5a34c) to register callbacks that monitor connected readers.

- The `initCallback` is called immediately after registration with the initial set of connected readers.
- The `updateCallback` is called whenever a reader connects or disconnects.
