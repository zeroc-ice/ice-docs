---
title: Explicit Request Contexts
sidebarLabel: Explicit
---

Each proxy method that makes an invocation accepts a context parameter. A request context you pass through this
parameter is an explicit context: it applies only to this invocation and
[replaces the other contexts](../../request-contexts#combining-request-contexts), even when it is empty. For example, a
client asks for a French greeting:

{% language-section name="client" /%}
