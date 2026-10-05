---
title: Built-in Loggers
---

Ice provides a file logger and, depending on the language mapping and platform, loggers that write to a system logging
service. You select one of these loggers with properties{% iflang langs="cpp" %}, except the Windows event log
logger{% /iflang %}.

## File Logger

Setting the [Ice.LogFile](../../../property-reference/ice-properties) property selects the file-based logger. This
logger appends its messages to the specified file and creates the file if necessary.

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

With [Ice.LogFile.SizeMax](../../../property-reference/ice-properties), the file logger archives the log file under a
new name and starts a new file when the file reaches the configured size.

{% /iflang %}

{% iflang langs="js" %}

The file logger is available in Node.js. In a browser, communicator initialization fails with `InitializationException`
when `Ice.LogFile` is set and the application doesn't supply a logger.

{% /iflang %}

{% language-section name="mapping" /%}

## See Also

- [Service Logging Considerations](../../../background-servers/service-logging-considerations)
