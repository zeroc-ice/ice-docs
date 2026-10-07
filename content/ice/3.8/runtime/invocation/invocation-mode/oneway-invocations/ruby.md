{% language-section name="mapping" %}

```ruby
weatherStation = WeatherStationPrx.new(communicator, "ClearSky:tcp -p 4061 -h localhost")

# Configure the proxy to use the oneway invocation mode.
weatherStation = weatherStation.ice_oneway()

...

loop do
    weatherStation.report(sensorId, timeStamp, getAtmosphericConditions())
    ...
end
```

{% /language-section %}
