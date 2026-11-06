---
title: Explicit Request Contexts
sidebarLabel: Explicit
---

An explicit context applies only to the invocation you pass it to, and
[replaces the other contexts](../../request-contexts#combining-request-contexts), even when it is empty. For example, a
client asks for a French greeting:

{% language-section name="client" /%}

{% iflang langs="cpp,csharp,java,js,python,swift" %}

The implementation of the operation reads the context from the `ctx` field of its `Current` parameter:

{% language-section name="server" /%}

{% /iflang %}
