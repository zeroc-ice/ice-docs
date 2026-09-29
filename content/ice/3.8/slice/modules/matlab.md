{% language-section name="lang-1" %}

A Slice module maps to a MATLAB namespace with the same name. The mapping preserves the nesting of the Slice
definitions. For example:

```slice
module M1::M2
{
    // ...
}

// ...

module M1    // Reopen M1
{
    // ...
}
```

The Slice compiler generates the corresponding MATLAB definition in the namespace folders `+M1` and `+M1/+M2`.

### Custom Mapping

The `matlab:identifier` metadata directive allows you to map a module to a MATLAB namespace or sub-namespace of your
choice. For example:

```slice
// module Time becomes namespace remote.clock in MATLAB.
["matlab:identifier:remote.clock"]
module Time
{
    // ...
}
```

You can only use `matlab:identifier` on a module with a simple name - this metadata directive is not compatible with the
nested module syntax.

{% /language-section %}
