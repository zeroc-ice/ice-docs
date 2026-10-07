{% language-section name="mapping" %}

## Ice.Connection._name_.MaxDispatches

{% property-synopsis %}

`Ice.Connection.name.MaxDispatches=num`

{% /property-synopsis %}

{% property-description %}

Configures the maximum number of requests that a connection can dispatch concurrently. Once this limit is reached, the
connection stops reading new requests off its underlying transport connection.

The limit is infinite when `num` is `0` or less.

The default max dispatches is `100`.

{% /property-description %}

{% /language-section %}
