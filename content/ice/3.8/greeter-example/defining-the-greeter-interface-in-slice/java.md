{% language-section name="lang-1" %}

```slice
["java:identifier:com.example.visitorcenter"]
module VisitorCenter
{
    // ... definitions go here
}
```

{% callout type="info" %}

In addition to the module declaration, you’ll notice we also added some
[_metadata_](../../slice/slice-metadata-directives). Metadata allows you to customize the language mapping for your
Slice in various ways. Here we use the `java:identifier` metadata to change the mapped name of this module for Java.

Without this, our generated Java code would be within a package named `VisitorCenter`; but with our metadata, it is
placed in the `com.example.visitorcenter` package instead.

{% /callout %}

{% /language-section %}

{% language-section name="lang-2" %}

```slice
    string greet(string name);
```

{% /language-section %}

{% language-section name="lang-3" %}

```slice
["java:identifier:com.example.visitorcenter"]
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
