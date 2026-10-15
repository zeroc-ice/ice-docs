{% language-section name="mapping" %}

When a forward declaration corresponds to a type defined in a separate Slice file, add the `[js:defined-in:<file>]`
metadata to tell the Slice-to-JavaScript compiler which file to import the type from in the TypeScript declarations.

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
