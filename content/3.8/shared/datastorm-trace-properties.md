---
id: datastorm-trace-properties
title: DataStorm.Trace.*
---

# DataStorm.Trace.Topic

#### Synopsis

`DataStorm.Trace.Topic=num`

#### Description

Controls the trace level for topics:

| 0   | No topic trace (default).             |
| --- | ------------------------------------- |
| 1   | Trace topic creation and destruction. |

# DataStorm.Trace.Data

#### Synopsis

`DataStorm.Trace.Data=num`

#### Description

Controls the trace level for writers and readers.

| 0   | No writer or read trace (default).                                                              |
| --- | ----------------------------------------------------------------------------------------------- |
| 1   | Trace reader or writer creation and destruction.                                                |
| 2   | Like 1, but also trace when readers or writers connect or disconnect and sample initialization. |
| 3   | Like 2, but also trace when samples are queued, discarded or published.                         |

# DataStorm.Trace.Session

#### Synopsis

`DataStorm.Trace.Session=num`

#### Description

Controls the trace level for sessions.

| 0   | No session trace (default).                                                          |
| --- | ------------------------------------------------------------------------------------ |
| 1   | Trace session creation and destruction.                                              |
| 2   | Like 1, but also trace topic, writer and reader subscription, sample initialization. |
| 3   | Like 2, but also trace topic, writer, reader announcements and attachments.          |
