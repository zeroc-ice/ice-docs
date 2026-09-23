---
title: DataStorm Concepts
---

# DataStorm Concepts

This section provides a brief overview of the main concepts in DataStorm. Each concept is explained in more detail in
its own dedicated page.

## Node

A [**DataStorm node**](../node) is responsible for communicating with other nodes, allowing samples to flow between
interconnected nodes. Each node can host multiple topics and manages the writers and readers associated with those
topics.

## Topic

A [**DataStorm topic**](../topic) can be seen as a stream of samples, representing a specific type of data that flows
between nodes. Topics form the foundation for communication between publishers and subscribers.

## Sample

A [**sample**](../sample) is the unit of data exchanged between DataStorm applications. It consists of a typed key–value
pair (or data element) and additional metadata attached to it when the sample is written.

## Writer

A [**writer**](../writer) allows an application to publish samples to a topic. Writers represent the **publisher** part
of a DataStorm publish–subscribe application. Each writer publishes data elements identified by a key, which can be
received by readers subscribed to the same topic.

## Reader

A [**reader**](../reader) allows an application to receive samples from a topic. Readers represent the **subscriber**
part of a DataStorm publish–subscribe application. Readers can subscribe to specific keys or use filters to receive only
the samples that match given criteria.

## Custom Types

The [**Custom Types**](../custom-types) page describes how to use user-defined types with DataStorm and the requirements
for these types.

## Discovery

The [**Discovery**](../connectivity) page explains how DataStorm nodes discover each other and how to configure a
DataStorm network.
