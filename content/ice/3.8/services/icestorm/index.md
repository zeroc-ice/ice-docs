---
title: IceStorm
pages:
  - icestorm-concepts
  - using-icestorm
  - highly-available-icestorm
  - icestorm-administration
  - topic-federation
  - icestorm-quality-of-service
  - icestorm-delivery-modes
  - configuring-icestorm
  - icestorm-persistent-data
  - icestorm-metrics
  - icestorm-database-utility
---

IceStorm is a publish/subscribe service for Ice applications.

Consider a weather monitoring application in which a collector receives measurements, such as wind speed and
temperature, from a weather station and distributes them to several monitors:

![A weather station feeds a collector, which sends updates directly to four monitors.](/images/ice/3.8/icestorm/icestorm1.svg)

In this architecture, the collector keeps track of the monitors, sends each update to every one of them, and handles the
monitors it cannot reach.

With IceStorm, the collector is a publisher and the monitors are subscribers:

![A weather station feeds a collector, which publishes updates through IceStorm to four monitors.](/images/ice/3.8/icestorm/icestorm2.svg)

The collector publishes each update to an IceStorm [topic](./icestorm-concepts#topics-and-messages), and IceStorm forwards
the update to the monitors subscribed to that topic:

- The collector sends each update to IceStorm once, regardless of how many monitors are subscribed.
- Monitors subscribe to and unsubscribe from the topic through IceStorm, without involving the collector.
- IceStorm removes a subscriber it cannot reach, after the retries set by its
  [quality of service](./icestorm-quality-of-service#retry-count-qos-for-icestorm), so the collector does not track
  monitor failures.
