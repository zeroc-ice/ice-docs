---
title: Built-in Loggers
---

Ice provides a file logger and, depending on the language mapping and platform, loggers that write to a system logging
service. You select one of these loggers with properties.

## File Logger

Setting the [Ice.LogFile](../../../property-reference/ice-properties) property selects the file-based
logger{% iflang langs="js" %} in Node.js{% /iflang %}. This logger appends its messages to the specified file and
creates the file if necessary.

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

[Ice.LogFile.SizeMax](../../../property-reference/ice-properties) enables log file rotation: when the log file reaches
the configured size, the file logger archives it under a new name and starts a new file.

{% /iflang %}

{% language-section name="mapping" /%}

## See Also

- [Service Logging Considerations](../../../background-servers/service-logging-considerations)
