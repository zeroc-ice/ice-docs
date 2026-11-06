{% language-section name="dispatcher" %}

A dispatcher is a type that adopts the [`Dispatcher`](api:Ice/Dispatcher) protocol and implements its
[`dispatch`](api:Ice/Dispatcher.dispatch) method.

{% /language-section %}

{% language-section name="servants" %}

To implement `ice_id`, `ice_ids`, `ice_isA` and `ice_ping` itself, a servant also adopts the
[`Ice.Object`](api:Ice/Object) protocol; the skeleton then calls these methods instead of its default implementations.

{% /language-section %}
