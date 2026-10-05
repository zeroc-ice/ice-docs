{% language-section name="lang-1" %}

```slice
module VisitorCenter
{
    // ... definitions go here
}
```

{% /language-section %}

{% language-section name="lang-2" %}

```slice
    ["cs:identifier:Greet"]
    string greet(string name);
```

{% callout type="note" %}

In addition to our operation, you’ll notice we also added some [_metadata_](../../slice/slice-metadata-directives).
Metadata allows you to customize the language mapping for your Slice in various ways. Here we use the `cs:identifier`
metadata to change the mapped name of this operation to `Greet` for C#.

Without this, our operation would be named `greet` (camelCase), which goes against the convention of using PascalCase
for method names in C#.

{% /callout %}

{% /language-section %}

{% language-section name="lang-3" %}

```slice
module VisitorCenter
{
    /// Represents a simple greeter.
    interface Greeter
    {
        /// Creates a personalized greeting.
        /// @param name The name of the person to greet.
        /// @return The greeting.
        ["cs:identifier:Greet"]
        string greet(string name);
    }
}
```

{% /language-section %}
