{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

The metadata directives for MATLAB uses the `matlab` prefix.

### `matlab:identifier:matlab-identifier`

This directive applies to all Slice constructs, and instructs the Slice compiler to use the specified
`matlab-identifier`.

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

The `matlab:identifier` directives in this example instructs the Slice compiler to map Slice fields `temperature` and
`humidity` to `Temperature` and `Humidity` properties in MATLAB.

{% callout type="warning" %}

When you apply this directive to a module that contains classes or exceptions, or directly to a class or an exception,
you need to install a [Slice loader](../user-defined-types/classes/slice-loaders) in communicators that receive
(unmarshal) these classes or exceptions. Without a Slice loader, the communicator cannot locate the MATLAB class and the
unmarshaling fails.

{% /callout %}

{% /language-section %}
