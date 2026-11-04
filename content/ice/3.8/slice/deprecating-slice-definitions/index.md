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

The message that follows the colon is optional, and says why the definition is deprecated or what to use instead. You
can apply the `deprecated` directive to interfaces, classes, exceptions, structs, enums, enumerators, sequences,
dictionaries, constants, operations, and fields.

The Slice compilers warn about a definition that uses a deprecated construct, such as an operation whose parameter type
is deprecated, unless the definition itself is also deprecated. The
[`suppress-warning:deprecated`](../slice-metadata-directives#suppress-warning) file directive silences these warnings.

{% iflang langs="cpp" %}

The Slice compiler maps the `deprecated` directive to the C++ `[[deprecated]]` attribute, with the deprecation message,
so the C++ compiler warns when you use code generated from a deprecated Slice definition.

{% /iflang %}

{% iflang langs="csharp" %}

The Slice compiler maps the `deprecated` directive to the C# `Obsolete` attribute, with the deprecation message, so the
C# compiler warns when you use code generated from a deprecated Slice definition.

{% /iflang %}

{% iflang langs="js" %}

The Slice compiler maps the `deprecated` directive to a `@deprecated` tag, with the deprecation message, in the doc
comments of the generated code and TypeScript declarations.

{% /iflang %}

{% iflang langs="matlab" %}

The Slice compiler maps the `deprecated` directive to a `Deprecated` note, with the deprecation message, in the
generated doc comments.

{% /iflang %}

{% iflang langs="ruby" %}

The Slice compiler maps the `deprecated` directive of an operation to a Ruby warning with the deprecation message, which
Ruby issues on the first invocation of the operation and prints when you enable verbose warnings.

{% /iflang %}

The [`@deprecated`](../documenting-slice-definitions/doc-comment-structure#@deprecated) doc-comment tag documents the
deprecation in the API reference. Only the `deprecated` directive makes the Slice compilers warn about uses of the
definition; use the tag together with the directive.

{% iflang langs="java" %}

In Java, the Slice compiler maps the `@deprecated` tag, rather than the directive, to the `@Deprecated` annotation, so
the Java compiler warns when you use code generated from a deprecated Slice definition.

{% /iflang %}

## See Also

- [Doc-Comment Structure](../documenting-slice-definitions/doc-comment-structure)
- [Slice Metadata Directives](../slice-metadata-directives)
