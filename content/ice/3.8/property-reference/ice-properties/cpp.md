{% language-section name="ice.backgroundlocatorcacheupdates" %}

## Ice.AcceptClassCycles

{% synopsis %}

`Ice.AcceptClassCycles=num`

{% /synopsis %}

{% description %}

If `num` is set to 0 (the default), the unmarshaling of class cycles is disallowed. A `MarshalException` is thrown when
a cycle is detected during unmarshaling.

If `num` is set to a value larger than 0, class cycles are unmarshaled. You must break any cycles programmatically in
your own code to prevent memory leaks.

{% /description %}

{% /language-section %}
