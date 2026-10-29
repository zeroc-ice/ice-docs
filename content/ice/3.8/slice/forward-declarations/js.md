{% language-section name="mapping" %}

When a forward-declared class or interface is defined in another Slice file, add the `js:defined-in` metadata to the
forward declaration to name that file. The Slice-to-JavaScript compiler imports the type from the corresponding
generated module in the TypeScript declarations.

For example, `Greeter.ice` forward declares `GreeterAdmin`:

```slice
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

and `Admin.ice` defines it:

```slice
module VisitorCenter
{
    interface GreeterAdmin
    {
        void shutdown();
    }
}
```

{% /language-section %}
