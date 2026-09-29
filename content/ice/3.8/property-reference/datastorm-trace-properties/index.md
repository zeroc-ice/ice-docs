---
title: DataStorm.Trace.*
---

## DataStorm.Trace.Topic

### Synopsis {% id="datastorm.trace.topic-synopsis" %}

`DataStorm.Trace.Topic=num`

### Description {% id="datastorm.trace.topic-description" %}

Controls the trace level for topics:

| 0   | No topic trace (default).             |
| --- | ------------------------------------- |
| 1   | Trace topic creation and destruction. |

## DataStorm.Trace.Data

### Synopsis {% id="datastorm.trace.data-synopsis" %}

`DataStorm.Trace.Data=num`

### Description {% id="datastorm.trace.data-description" %}

Controls the trace level for writers and readers.

| 0   | No writer or read trace (default).                                                              |
| --- | ----------------------------------------------------------------------------------------------- |
| 1   | Trace reader or writer creation and destruction.                                                |
| 2   | Like 1, but also trace when readers or writers connect or disconnect and sample initialization. |
| 3   | Like 2, but also trace when samples are queued, discarded or published.                         |

## DataStorm.Trace.Session

### Synopsis {% id="datastorm.trace.session-synopsis" %}

`DataStorm.Trace.Session=num`

### Description {% id="datastorm.trace.session-description" %}

Controls the trace level for sessions.

| 0   | No session trace (default).                                                          |
| --- | ------------------------------------------------------------------------------------ |
| 1   | Trace session creation and destruction.                                              |
| 2   | Like 1, but also trace topic, writer and reader subscription, sample initialization. |
| 3   | Like 2, but also trace topic, writer, reader announcements and attachments.          |
