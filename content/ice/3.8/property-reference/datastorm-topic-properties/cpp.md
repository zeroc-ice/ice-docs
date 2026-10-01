---
title: DataStorm.Topic.*
---

These properties define node-wide defaults for topic readers and writers. DataStorm reads them once when you create the
node. To set defaults for an individual topic, use `DataStorm::Topic::setReaderDefaultConfig` and
`DataStorm::Topic::setWriterDefaultConfig`.

## DataStorm.Topic.SampleLifetime

### Synopsis {% id="datastorm.topic.samplelifetime-synopsis" %}

`DataStorm.Topic.SampleLifetime=num`

### Description {% id="datastorm.topic.samplelifetime-description" %}

Defines the lifetime in milliseconds of samples queued in a writer or reader sample queue. DataStorm removes samples
older than this lifetime from the queue. The default is 0. A value of 0 or less means an unlimited lifetime.

## DataStorm.Topic.SampleCount

### Synopsis {% id="datastorm.topic.samplecount-synopsis" %}

`DataStorm.Topic.SampleCount=num`

### Description {% id="datastorm.topic.samplecount-description" %}

This property defines the maximum number of samples queued in the writer or reader sample queue. If the maximum is
reached, oldest samples are removed to make room for new samples in the queue. A negative value is equivalent to an
infinite sample count. If set to 0, samples are not queued. If not defined, the default value is `-1`.

## DataStorm.Topic.ClearHistory

### Synopsis {% id="datastorm.topic.clearhistory-synopsis" %}

`DataStorm.Topic.ClearHistory=value`

### Description {% id="datastorm.topic.clearhistory-description" %}

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

## DataStorm.Topic.DiscardPolicy

### Synopsis {% id="datastorm.topic.discardpolicy-synopsis" %}

`DataStorm.Topic.DiscardPolicy=value`

### Description {% id="datastorm.topic.discardpolicy-description" %}

This property specifies how samples might be discarded by a reader.

| Value           | Description                                                                                                          |
| --------------- | -------------------------------------------------------------------------------------------------------------------- |
| `Never`, `None` | Samples are never discarded.                                                                                         |
| `SendTime`      | A sample is discarded if its timestamp is at or before the last accepted sample timestamp.                           |
| `Priority`      | A sample is discarded if it's received from writer with a lower priority than the highest priority connected writer. |

If not defined, the default value is `Never`.

## DataStorm.Topic.Priority

### Synopsis {% id="datastorm.topic.priority-synopsis" %}

`DataStorm.Topic.Priority=num`

### Description {% id="datastorm.topic.priority-description" %}

This property specifies the priority assigned to the topic's writers. If not defined, the default value is 0.
