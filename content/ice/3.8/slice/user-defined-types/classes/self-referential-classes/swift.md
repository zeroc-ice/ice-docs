{% language-section name="mapping" %}

{% callout type="note" %}

By default, Ice for Swift rejects a class graph with cycles when it unmarshals it, such as a `TreeNode` whose children
refer back to it. Set [Ice.AcceptClassCycles](../../../../property-reference/ice-properties#ice.acceptclasscycles) to
`1` to accept such graphs. Your code must then break the cycles, for example by setting the `parent` fields to nil, when
it no longer needs a graph; otherwise, the instances of this graph leak.

{% /callout %}

{% /language-section %}
