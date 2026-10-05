{% language-section name="configuring-a-client-for-bidirectional-connections" %}

```py
adapter = communicator.createObjectAdapter("")
communicator.setDefaultObjectAdapter(adapter)
mockAlarmClock = MockAlarmClock()
adapter.add(mockAlarmClock, Ice.Identity(name="alarmClock"))
```

{% /language-section %}

{% language-section name="configuring-a-server-for-bidirectional-connections" %}

```py
class BidirWakeUpService(WakeUpService):
    def wakeMeUp(self, timeStamp: int, current: Ice.Current) -> None:
        assert current.con is not None, "Unexpected colloc call."
        # alarmClock is a fixed proxy.
        alarmClock = AlarmClockPrx.uncheckedCast(
          current.con.createProxy(Ice.Identity(name="alarmClock")))
        ...
```

{% /language-section %}
