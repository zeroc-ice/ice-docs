{% language-section name="lang-1" %}

## .NET Logger

The default logger in Ice for C# writes its messages using the `System.Diagnostics.Trace` facility. By default, the
communicator registers a `ConsoleTraceListener` that writes to `stderr`. You can disable the logging of messages via
this trace listener by setting the property [Ice.ConsoleListener](../ice-properties) to zero.

You can add your own trace listener programmatically. For example:

```csharp
// Create a trace listener for the event log.
EventLogTraceListener myTraceListener =
    new EventLogTraceListener("myEventLogSource");

// Add the event log trace listener to the collection.
Trace.Listeners.Add(myTraceListener);
```

## Syslog Logger

You can activate a logger that logs via the Unix `syslog` implementation by setting the
[Ice.UseSyslog](../ice-properties) property.

{% /language-section %}
