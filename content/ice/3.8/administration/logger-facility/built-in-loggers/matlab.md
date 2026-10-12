{% language-section name="mapping" %}

## Syslog Logger

On Linux, you can activate a logger that logs via the Unix `syslog` implementation by setting
[Ice.UseSyslog](../../../property-reference/ice-properties) to 1.

## Systemd Journal Logger

On Linux, you can activate a logger that logs to the systemd journal by setting
[Ice.UseSystemdJournal](../../../property-reference/ice-properties) to 1. This logger is available only when Ice is
built with systemd support.

{% /language-section %}
