{% language-section name="lang-1" state="not-applicable" note="Python logs exceptions from future completion callbacks through the Ice.Future Python logger. Ice.Warn.AMICallback does not control these messages." /%}

{% language-section name="lang-2" %}

## Ice.Warn.Executor

### Synopsis {% id="ice.warn.executor-synopsis" %}

`Ice.Warn.Executor=num`

### Description {% id="ice.warn.executor-description" %}

If `num` is greater than 0, Ice logs a warning when the executor supplied through `InitializationData.executor` raises
an exception while accepting a call. The default value is 1.

{% /language-section %}
