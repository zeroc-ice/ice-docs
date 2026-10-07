---
title: DataStorm.Trace.*
---

## DataStorm.Trace.Topic

{% synopsis %}

`DataStorm.Trace.Topic=num`

{% /synopsis %}

{% description %}

Controls the trace level for topics:

| Value | Description                           |
| ----- | ------------------------------------- |
| 0     | No topic trace (default).             |
| 1     | Trace topic creation and destruction. |

{% /description %}

## DataStorm.Trace.Data

{% synopsis %}

`DataStorm.Trace.Data=num`

{% /synopsis %}

{% description %}

Controls the trace level for writers and readers:

| Value | Description                                                                                                         |
| ----- | ------------------------------------------------------------------------------------------------------------------- |
| 0     | No writer or reader trace (default).                                                                                |
| 1     | Trace reader and writer creation and destruction, and partial updates discarded because no base value is available. |
| 2     | Like 1, and trace reader and writer connections, disconnections and sample initialization.                          |
| 3     | Like 2, and trace samples being queued, discarded or published.                                                     |

{% /description %}

## DataStorm.Trace.Session

{% synopsis %}

`DataStorm.Trace.Session=num`

{% /synopsis %}

{% description %}

Controls the trace level for sessions:

| Value | Description                                                                                                                                    |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | No session trace (default).                                                                                                                    |
| 1     | Trace session creation, destruction, connections and disconnections, plus peer session retries, reconnect attempts and retry-limit exhaustion. |
| 2     | Like 1, and trace topic announcements, topic, writer and reader subscriptions, and sample initialization.                                      |
| 3     | Like 2, and trace session-level topic announcements, writer and reader announcements, attachments and individual samples.                      |

{% /description %}
