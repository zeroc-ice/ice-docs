{% language-section name="mapping" %}

## Syslog Logger

On platforms other than Windows, you can activate a logger that logs via the Unix `syslog` implementation by setting the
[Ice.UseSyslog](../../../property-reference/ice-properties) property. This logger sends its messages over UDP to the
syslog daemon at [Ice.SyslogHost](../../../property-reference/ice-properties) and
[Ice.SyslogPort](../../../property-reference/ice-properties).

{% /language-section %}
