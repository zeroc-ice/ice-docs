{% language-section name="language-specific-metadata-directives" %}

MATLAB metadata directives use the `matlab` prefix.

### matlab:identifier

`["matlab:identifier:name"]`. Applies to any definition, parameter, or field.

This directive maps the Slice construct to the MATLAB identifier `name`.

For example:

```slice
class AtmosphericConditions
{
    ["matlab:identifier:Temperature"]
    double temperature;

    ["matlab:identifier:Humidity"]
    double humidity;
}
```

The fields `temperature` and `humidity` map to the `Temperature` and `Humidity` properties in MATLAB.

{% callout type="warning" %}

When you apply this directive to a module that contains classes or exceptions, or directly to a class or an exception,
you need to install a [Slice loader](../user-defined-types/classes/slice-loaders) in communicators that receive
(unmarshal) these classes or exceptions. Without a Slice loader, the communicator cannot locate the MATLAB class and the
unmarshaling fails.

{% /callout %}

{% /language-section %}
