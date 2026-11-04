---
title: Implicit Request Contexts
sidebarLabel: Implicit
languages:
  - cpp
  - csharp
  - java
  - js
  - matlab
  - python
  - ruby
  - swift
---

An implicit context belongs to a communicator: Ice sends it with each invocation made through the proxies of this
communicator, unless the invocation has an [explicit context](../explicit-request-contexts).

## Configuring the Implicit Context

The [Ice.ImplicitContext](../../../../property-reference/ice-properties#ice.implicitcontext) property sets whether the
communicator has an implicit context, and its scope:

{% iflang langs="cpp,csharp,java,matlab,python,ruby,swift" %}

- `None` _(the default)_: the communicator has no implicit context.
- `Shared`: the communicator has one implicit context, which all threads can use concurrently.
- `PerThread`: the communicator has a separate implicit context for each thread.

{% /iflang %}

{% iflang langs="js" %}

- `None` _(the default)_: the communicator has no implicit context.
- `Shared`: the communicator has one implicit context.

{% /iflang %}

## Using the Implicit Context

`getImplicitContext` on the communicator returns its implicit context, an object with methods to read and update the
context's entries.{% iflang langs="cpp,csharp,java,matlab,python,ruby,swift" %} With `PerThread`, call
`getImplicitContext` and update the context on the thread that makes the invocations.{% /iflang %}

{% language-section name="using-the-implicit-context" /%}
