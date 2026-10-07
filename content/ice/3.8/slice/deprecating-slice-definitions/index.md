---
title: Deprecating Slice Definitions
---

All Slice compilers support a metadata directive that allows you to deprecate a Slice definition. For example:

```slice
interface Example
{
    ["deprecated:Use alternativeOperation instead."]
    void someOperation();

    void alternativeOperation();
}
```

The message that follows the colon is optional, and says why the definition is deprecated or what to use instead.

The Slice compilers warn about a Slice definition that uses a deprecated definition, such as an operation whose
parameter type is deprecated. A definition that is itself deprecated does not trigger this warning for the definitions
it uses: a deprecated operation, field, sequence, dictionary, or constant for its types, a deprecated class, exception,
or structure for its base and fields, and a deprecated interface for its bases. The operations of a deprecated interface
still trigger the warning unless they are deprecated too.

What the `["deprecated"]` metadata directive generates depends on the language mapping:

- In C++ and C#, the generated code carries the language's deprecation attribute, `[[deprecated]]` or `[Obsolete]`, with
  the message, so the C++ or C# compiler warns about application code that uses a deprecated definition. For a
  deprecated operation, the attribute marks the proxy methods, so client code that calls the operation gets the warning;
  a servant that implements the operation does not. For a deprecated interface, C++ marks the proxy class, and C#
  generates no attribute.
- In JavaScript, the generated code carries a JSDoc `@deprecated` tag, with the message of the `@deprecated` doc-comment
  tag, or the metadata message when the doc comment gives none.
- In MATLAB, the generated help text has a "Deprecated" section, with the message of the `@deprecated` doc-comment tag
  when the definition has that tag, and otherwise the metadata message.
- In Ruby, the first invocation of a deprecated operation issues a Ruby warning, with the message, when Ruby runs with
  verbose warnings enabled. The directive has no effect on other definitions.
- In Java, PHP, Python, and Swift, the directive does not change the generated code's API and produces no warning. In
  Java, the [`@deprecated`](../documenting-slice-definitions/doc-comment-structure#@deprecated) doc-comment tag
  generates the `@Deprecated` annotation.

You can apply the `["deprecated"]` metadata directive to interfaces, classes, exceptions, structures, enumerations,
enumerators, sequences, dictionaries, constants, operations, and fields.

## See Also

- [`@deprecated` Doc-Comment Tag](../documenting-slice-definitions/doc-comment-structure#@deprecated)
