{% language-section name="language-specific-metadata-directives" %}

The metadata directives for JavaScript uses the `js` prefix.

### `js:defined-in:file-name`

This directive applies to forward declarations of interfaces and classes. It tells the Slice-to-JavaScript compiler
which file to import the forward-declared type from in the TypeScript declarations; file-name is the relative path to
the Slice file that defines the type.

### `js:identifier:javascript-identifier`

This directive applies to all Slice constructs, and instructs the Slice compiler to use the specified
`javascript-identifier`.

For example:

```slice
struct CompilerInfo
{
    ["js:identifier:debuggerName"]
    string debugger;
}
```

The `js:identifier` directive in this example ensures that `debugger` filed, a reserved JavaScript keyword, is mapped
`debuggerName`.

### `js:module:module-name`

This file directive allows you to tell the Slice-to-JavaScript compiler how the generated modules should be imported by
other generated code. It is mainly useful when you want to publish your generated code as an npm package, so that other
projects can import the generated code for your Slice definitions by package name rather than by relative path.

For example, the Slice definitions for the Ice built-in files use:

For example the Slice definitions for Ice builtin files use:

```slice
// Ice/Locator.ice

[["js:module:@zeroc/ice"]]

#include "Identity.ice"

module Ice
{
...
}
```

When you include `Ice/Locator.ice` in your own Slice files, the generated code will import `Ice` from `@zeroc/ice`.
Without this directive, the compiler would instead fall back on its default heuristic and generate a relative import,
such as from `Ice/Locator.js`.

Other files that use the same js:module directive will still import each other with relative paths, since they are
assumed to be part of the same npm package.

{% /language-section %}
