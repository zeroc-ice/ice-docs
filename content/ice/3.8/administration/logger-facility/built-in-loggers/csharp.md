{% language-section name="mapping" %}

## .NET Logger

The default logger in Ice for C# writes its messages with the `System.Diagnostics.Trace` class. By default, Ice adds its
own console listener, which writes to `stderr`. You can disable the logging of messages via this trace listener by
setting the property [Ice.ConsoleListener](../../../property-reference/ice-properties) to zero.

You can add your own trace listener programmatically. For example:

```csharp
// Create a trace listener for the event log.
EventLogTraceListener myTraceListener =
    new EventLogTraceListener("myEventLogSource");

// Add the event log trace listener to the collection.
Trace.Listeners.Add(myTraceListener);
```

{% /language-section %}
