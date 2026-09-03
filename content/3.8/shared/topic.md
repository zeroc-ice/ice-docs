---
id: topic
title: Topic
---

# DataStorm Topic

A **topic** can be seen as a typed stream or channel through which DataStorm nodes exchange data in the form of [**samples**](../sample).

The topic's name uniquely identifies it within a DataStorm application. The `Key`, `Value`, and `UpdateTag` types specify the typed data that will be written to and read from the topic.

From the application developer’s perspective, a topic is represented by an instance of the `DataStorm::Topic` class.

You create topics using the `DataStorm::Topic` constructor:

```cpp
DataStorm::Node node{argc, argv};
DataStorm::Topic<string, float> topic{node, "temperature"};
```

The example above creates a topic named `"temperature"`, with a string `Key` type and a float `Value` type. The `UpdateTag` type used for partial updates defaults to `std::string`.

{% callout type="info" %}
You can also create topics on the heap using std::make_shared.

```cpp
DataStorm::Node node{argc, argv};
auto topic = std::make_shared<DataStorm::Topic<string, float>>(
    node,
    "temperature");
```

{% /callout %}

Creating a topic does **not** trigger any network activity. It is only when a reader or writer is created within the topic that the event is announced to connected peer nodes.

Applications can create multiple instances of the same named topic—these instances represent the same logical topic. Readers and writers created from a particular instance are disconnected when that instance is destroyed, independently of other topic instances with the same name.

For peer nodes receiving samples from a topic, the topic instances are indistinguishable, although each sample still identifies the [writer](../writer) that published it.

Applications **must not** create multiple topics with the same name but different type parameters.
Doing so will result in decoding errors when subscribers attempt to decode samples that do not match the expected encoding.

## Filters

DataStorm topics support two types of filters:

- **Key filters**, used by readers to receive only samples whose keys match specific criteria.
- **Sample filters**, used by readers to receive only samples that meet specific conditions.

### Key Filters

Key filters must be defined on both the topic used to create the reader and the topic used to create the writer.

For example, to register a key filter that accepts only keys starting with a given prefix, you can define the following filter:

```cpp
DataStorm::Topic<string, float> topic{node, "temperatures"};

topic.setKeyFilter<string>("startswith", [](string prefix)
{
    return [prefix](const string& key)
    {
        return key.size() >= prefix.size() && 
            key.compare(0, prefix.size(), prefix) == 0;
    };
});
```

The `setKeyFilter` method registers a factory function for key filters. The template parameter specifies the type used for the filter criteria. The first argument is the filter’s name, and the second argument is a factory function that returns a filter function for the given criteria.

[Readers](../reader) and writers created by a topic can use the key filter factories registered with that topic:

- A **reader** uses the filter to ignore samples whose keys do not match the specified criteria.
- A **writer** uses the filter to avoid attaching to readers whose filters exclude all of its configured keys.

{% callout type="info" %}
**Attaching** refers to the process where a writer and a reader are connected because they use the same topic and share matching keys. Once attached, the reader receives all samples published by that writer that match its filters and key criteria.
{% /callout %}

### Sample Filters

Sample filters must be defined only on the topic used to create the writer.

A sample filter allows a reader to specify which samples it is interested in, and the writer will not send any samples that do not match the filter criteria. This reduces both bandwidth usage and the processing of samples that the peer is not interested in.

For example, to register a sample filter that only accepts samples with temperature values lower than a given limit:

```cpp
DataStorm::Topic<string, float> topic{node, "temperatures"};
topic.setSampleFilter<float>("lower-than", [](float limit)
{
    return [limit](const Sample<string, float>& sample)
    {
        return sample.getValue() < limit;
    };
});
```

The `setSampleFilter` method registers a factory function for sample filters. The template parameter specifies the type used for the filter criteria. The first argument is the filter’s name, and the second argument is a factory function that returns a filter function for the given criteria.

Readers can configure a sample filter, which attached writers use to send only the samples that satisfy the reader’s filter.

### Predefined filters

DataStorm includes two predefined filters, with names `_regex` and `_event`.

The `_regexp` filter can be used both as a key filter, and as a value filter providing that the value type can be converted to a string using the `ostream <<` operator.

The `_event` filter can be used only as a sample filter, allow filtering samples based on its event type.

### Updaters

DataStorm **updaters** are used to process *partial update* [samples](../sample) — that is, samples with the `PartialUpdate` event type. A partial update sample represents a change relative to the previous sample rather than a complete replacement of the value.

Partial updates are useful when a topic’s value type contains large amounts of data, especially when only a subset changes frequently. By publishing partial updates instead of full values, applications can significantly reduce bandwidth usage and improve performance.

A good example of partial updates is a ride-hailing or fleet-tracking service where each vehicle periodically publishes its telemetry data — position, speed, battery level, and operating status.

In such systems, not all fields change at the same rate:

- Vehicle position updates frequently (every few seconds).
- Speed and battery level change less often.
- Status (`Free`, `Busy`, etc.) may remain stable for long periods.

Using **partial updates**, vehicles can publish only the information that has changed since the last update, reducing bandwidth usage.

#### Slice definitions

```slice
module RideShare
{
    enum Status { Free, Busy }

    struct Coordinates
    {
        float longitude;
        float latitude;
    }

    struct TelemetryData
    {
        float batteryLevel;
        Coordinates coordinates;
        float speed;
        Status status;
    }

    enum UpdateTag
    {
        BatteryLevelUpdated,
        PositionUpdated,
        SpeedUpdated,
        StatusUpdated
    }
}
```

{% callout type="info" %}
We use Slice to define the data types for this example, but the same can be achieved with any other encoding format such as Protobuf, JSON, or a custom binary encoding. DataStorm is encoding-agnostic — applications are free to use whichever serialization method best fits their needs.
{% /callout %}

#### Registering updaters

Updaters must be registered with both the topic used to create **readers** and the topic used to create **writers**, since both sides need to compute the new value from the partial update. For the telemetry example, these updaters apply the field-specific changes:

```cpp
DataStorm::Node node{argc, argv};
DataStorm::Topic<int, RideShare::TelemetryData, RideShare::UpdateTag> topic{
    node, "vehicle/telemetry"};

topic.setUpdater<float>(
    RideShare::UpdateTag::SpeedUpdated,
    [](RideShare::TelemetryData& t, float speed)
    {
        t.speed = speed;
    });

topic.setUpdater<float>(
    RideShare::UpdateTag::BatteryLevelUpdated,
    [](RideShare::TelemetryData& t, float batteryLevel)
    {
        t.batteryLevel = batteryLevel;
    });

topic.setUpdater<RideShare::Coordinates>(
    RideShare::UpdateTag::PositionUpdated,
    [](RideShare::TelemetryData& t, const RideShare::Coordinates& coordinates)
    {
        t.coordinates = coordinates;
    });

topic.setUpdater<RideShare::Status>(
    RideShare::UpdateTag::StatusUpdated,
    [](RideShare::TelemetryData& t, RideShare::Status status)
    {
        t.status = status;
    });
```

With this setup, vehicles can send partial updates to modify **battery level**, **coordinates**, **speed**, or **status** independently — or send a full **update sample** when multiple fields change at once.
