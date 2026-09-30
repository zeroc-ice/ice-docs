---
title: Slave Registry Runtime Component
---

An IceGrid deployment may use several IceGrid registry replicas, with one Master registry and a number of read-only
Slave registries.

## Actions

A slave registry provides the following actions, from its contextual menu and from the `Tools > Registry` menu

- **Retrieve Ice log** Retrieve the log messages sent to the IceGrid registry's [logger](../logger-facility) into an
  [Ice Log Dialog](../ice-log-dialog). The Ice Log Dialog attaches a [remote logger](../logger-facet) to the registry's
  logger.
- **Retrieve stdout** Retrieve the IceGrid registry's stdout into a [Log File Dialog](../log-file-dialog). This
  retrieval succeeds only when the registry's stdout output has been redirected to a file using the
  [Ice.StdOut](../ice-properties) property.
- **Retrieve stderr** Retrieve the IceGrid registry's stderr into a [Log File Dialog](../log-file-dialog). This
  retrieval succeeds only when the registry's stderr output has been redirected to a file using the
  [Ice.StdErr](../ice-properties) property.
- **Shutdown** Shutdown the registry process.

{% callout type="warning" %}

You cannot restart an IceGrid registry from IceGrid Admin.

{% /callout %}

## Properties

The Registry Properties panel shows:

- **Hostname** The name of the host on which the IceGrid registry process is running.
- **Build Id** The build Id of this Registry: this corresponds to the Ice property
  [BuildId](../icegrid-and-the-administrative-facility).
- **Properties** A table showing all the Ice properties currently set in this IceGrid registry.

## Children

A slave registry can have the following types of children:

- [Metrics View](../metrics-view-runtime-component)
