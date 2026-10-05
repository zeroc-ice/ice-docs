{% language-section name="mapping" %}

## Syslog Logger

On Linux and macOS, you can activate a logger that logs via the Unix `syslog` implementation by setting the
[Ice.UseSyslog](../../../property-reference/ice-properties) property.

## Systemd Journal Logger

On Linux, you can activate a logger that logs to the systemd journal by setting the
[Ice.UseSystemdJournal](../../../property-reference/ice-properties) property. This logger is available only when Ice is
built with systemd support.

## OSLog Logger

On macOS, you can activate a logger that logs using [OSLog](https://developer.apple.com/documentation/os/oslog) by
setting the [Ice.UseOSLog](../../../property-reference/ice-properties) property.

{% /language-section %}
