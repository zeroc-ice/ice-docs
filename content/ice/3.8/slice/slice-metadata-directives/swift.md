{% language-section name="language-specific-metadata-directives" %}

Swift metadata directives use the `swift` prefix.

### swift:attribute

`["swift:attribute:attribute"]`. Applies to classes, structs, enumerations, and exceptions.

This directive adds the Swift attribute `attribute` to the generated code.

### swift:class-resolver-prefix

`[["swift:class-resolver-prefix:prefix"]]`. Applies to a Slice file.

The default Slice loader locates the generated Swift class for a type ID through a generated resolver. This directive
adds `prefix` to the names of the resolvers of the classes and exceptions in this file. A communicator that receives
(unmarshals) these classes or exceptions needs a `DefaultSliceLoader(prefix)` as its
[Slice loader](../user-defined-types/classes/slice-loaders).

### swift:identifier

`["swift:identifier:name"]`. Applies to any definition, parameter, or field.

This directive maps the Slice construct to the Swift identifier `name`. For example:

```slice
enum ButtonPressed
{
    ["swift:identifier:snooze"]
    Snooze,

    ["swift:identifier:stop"]
    Stop
}
```

The enumerators `Snooze` and `Stop` map to `snooze` and `stop`, per Swift’s usual conventions, instead of the default
mapping (`Snooze` and `Stop`).

### swift:module

`["swift:module:module:prefix"]`. Applies to modules.

This deprecated directive maps the Slice module to the Swift module `module`, and gives all the Swift identifiers in
this module the prefix `prefix`, as if they were defined in a nested Slice module `prefix`. Use `swift:identifier`
instead.

{% /language-section %}
