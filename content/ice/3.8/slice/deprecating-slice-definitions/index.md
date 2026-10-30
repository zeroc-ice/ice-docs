---
title: Deprecating Slice Definitions
sidebarLabel: Deprecation
---

Use the `deprecated` metadata directive to mark a Slice definition as deprecated. For example:

```slice
interface Example
{
    ["deprecated:Use alternativeOperation instead."]
    void someOperation();

    void alternativeOperation();
}
```

The message that follows the colon is optional, and says why the definition is deprecated or what to use instead. You
can apply the `deprecated` directive to interfaces, classes, exceptions, structures, enumerations, enumerators,
sequences, dictionaries, constants, operations, and fields.

The Slice compilers warn about a definition that uses a deprecated definition, such as an operation whose parameter type
is deprecated, unless this definition is itself deprecated. The
[`suppress-warning:deprecated`](../slice-metadata-directives#suppress-warning) file directive silences these warnings.

{% iflang langs="cpp" %}

The Slice compiler also marks the generated C++ declarations with the `[[deprecated]]` attribute, so the C++ compiler
warns when your code uses them.

{% /iflang %}

{% iflang langs="csharp" %}

The Slice compiler also marks the generated C# declarations with the `Obsolete` attribute, which carries the deprecation
message, so the C# compiler warns when your code uses them.

{% /iflang %}

{% iflang langs="java" %}

The Slice compiler also marks the generated Java declarations with the `@Deprecated` annotation, so the Java compiler
warns when your code uses them.

{% /iflang %}

{% iflang langs="js" %}

The Slice compiler also adds a `@deprecated` tag, with the deprecation message, to the doc comments of the generated
code and TypeScript declarations.

{% /iflang %}

{% iflang langs="matlab" %}

The Slice compiler also adds a note that says the definition is deprecated to the generated doc comments.

{% /iflang %}

{% iflang langs="ruby" %}

The first invocation of a deprecated operation issues a Ruby warning, which Ruby prints when you enable verbose
warnings.

{% /iflang %}

The [`@deprecated`](../documenting-slice-definitions/doc-comment-structure#@deprecated) doc-comment tag documents the
deprecation in the API reference, but does not produce these warnings; use it together with the `deprecated` directive.

## See Also

- [Doc-Comment Structure](../documenting-slice-definitions/doc-comment-structure)
- [Slice Metadata Directives](../slice-metadata-directives)
