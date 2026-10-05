{% language-section name="mapping" %}

## Syslog Logger

You can activate a logger that logs via the Unix `syslog` implementation by setting the
[Ice.UseSyslog](../../../property-reference/ice-properties) property.

## Systemd Journal Logger

On Linux, you can activate a logger that logs to the systemd journal by setting the
[Ice.UseSystemdJournal](../../../property-reference/ice-properties) property.

## Windows Logger

On Windows, subclasses of [Ice::Service](../../../background-servers/windows-services) use the Windows application event
log by default. The event log implementation is available for C++ applications.

## macOS OSLog

On maOS, you can activate a logger that logs using [OSLog](https://developer.apple.com/documentation/os/oslog) by
setting [Ice.UseOSLog property](../../../property-reference/ice-properties).

{% /language-section %}
