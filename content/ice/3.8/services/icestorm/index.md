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

Consider a weather monitoring application in which sensors report their readings, such as temperature and humidity, to
several weather stations:

![Sensors send their readings directly to each weather station.](/images/ice/3.8/icestorm/icestorm1.svg)

In this architecture, each sensor keeps track of the weather stations, sends each reading to every one of them, and
handles the stations it cannot reach.

With IceStorm, the sensors are publishers and the weather stations are subscribers:

![Sensors publish their readings to an IceStorm topic, and IceStorm forwards them to each weather station.](/images/ice/3.8/icestorm/icestorm2.svg)

A sensor publishes each reading once to an IceStorm [topic](./icestorm-concepts), however many weather stations there
are, and IceStorm forwards the reading to the weather stations subscribed to that topic:

- Weather stations subscribe to and unsubscribe from the topic through IceStorm, without involving the sensors.
- IceStorm removes a subscriber when a delivery to it fails, unless the subscriber's
  [quality of service](./icestorm-quality-of-service#retry-count-qos-for-icestorm) tolerates the failure, so a sensor
  does not track weather station failures.
