---
title: Deprecating Slice Definitions
sidebarLabel: Deprecation
---

The `deprecated` metadata directive marks a Slice definition as deprecated. For example:

```slice
interface Example
{
    ["deprecated:Use alternativeOperation instead."]
    void someOperation();

    void alternativeOperation();
}
```

The directive is either `["deprecated"]` or `["deprecated:message"]`, where the message says why the definition is
deprecated or what to use instead. You can apply this directive to interfaces, classes, exceptions, structs, enums,
enumerators, sequences, dictionaries, constants, operations, and fields.

The Slice compilers warn about a definition that uses a deprecated construct, such as an operation whose parameter type
is deprecated. To silence this warning, deprecate this definition as well, or suppress the deprecation warnings for the
whole Slice file with the [`suppress-warning:deprecated`](../slice-metadata-directives#suppress-warning) file directive.

{% iflang langs="cpp,csharp,js" %}

The Slice compiler also marks the code it generates for a deprecated definition as deprecated.

{% /iflang %}

The [`@deprecated`](../documenting-slice-definitions/doc-comment-structure#@deprecated) doc-comment tag documents the
deprecation in the API reference. Use this tag together with the `deprecated` directive.

## See Also

- [Doc-Comment Structure](../documenting-slice-definitions/doc-comment-structure)
- [Slice Metadata Directives](../slice-metadata-directives)
