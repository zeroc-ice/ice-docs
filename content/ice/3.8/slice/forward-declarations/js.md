{% language-section name="mapping" %}

In JavaScript, when a forward declaration corresponds to a type defined in a separate Slice file, you must add the
`[js:defined-in:<file>]` metadata to tell the Slice-to-JavaScript compiler where the type is defined.

```slice
// Greeter.ice
module VisitorCenter
{
    ["js:defined-in:./Admin.ice"]
    interface GreeterAdmin;

    interface Greeter
    {
        GreeterAdmin* getAdminObject();
        string greet(string name);
    }
}

// Admin.ice
module VisitorCenter
{
    interface GreeterAdmin { ... }
}
```

{% /language-section %}
