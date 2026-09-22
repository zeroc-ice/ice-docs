---
id: forward-declarations
language: js
---

{% language-section name="lang-1" %}

In JavaScript when a forward declaration correspond to a type defined on separate Slice file, you must add the
`[js:defined-in:<file>]` metadata to let the Slice-to-JavaScript compiler where the type is defined.

```slice
// Greeter.ice

["js:defined-in:./Admin.ice"]
interface GreeterAdmin;

module VisitorCenter {
    GreeterAdmin* getAdminObject();
    string greet(string name);
}

// Admin.ice
interface GreeterAdmin { ... }
```

{% /language-section %}
