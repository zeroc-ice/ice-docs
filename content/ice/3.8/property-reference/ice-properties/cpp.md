{% language-section name="lang-1" %}

## Ice.AcceptClassCycles

### Synopsis

`Ice.AcceptClassCycles=num`

### Description

If `num` is set to 0 (the default), the unmarshaling of class cycles is disallowed. A `MarshalException` is thrown when
a cycle is detected during unmarshaling.

If `num` is set to a value larger than 0, class cycles are unmarshaled. You must break any cycles programmatically in
your own code to prevent memory leaks.

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}

{% language-section name="lang-3" state="no-addition" /%}

{% language-section name="lang-4" state="no-addition" /%}

{% language-section name="lang-5" state="no-addition" /%}

{% language-section name="lang-6" state="no-addition" /%}

{% language-section name="lang-7" state="no-addition" /%}

{% language-section name="lang-8" state="no-addition" /%}
