{% language-section name="configuring-a-client-for-bidirectional-connections" %}

{% callout type="note" %}
Ice for PHP is a client-only mapping: a PHP application can send requests but cannot dispatch them, so it cannot receive
callbacks over a bidirectional connection.
{% /callout %}

{% /language-section %}

{% language-section name="configuring-a-server-for-bidirectional-connections" %}

{% callout type="note" %}
Ice for PHP is a client-only mapping, so a PHP application cannot be the server of a bidirectional connection.
{% /callout %}

{% /language-section %}
