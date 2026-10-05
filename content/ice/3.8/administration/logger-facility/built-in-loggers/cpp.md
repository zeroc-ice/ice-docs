{% language-section name="mapping" %}

## Syslog Logger

On Linux and macOS, you can activate a logger that logs via the Unix `syslog` implementation by setting the
[Ice.UseSyslog](../../../property-reference/ice-properties) property.

## Systemd Journal Logger

On Linux, you can activate a logger that logs to the systemd journal by setting the
[Ice.UseSystemdJournal](../../../property-reference/ice-properties) property. This logger is available only when Ice is
built with systemd support.

## Windows Logger

On Windows, when an application built with [Ice::Service](../../../background-servers/windows-services) runs as a
Windows service (started with the `--service` option), `Ice::Service` installs a per-process logger that writes to the
Windows application event log, unless the application has already installed a custom
[per-process logger](../per-process-logger). [Ice.EventLog.Source](../../../property-reference/ice-properties) selects
the event log source.

## OSLog Logger

On macOS and iOS, you can activate a logger that logs using [OSLog](https://developer.apple.com/documentation/os/oslog)
by setting [Ice.UseOSLog property](../../../property-reference/ice-properties).

{% /language-section %}
