{% language-section name="configuring-a-client-for-bidirectional-connections" %}

```typescript
const adapter = await communicator.createObjectAdapter("");
communicator.setDefaultObjectAdapter(adapter);
const mockAlarmClock = new MockAlarmClock();
adapter.add(mockAlarmClock, new Ice.Identity("alarmClock"));
```

{% /language-section %}
