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
Ice for JavaScript cannot accept incoming connections, so a JavaScript application cannot be the server of a
bidirectional connection.
{% /callout %}

{% /language-section %}
