---
title: IceStorm
---

IceStorm is an efficient publish/subscribe service for Ice applications. Applications often need to disseminate
information to multiple recipients. For example, suppose we are developing a weather monitoring application in which we
collect measurements such as wind speed and temperature from a meteorological tower and periodically distribute them to
weather monitoring stations. We initially consider using the architecture shown below:

![A weather station feeds a collector, which sends updates directly to four monitors.](/attachments/3.8/icestorm/icestorm1.svg)

However, the primary disadvantage of this architecture is that it tightly couples the collector to its monitors,
needlessly complicating the collector implementation by requiring it to manage the details of monitor registration,
measurement delivery, and error recovery. We can rid ourselves of these mundane duties by incorporating IceStorm into
our architecture, as shown below:

![A weather station feeds a collector, which publishes updates through IceStorm to four monitors.](/attachments/3.8/icestorm/icestorm2.svg)

IceStorm simplifies the collector implementation significantly by decoupling it from the monitors. As a
publish/subscribe service, IceStorm acts as a mediator between the collector (the publisher) and the monitors (the
subscribers), and offers several advantages:

- When the collector is ready to distribute a new set of measurements, it makes a single request to the IceStorm server.
  The IceStorm server takes responsibility for delivering the request to the monitors, including handling any exceptions
  caused by ill-behaved or missing subscribers. The collector no longer needs to be aware of its monitors, or whether it
  even has any monitors at that moment.
- Similarly, monitors interact with the IceStorm server to perform tasks such as subscribing and unsubscribing, thereby
  allowing the collector to focus on its application-specific responsibilities and not on administrative trivia.
- The collector and monitor applications require very few changes to incorporate IceStorm.
