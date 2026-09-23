---
title: DataStorm.Topic.*
---

# DataStorm.Topic.SampleLifetime

#### Synopsis

`DataStorm.Topic.SampleLifetime=num`

#### Description

This property defines the lifetime in milli-seconds of samples queued in the writer or reader sample queue. Samples
older that the lifetime are automatically removed from the reader or writer queue. The default lifetime is 0 which is
the same as an infinite lifetime.

# DataStorm.Topic.SampleCount

#### Synopsis

`DataStorm.Topic.SampleCount=num`

#### Description

This property defines the maximum number of samples queued in the writer or reader sample queue. If the maximum is
reached, oldest samples are removed to make room for new samples in the queue. A negative value is equivalent to an
infinite sample count. If set to 0, samples are not queued. If not defined, the default value is `-1`.

# DataStorm.Topic.ClearHistory

#### Synopsis

`DataStorm.Topic.ClearHistory=value`

#### Description

This property determines when the reader or writer sample history is cleared. Legal values and their description are
presented in the table below:

| **Value**                   | **Description**                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `OnAdd`                     | Clear the sample history when a Add sample is received.                               |
| `OnRemove`                  | Clear the sample history when a Remove sample is received.                            |
| `OnAll`                     | Clear the sample history when a new sample is received.                               |
| `OnAllExceptPartialUpdates` | Clear the sample history when a new sample which is not a partial update is received. |
| `Never`                     | Never clear the sample history.                                                       |

If not defined, the default value `OnAll`.

# DataStorm.Topic.DiscardPolicy

#### Synopsis

`DataStorm.Topic.DiscardPolicy=value`

#### Description

This property specifies how samples might be discarded by a reader.

| **Value**  | **Description**                                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------------------- |
| `Never`    | Samples are never discarded.                                                                                         |
| `SendTime` | A sample is discarded if its timestamp is older than the last received sample timestamp.                             |
| `Priority` | A sample is discarded if it's received from writer with a lower priority than the highest priority connected writer. |

If not defined, the default value is `Never`.

# DataStorm.Topic.Priority

#### Synopsis

`DataStorm.Topic.Priority=num`

#### Description

This property specifies the priority assigned to the topic's writers. If not defined, the default value is 0.
