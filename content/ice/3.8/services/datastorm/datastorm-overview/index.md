---
title: DataStorm Overview
---

**DataStorm** is a **brokerless, C++ publish–subscribe framework**.

A DataStorm application consists of _publishers_ and _subscribers_. Publishers write data to **topics**, and subscribers
read data from these topics.

A **topic** is a named object within a DataStorm node. It can be seen as a stream of typed data. The unit of data
exchanged between topics is called a **sample**. A sample consists of a key–value pair (or data element) along with
additional metadata attached when it is written.

A typical DataStorm application consists of multiple **nodes**. Within these nodes, you creates topics; each topic
represents a type of data you want to distribute. For each topic, you create **writers** and **readers** to produce and
consume the samples that flow between nodes.

![A temperature writer publishes through its topic and Node A. Samples travel to Node B, then through its temperature topic to a reader.](/images/ice/3.8/datastorm-overview/datastorm-overview.svg)

DataStorm applications do not rely on a central service to communicate. Nodes can connect directly to each other and
exchange samples whenever they share common topics for which one node has a writer and another has a matching reader.

Nodes can be statically configured to connect to each others (by providing endpoints), or they can use **UDP multicast**
for automatic peer discovery. When using **TCP** for discovery, nodes can connect to other regular or dedicated
discovery nodes. Discovery nodes can also be replicated and connected together to ensure there is no single point of
failure.

## Filtering and Updates

DataStorm provides flexible mechanisms to control which samples are exchanged between nodes.

- **Key filters** allow readers to subscribe only to specific data elements within a topic.
- **Sample filters** allow readers to receive only samples that match a given condition.

Filters are application-defined functions, and DataStorm includes several predefined ones, such as a regular expression
filter for string keys.

To minimize bandwidth usage, DataStorm supports **partial updates**, allowing writers to send only the portions of a
value that have changed.

## Relationship to Ice

DataStorm is built on top of Ice but can also be used independently. You don’t need to know the Ice APIs to develop
DataStorm applications—you only need to use the DataStorm API.

DataStorm is **encoding-agnostic**, meaning the format of data samples is entirely determined by the application. You
are free to choose the encoding that best fits your use case.

For data types defined in **Slice**, DataStorm automatically uses the generated Slice-to-C++ code for serialization and
deserialization. For other data encodings, you can provide your own `encode` and `decode` functions.

## DataStorm vs. IceStorm

Ice also includes [**IceStorm**](../../icestorm), a broker-based publish/subscribe service that distributes Ice
invocations to subscribers. In contrast, **DataStorm** is a brokerless, data-centric framework focused on efficiently
distributing _data samples_ rather than remote calls.

Use **IceStorm** when your application revolves around Ice interfaces and operations. Use **DataStorm** when you want
lightweight, high-performance data sharing without a central broker.
