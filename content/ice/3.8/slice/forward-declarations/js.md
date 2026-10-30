{% language-section name="mapping" %}

When a forward-declared class or interface is defined in another Slice file, add the `js:defined-in` metadata to the
forward declaration to give that file's relative path, starting with `./` or `../`. The Slice-to-JavaScript compiler
imports the type from the corresponding generated module in the TypeScript declarations.

For example:

```slice {% title="Greeter.ice" %}
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
```

```slice {% title="Admin.ice" %}
#include "Greeter.ice"

module VisitorCenter
{
    interface GreeterAdmin
    {
        Greeter* getGreeter();
        void shutdown();
    }
}
```

{% /language-section %}
