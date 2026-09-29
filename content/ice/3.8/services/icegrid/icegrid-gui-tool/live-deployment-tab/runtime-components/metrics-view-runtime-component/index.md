---
title: Metrics View Runtime Component
---

A Metrics View displays the Metrics maps associated with a Server or Service.

## States

A metrics view can be either enabled
![metrics enabled](/attachments/3.8/metrics-view-runtime-component/metrics-enabled.jpeg) or disabled
![metrics disabled](/attachments/3.8/metrics-view-runtime-component/metrics-disabled.jpeg). Once enabled, a Metrics View
may degrade the performance of the instrumented server or service.

## Actions

A Metrics View provides the following actions, from its contextual menu and from the `Tools > Metrics View` menu:

- **Enable** Enable this Metrics View.
- **Disable** Disable this Metrics View.

## Metrics Report

The Metrics Report panel shows the maps included in the Metrics View. The columns of the maps include the metrics
themselves (for example, the total number of operations dispatched by the server since the Metrics view was enabled) and
computed values (for example, the average lifetime of an operation dispatch, since the Metrics view was enabled).

{% callout type="info" %}

Tool tips on each column describe the metrics or computed value displayed by the column.

{% /callout %}

IceGrid GUI retrieves the latest metrics every 5 seconds and automatically refreshes the current Metrics Report.

Note that IceGrid GUI displays only non-empty metrics maps; for example, if a server does not make any remote
invocation, its Invocation map is empty and will not be displayed.
