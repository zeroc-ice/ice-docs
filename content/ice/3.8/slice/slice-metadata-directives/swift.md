{% language-section name="language-specific-metadata-directives" %}

The metadata directives for Swift uses the `swift` prefix.

### `swift:attribute:attribute`

This directive adds the specified Swift attribute to the generated code. It can be used with classes, structs, enums,
and exceptions.

### `swift:identifier:swift-identifier`

This directive applies to all Slice constructs, and instructs the Slice compiler to use the specified
`swift-identifier`.

For example:

```slice
enum ButtonPressed
{
    ["swift:identifier:snooze"]
    Snooze,

    ["swift:identifier:stop"]
    Stop
}
```

The `swift:identifier` directives in this example ensure the enumerators `Snooze` and `Stop` are mapped to `snooze` and
`stop`, per Swift’s usual conventions, instead of the default mapping (`Snooze` and `Stop`).

### `swift:module:module:prefix`

This deprecated directive applies to Slice modules. Use `swift:identifier` instead.

`swift:module` instructs the Slice compiler to map this Slice module to the specified Swift module. All Swift
identifiers in that module also receive the specified prefix, as if they were defined in a nested module _prefix_.

With respect to the Swift mapping:

```slice
["swift:module:Mod:Pre"] module Test
{
    ...
}
```

is equivalent to:

```slice
module Mod
{
    module Pre
    {
        ...
    }
}
```

{% callout type="note" %}

Metadata directives never change [type IDs](../type-ids). For example, exception `E` defined in module `Test` has type
ID `"::Test::E"` regardless of any `swift:module` metadata directive on module `Test`.

{% /callout %}

{% /language-section %}
