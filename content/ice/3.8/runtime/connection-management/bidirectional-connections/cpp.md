{% language-section name="configuring-a-client-for-bidirectional-connections" %}

```cpp
Ice::ObjectAdapterPtr adapter = communicator->createObjectAdapter("");
communicator->setDefaultObjectAdapter(adapter);
auto mockAlarmClock = make_shared<Client::MockAlarmClock>();
adapter->add(mockAlarmClock, Ice::stringToIdentity("alarmClock"));
```

{% /language-section %}

{% language-section name="configuring-a-server-for-bidirectional-connections" %}

```cpp
void
Server::BidirWakeUpService::wakeMeUp(
    int64_t timeStamp,
    const Ice::Current& current)
{
    // The connection from the client to the server.
    Ice::ConnectionPtr connection = current.con;
    if (!connection)
    {
        // Unexpected colloc call.
        throw std::invalid_argument{...};
    }

    // alarmClock is a fixed proxy.
    auto alarmClock = connection->createProxy<AlarmClockPrx>(
        Ice::stringToIdentity("alarmClock"));
    ...
}
```

{% /language-section %}
