{% language-section name="mapping" %}

## Syslog Logger

On macOS, you can activate a logger that logs via the Unix `syslog` implementation by setting
[Ice.UseSyslog](../../../property-reference/ice-properties) to 1.

## OSLog Logger

On macOS and iOS, you can activate a logger that logs using [OSLog](https://developer.apple.com/documentation/os/oslog)
by setting [Ice.UseOSLog](../../../property-reference/ice-properties) to 1.

{% /language-section %}
