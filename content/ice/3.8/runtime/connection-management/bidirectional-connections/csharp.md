{% language-section name="configuring-a-client-for-bidirectional-connections" %}

```csharp
Ice.ObjectAdapter adapter = communicator.createObjectAdapter("");
communicator.setDefaultObjectAdapter(adapter);
var mockAlarmClock = new Client.MockAlarmClock();
adapter.add(mockAlarmClock, new Ice.Identity { name = "alarmClock" });
```

{% /language-section %}

{% language-section name="configuring-a-server-for-bidirectional-connections" %}

The Slice definition maps `wakeMeUp` to `WakeMeUp` with [`cs:identifier`](../../../slice/slice-metadata-directives)
metadata:

```slice
interface WakeUpService
{
    ["cs:identifier:WakeMeUp"]
    void wakeMeUp(long timeStamp);
}
```

```csharp
internal class BidirWakeUpService : WakeUpServiceDisp_
{
    public override void WakeMeUp(long timeStamp, Ice.Current current)
    {
        // The connection from the client to the server.
        Ice.Connection? connection = current.con;
        if (connection is null)
        {
            // Unexpected colloc call.
            throw new NotImplementedException("...");
        }

        // alarmClock is a fixed proxy.
        AlarmClockPrx alarmClock = AlarmClockPrxHelper.uncheckedCast(
            connection.createProxy(new Ice.Identity { name = "alarmClock" }));
        ...
```

{% /language-section %}
