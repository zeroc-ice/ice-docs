{% language-section name="configuring-a-client-for-bidirectional-connections" %}

```swift
let adapter = try communicator.createObjectAdapter("")
communicator.setDefaultObjectAdapter(adapter)
let mockAlarmClock = MockAlarmClock()
try adapter.add(servant: mockAlarmClock, id: Ice.Identity(name: "alarmClock"))
```

{% /language-section %}

{% language-section name="configuring-a-server-for-bidirectional-connections" %}

```swift
struct BidirWakeUpService: WakeUpService {
    func wakeMeUp(timeStamp: Int64, current: Ice.Current) throws {
        // The connection from the client to the server.
        guard let connection = current.con else {
            // Unexpected colloc call.
            throw Ice.FeatureNotSupportedException("...")
        }

        // alarmClock is a fixed proxy.
        let alarmClock = try uncheckedCast(
            prx: connection.createProxy(
                Ice.Identity(name: "alarmClock")), type: AlarmClockPrx.self)
        ...
```

The [Ice bidir demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/swift/Ice/Bidir) provides a complete client and
server in Swift that communicate over a bidirectional connection.

{% /language-section %}
