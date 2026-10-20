{% language-section name="mapping" %}

{% callout type="note" %}

By default, Ice for C++ rejects class graphs with cycles: it throws a `MarshalException` when it unmarshals a `TreeNode`
whose children refer back to it. Set
[Ice.AcceptClassCycles](../../../../property-reference/ice-properties#ice.acceptclasscycles) to `1` to accept such
graphs.

{% /callout %}

{% /language-section %}
