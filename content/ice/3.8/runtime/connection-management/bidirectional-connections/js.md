{% language-section name="configuring-a-client-for-bidirectional-connections" %}

```typescript
const adapter = await communicator.createObjectAdapter("");
communicator.setDefaultObjectAdapter(adapter);
const mockAlarmClock = new MockAlarmClock();
adapter.add(mockAlarmClock, new Ice.Identity("alarmClock"));
```

{% /language-section %}

{% language-section name="configuring-a-server-for-bidirectional-connections" %}

{% callout type="note" %}
Ice for JavaScript cannot accept incoming connections, so a JavaScript application takes part in a bidirectional
connection only as its client: it establishes the connection and dispatches the requests that the server sends over it,
as described in
[Configuring a Client for Bidirectional Connections](#configuring-a-client-for-bidirectional-connections).
{% /callout %}

{% /language-section %}
