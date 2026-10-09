---
title: DataStorm.Topic.*
---

These properties define node-wide defaults for topic readers and writers. DataStorm reads them once when you create the
node. To set defaults for an individual topic, use
[DataStorm::Topic::setReaderDefaultConfig](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Topic_ae005c107f689e1e309e49a4c1421ed2a.html#ae005c107f689e1e309e49a4c1421ed2a)
and
[DataStorm::Topic::setWriterDefaultConfig](https://code.zeroc.com/ice/3.8/api/cpp/classDataStorm_1_1Topic_ab2a2111a70b838cbc57278ac4c29e645.html#ab2a2111a70b838cbc57278ac4c29e645).

## DataStorm.Topic.SampleLifetime

{% property-synopsis %}

`DataStorm.Topic.SampleLifetime=num`

{% /property-synopsis %}

{% property-description %}

Defines the lifetime in milliseconds of samples queued in a writer or reader sample queue. DataStorm removes samples
older than this lifetime from the queue. The default is `0`. A value of `0` or less means an unlimited lifetime.

{% /property-description %}

## DataStorm.Topic.SampleCount

{% property-synopsis %}

`DataStorm.Topic.SampleCount=num`

{% /property-synopsis %}

{% property-description %}

This property defines the maximum number of samples queued in the writer or reader sample queue. If the maximum is
reached, oldest samples are removed to make room for new samples in the queue. A negative value is equivalent to an
infinite sample count. If set to `0`, samples are not queued. If not defined, the default value is `-1`.

{% /property-description %}

## DataStorm.Topic.ClearHistory

{% property-synopsis %}

`DataStorm.Topic.ClearHistory=value`

{% /property-synopsis %}

{% property-description %}

This property determines when the reader or writer sample history is cleared. Legal values and their description are
presented in the table below:

| Value                      | Description                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `OnAdd`                    | Clear the sample history when an Add sample is received.                              |
| `OnRemove`                 | Clear the sample history when a Remove sample is received.                            |
| `OnAll`                    | Clear the sample history when a new sample is received.                               |
| `OnAllExceptPartialUpdate` | Clear the sample history when a new sample which is not a partial update is received. |
| `Never`                    | Never clear the sample history.                                                       |

If not defined, the default value is `OnAll`.

{% /property-description %}

## DataStorm.Topic.DiscardPolicy

{% property-synopsis %}

`DataStorm.Topic.DiscardPolicy=value`

{% /property-synopsis %}

{% property-description %}

This property specifies how samples might be discarded by a reader.

| Value           | Description                                                                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `Never`, `None` | Samples are never discarded.                                                                                                                   |
| `SendTime`      | The reader discards a sample whose timestamp is at or before the latest timestamp it has accepted.                                             |
| `Priority`      | The reader discards a sample from a writer whose priority is lower than the highest priority among the writers connected for the sample's key. |

If not defined, the default value is `Never`.

{% /property-description %}

## DataStorm.Topic.Priority

{% property-synopsis %}

`DataStorm.Topic.Priority=num`

{% /property-synopsis %}

{% property-description %}

This property specifies the priority assigned to the topic's writers. If not defined, the default value is `0`.

{% /property-description %}
