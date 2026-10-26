---
title: Dispatcher API
languages:
  - cpp
  - csharp
  - java
  - js
  - python
  - swift
---

{% language-section name="servants-1" /%}

## Servants

{% language-section name="servants-2" /%}

{% iflang langs="cpp,csharp,java,js,swift" %}

A servant can also implement the Dispatcher abstraction itself, without a generated skeleton: it reads the parameters
from the request's input stream and writes its results to an output stream.
[Input and Output Streams](../../input-and-output-streams) shows how to read and write Slice types with these streams.
You add such a servant to an object adapter like any other servant, in its [active servant map](../active-servant-map)
or as a [default servant](../default-servants).

{% /iflang %}
