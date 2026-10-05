{% language-section name="lang-1" %}

```slice
["matlab:identifier:visitorcenter"]
module VisitorCenter
{
    // ... definitions go here
}
```

{% callout type="note" %}

In addition to the module declaration, you’ll notice we also added some
[_metadata_](../../slice/slice-metadata-directives). Metadata allows you to customize the language mapping for your
Slice in various ways. Here we use the `matlab:identifier` metadata to change the mapped name of this module for MATLAB.

Without this, our generated MATLAB code would be within a namespace named `VisitorCenter`; but with our metadata, it
will be in the `visitorcenter` namespace instead.

{% /callout %}

{% /language-section %}

{% language-section name="lang-2" %}

```slice
    string greet(string name);
```

{% /language-section %}

{% language-section name="lang-3" %}

```slice
["matlab:identifier:visitorcenter"]
module VisitorCenter
{
    /// Represents a simple greeter.
    interface Greeter
    {
        /// Creates a personalized greeting.
        /// @param name The name of the person to greet.
        /// @return The greeting.
        string greet(string name);
    }
}
```

{% /language-section %}
