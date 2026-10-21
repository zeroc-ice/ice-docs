{% language-section name="mapping" %}

{% callout type="note" %}
Ice for JavaScript object adapters have no `activate`, `hold`, `deactivate` or `waitForDeactivate` methods: an object
adapter dispatches the requests it receives over bidirectional connections from the moment you create it until you call
`destroy`.
{% /callout %}

{% /language-section %}
