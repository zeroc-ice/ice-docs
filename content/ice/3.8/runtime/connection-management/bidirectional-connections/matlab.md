{% language-section name="configuring-a-client-for-bidirectional-connections" %}

{% callout type="note" %}
Ice for MATLAB is a client-only mapping: a MATLAB application can send requests but cannot dispatch them, so it cannot
receive callbacks over a bidirectional connection.
{% /callout %}

{% /language-section %}

{% language-section name="configuring-a-server-for-bidirectional-connections" %}

{% callout type="note" %}
Ice for MATLAB is a client-only mapping, so a MATLAB application cannot be the server of a bidirectional connection.
{% /callout %}

{% /language-section %}
