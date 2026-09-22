---
id: bidirectional-connections
language: java
---

{% language-section name="lang-1" %}

```java
ObjectAdapter adapter = communicator.createObjectAdapter("");
communicator.setDefaultObjectAdapter(adapter);
var mockAlarmClock = new MockAlarmClock();
adapter.add(mockAlarmClock, new Identity("alarmClock", ""));
```

{% /language-section %}

{% language-section name="lang-2" %}

```java
class BidirWakeUpService implements WakeUpService {
    @Override
    public void wakeMeUp(long timeStamp, Current current)
       throws FeatureNotSupportedException {
         // The connection from the client to the server.
         Connection connection = current.con;
          if (connection == null) {
              // Unexpected colloc call.
              throw new FeatureNotSupportedException("...");
          }

          // alarmClock is a fixed proxy.
          AlarmClockPrx alarmClock = AlarmClockPrx.uncheckedCast(
              connection.createProxy(new Identity("alarmClock", "")));
          ...
```

{% /language-section %}
