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

- `None` _(the default)_: the communicator has no implicit context, and `getImplicitContext` returns null.
- `Shared`: the communicator has one implicit context, which all threads can use concurrently.
- `PerThread`: the communicator has a separate implicit context for each thread.

{% /iflang %}

{% iflang langs="js" %}

- `None` _(the default)_: the communicator has no implicit context, and `getImplicitContext` returns null.
- `Shared`: the communicator has one implicit context.

{% /iflang %}

## Using the Implicit Context

`getImplicitContext` on the communicator returns its implicit context, an object with methods to read and update the
context's entries.{% iflang langs="cpp,csharp,java,matlab,python,ruby,swift" %} When `Ice.ImplicitContext` is
`PerThread`, each thread has its own implicit context: call `getImplicitContext` and update the context on the thread
that makes the invocations.{% /iflang %}{% iflang langs="csharp,swift" %} An asynchronous method can resume on another
thread after an `await`; with `PerThread`, the invocations it makes from then on use the implicit context of that
thread.{% /iflang %}

{% language-section name="using-the-implicit-context" /%}
