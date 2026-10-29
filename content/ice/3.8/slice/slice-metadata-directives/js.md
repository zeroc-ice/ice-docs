{% language-section name="language-specific-metadata-directives" %}

JavaScript metadata directives use the `js` prefix.

### js:defined-in

`["js:defined-in:file"]`. Applies to forward declarations of interfaces and classes.

This directive tells the Slice-to-JavaScript compiler which file to import the forward-declared type from in the
TypeScript declarations; `file` is the relative path to the Slice file that defines the type. See
[Forward Declarations](../forward-declarations).

### js:identifier

`["js:identifier:name"]`. Applies to any definition, parameter, or field.

This directive maps the Slice construct to the JavaScript identifier `name`. For example:

```slice
struct CompilerInfo
{
    ["js:identifier:debuggerName"]
    string debugger;
}
```

The field `debugger` maps to `debuggerName`, because `debugger` is a reserved JavaScript keyword.

### js:module

`[["js:module:name"]]`. Applies to a Slice file.

This directive tells the Slice-to-JavaScript compiler how other generated code imports the code generated for this file.
It is mainly useful when you publish your generated code as an npm package, so that other projects can import the
generated code for your Slice definitions by package name rather than by relative path.

For example, the Slice definitions for the Ice built-in files use:

```slice
// Ice/Locator.ice

[["js:module:@zeroc/ice"]]

#include "Identity.ice"

module Ice
{
    ...
}
```

When you include `Ice/Locator.ice` in your own Slice files, the generated code imports `Ice` from `@zeroc/ice`. Without
this directive, the compiler would instead generate a relative import, such as from `Ice/Locator.js`.

Files that use the same `js:module` directive import each other with relative paths, since they are assumed to be part
of the same npm package.

{% /language-section %}
