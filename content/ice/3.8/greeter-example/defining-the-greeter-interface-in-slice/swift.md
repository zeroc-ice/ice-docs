{% language-section name="writing-the-greeter.ice-slice-file-1" %}

```slice
module VisitorCenter
{
    // ... definitions go here
}
```

{% /language-section %}

{% language-section name="writing-the-greeter.ice-slice-file-2" %}

```slice
    string greet(string name);
```

{% /language-section %}

{% language-section name="writing-the-greeter.ice-slice-file-3" %}

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
