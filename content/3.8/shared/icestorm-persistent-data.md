---
id: icestorm-persistent-data
title: IceStorm Persistent Data
---

IceStorm stores various information in a [LMDB](https://www.symas.com/mdb) database, unless it's in transient mode. This section describes the data stored by IceStorm and database-related constraints.

# Data Stored

IceStorm stores the following data in its LMDB database:

- topics (topic name)
- subscriptions (subscriber proxy, quality of service for this subscription)
- topic links (proxy to the target topic, link cost)

# Limits Imposed by the IceStorm Database

## Key Size

A LMDB database consists of one or more persistent key-value maps, and the size of the keys in these maps is limited to 511 bytes.

IceStorm uses a single persistent map with application-provided data. This map has the following key:

```slice
struct SubscriberRecordKey
{
   // The identity of the topic, for example IceStorm/<topic-name>
   Ice::Identity topic;
   
   // The identity of the subscriber. An empty id corresponds to a topic-only entry.
   Ice::Identity id;
}
```

This key is streamed into a sequence of bytes using the [Ice encoding](../ice-encoding).

If you attempt to create a topic or register a subscriber with a topic and the resulting `SubscriberRecordKey`'s encoded representation is too large for the LMDB database, IceStorm will throw an `Ice::UnknownException`.

{% callout type="info" %}
This maximum key size is not configurable. If you exceed this limit, you need to reduce the size of your topic names or subscriber identities.
{% /callout %}

## Map Size

A LMDB database has a maximum size, known as its map size. The IceStorm database can store up to [IceStorm.LMDB.MapSize](../icestorm-properties) megabytes of data in its database; any attempt to store more data will fail with an `Ice::UnknownException`. If you exceed this limit, increase `IceStorm.LMDB.MapSize` and restart IceStorm.

If you don't set `IceStorm.LMDB.MapSize`, or set it to 0, IceStorm uses a map size of 10 MB on Windows, and 100 MB on Linux and macOS.

On Windows, LMDB immediately allocates a file with the given map size, while on Linux and macOS LMDB uses sparse files and the allocated data file starts small and grows as needed, until it reaches the configured limit.

{% callout type="info" %}
The default `MapSize` provided by IceStorm is expected to be sufficient for most applications. Unless you have a very large IceStorm deployment on Windows, we recommend keeping the default setting.

Use the [mdb_stat](https://manpages.org/mdb_stat) utility to monitor the pages used by your IceStorm database. The example below shows a LMDB database with the default size on Linux (100 MB):

```shell
mdb_stat -e -a db
Environment Info
  Map address: (nil)
  Map size: 104857600
  Page size: 4096
  Max pages: 25600
  Number of pages used: 14
  Last transaction ID: 12
  Max readers: 126
  Number of readers used: 0
Status of Main DB
  Tree depth: 1
  Branch pages: 0
  Leaf pages: 1
  Overflow pages: 0
  Entries: 2
Status of llu
  Tree depth: 1
  Branch pages: 0
  Leaf pages: 1
  Overflow pages: 0
  Entries: 1
Status of subscribers
  Tree depth: 0
  Branch pages: 0
  Leaf pages: 0
  Overflow pages: 0
  Entries: 0
```

{% /callout %}

# Backing up the IceStorm Database

You should consider making regular backups of your IceStorm database. We recommend using one of the following tools to perform backups while IceStorm is running:

- [icestormdb](../icestorm-database-utility) with the `--export` option
- [mdb_copy](https://manpages.org/mdb_copy) or [mdb_dump](https://manpages.org/mdb_dump)
