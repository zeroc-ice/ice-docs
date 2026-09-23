{% language-section name="lang-1" %}

```typescript
const adapter = await communicator.createObjectAdapter("");
communicator.setDefaultObjectAdapter(adapter);
const mockAlarmClock = new MockAlarmClock();
adapter.add(mockAlarmClock, new Ice.Identity("alarmClock"));
```

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}
