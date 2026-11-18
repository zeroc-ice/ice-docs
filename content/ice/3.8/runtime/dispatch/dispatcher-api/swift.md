{% language-section name="dispatcher" %}

A dispatcher is a type that adopts the [`Dispatcher`](api:Ice/Dispatcher) protocol and implements its
[`dispatch`](api:Ice/Dispatcher.dispatch) method.

{% /language-section %}

{% language-section name="servants" %}

To implement `ice_id`, `ice_ids`, `ice_isA` and `ice_ping` yourself, make your servant adopt the
[`Ice.Object`](api:Ice/Object) protocol in addition to the skeleton protocol, and implement its four methods. The
`dispatch` method of the skeleton then calls your methods.

{% /language-section %}
