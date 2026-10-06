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
parameter type is deprecated. A deprecated class or interface does not trigger this warning for the definitions it
inherits from, and a deprecated class does not trigger it for the types of its fields.

What the `["deprecated"]` metadata directive generates depends on the language mapping:

- In C++ and C#, the generated code carries the language's deprecation attribute, `[[deprecated]]` or `[Obsolete]`, with
  the message, so the C++ or C# compiler warns about application code that uses a deprecated definition.
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
