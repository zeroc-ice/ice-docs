---
title: The Per-Process Logger
---

A communicator created without a logger of its own and without logger properties uses the per-process logger when it is
a custom logger, and Ice's default logger otherwise.

{% iflang langs="cpp,csharp,java,js,python" %}

Ice allows you to install a [custom logger](../custom-loggers) as the per-process logger. You can set a per-process
logger by calling `setProcessLogger`, and you can retrieve the per-process logger by calling `getProcessLogger`:

{% /iflang %}

{% language-section name="mapping" /%}

{% iflang langs="cpp,csharp,java,js,python" %}

If you call `getProcessLogger` without having called `setProcessLogger` first, the Ice runtime installs a default
per-process logger. Note that if you call `setProcessLogger`, only communicators created after that point without a
logger of their own will use this per-process logger; communicators created earlier use the logger that was in effect at
the time they were created. (This also means that you can call `setProcessLogger` multiple times; communicators created
after that point will use whatever logger was established by the last call to `setProcessLogger`.)

{% /iflang %}
