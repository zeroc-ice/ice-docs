---
id: defining-the-greeter-interface-in-slice
language: python
---

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
    string greet(string name);
```

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
        string greet(string name);
    }
}
```

{% /language-section %}
