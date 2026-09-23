---
title: Properties and Configuration
pages:
  - properties-overview
  - configuration-file-syntax
  - setting-properties-on-the-command-line
  - using-configuration-files
  - alternate-property-stores
  - command-line-parsing-and-initialization
  - the-properties-class
---

Ice uses a configuration mechanism that allows you to control many aspects of the behavior of your Ice applications at
runtime, such as the maximum message size, the number of threads, or whether to produce network trace messages. The
configuration mechanism is not only useful for configuring Ice, but also for configuring your own applications. The
configuration mechanism is simple to use with a minimal API, yet flexible enough to cope with the needs of most
applications.
