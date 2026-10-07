{% language-section name="mapping" %}

```py
weatherStation = WeatherStationPrx(communicator, "ClearSky:tcp -p 4061 -h localhost")

# Configure the proxy to use the oneway invocation mode.
weatherStation = weatherStation.ice_oneway()

...

while True:
    weatherStation.report(sensorId, timeStamp, getAtmosphericConditions())
    ...
```

{% /language-section %}
