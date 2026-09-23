---
title: The Per-Process Logger
---

Ice allows you to install a per-process [custom logger](../custom-loggers). This logger is used by all communicators
that do not have their own specific logger established at the time they are created.

You can set a per-process logger by calling `setProcessLogger`, and you can retrieve the per-process logger by calling
`getProcessLogger`:

{% language-section name="lang-1" /%}

If you call `getProcessLogger` without having called `setProcessLogger` first, the Ice runtime installs a default
per-process logger. Note that if you call `setProcessLogger`, only communicators created after that point will use this
per-process logger; communicators created earlier use the logger that was in effect at the time they were created. (This
also means that you can call `setProcessLogger` multiple times; communicators created after that point will use whatever
logger was established by the last call to `setProcessLogger`.)
