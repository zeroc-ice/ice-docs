---
title: Plugins
pages:
  - plug-in-facility
  - custom-logger-plug-in
  - iceiap
  - icebt
  - icediscovery
  - icelocatordiscovery
---

A plug-in adds a feature to a communicator, such as a transport or a discovery service. This chapter describes how to
install and implement plug-ins, and how to use the plug-ins included with Ice.

| Plug-in                                      | Purpose                                                     | Availability                                                                     |
| -------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [Custom logger](./custom-logger-plug-in)     | Install a logger during communicator initialization.        | Implemented in C++, C#, or Java.                                                 |
| [IceIAP](./iceiap)                           | Connect an iOS client to an accessory.                      | C++ and Swift on iOS.                                                            |
| [IceBT](./icebt)                             | Communicate over Bluetooth RFCOMM, optionally with TLS.     | C++ on Linux and Java on Android; C++-based mappings can load the Linux library. |
| [IceDiscovery](./icediscovery)               | Locate objects and object adapters using UDP multicast.     | All mappings except JavaScript.                                                  |
| [IceLocatorDiscovery](./icelocatordiscovery) | Discover an IceGrid locator (registry) using UDP multicast. | All mappings except JavaScript.                                                  |

C++, C#, and Java expose APIs for implementing plug-ins and managing the plug-ins of a communicator. Python, Ruby, PHP,
MATLAB, and Swift use the C++ plug-in implementation and configure plug-ins through properties. JavaScript does not
provide a plug-in facility.
