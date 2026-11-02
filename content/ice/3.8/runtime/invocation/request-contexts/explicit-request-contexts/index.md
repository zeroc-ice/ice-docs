---
title: Explicit Request Contexts
sidebarLabel: Explicit
---

Request contexts allow a client to send additional data to the server without having to include this data as input
parameters in the operation’s Slice definition. They provide a lightweight mechanism for passing metadata alongside
normal request arguments.

An explicit context, even an empty one, replaces the [per-proxy](../per-proxy-request-contexts) and
[implicit](../implicit-request-contexts) contexts: Ice sends only the explicit context with the invocation.

The examples on this page use the `Greeter` interface:

{% iflang langs="cpp,java,js,matlab,php,python,ruby,swift" %}

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

{% /iflang %}

{% iflang langs="csharp" %}

```slice
module VisitorCenter
{
    interface Greeter
    {
        ["cs:identifier:Greet"]
        string greet(string name);
    }
}
```

{% /iflang %}

{% language-section name="mapping" /%}
