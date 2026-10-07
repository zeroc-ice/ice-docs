{% language-section name="mapping" %}

## Ice.Connection._name_.MaxDispatches

{% synopsis %}

`Ice.Connection.name.MaxDispatches=num`

{% /synopsis %}

{% description %}

Configures the maximum number of requests that a connection can dispatch concurrently. Once this limit is reached, the
connection stops reading new requests off its underlying transport connection.

The limit is infinite when `num` is `0` or less.

The default max dispatches is `100`.

{% /description %}

{% /language-section %}
