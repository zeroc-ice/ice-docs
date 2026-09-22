---
id: ice-connection-properties
language: csharp
---

{% language-section name="lang-1" %}

# Ice.Connection._name_.MaxDispatches

#### Synopsis

`Ice.Connection.name.MaxDispatches=num`

#### Description

Configures the maximum number of requests that a connection can dispatch concurrently. Once this limit is reached, the
connection stops reading new requests off its underlying transport connection.

The limit is infinite when `num` is `0` or less.

The default max dispatches is `100`.

{% /language-section %}
