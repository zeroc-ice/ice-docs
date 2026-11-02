{% language-section name="language-specific-metadata-directives" %}

Swift metadata directives use the `swift` prefix.

### swift:attribute

`["swift:attribute:attribute"]`. Applies to classes, structs, enumerations, and exceptions.

This directive adds the Swift attribute `attribute` to the generated code.

### swift:identifier

`["swift:identifier:name"]`. Applies to any definition, parameter, or field.

The generated Swift code uses `name` instead of the Slice identifier. For example:

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

`["swift:module:module"]` or `["swift:module:module:prefix"]`. Applies to modules.

This deprecated directive maps the Slice module to the Swift module `module`, and gives all the Swift identifiers in
this module the prefix `prefix`, as if they were defined in a nested Slice module `prefix`. Use `swift:identifier`
instead.

{% /language-section %}
