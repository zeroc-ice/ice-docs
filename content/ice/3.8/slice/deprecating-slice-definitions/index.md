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

The message that follows the colon is optional, and says why the definition is deprecated or what to use instead. You
can apply the `["deprecated"]` metadata directive to interfaces, classes, exceptions, structures, enumerations,
enumerators, sequences, dictionaries, constants, operations, and fields.

The Slice compilers warn about a Slice definition that uses a deprecated definition, such as an operation whose
parameter type is deprecated. A deprecated definition does not trigger this warning for the definitions it uses, and
neither do the fields of a deprecated class, exception, or structure. The operations of a deprecated interface still
trigger it unless they are deprecated too.

What the `["deprecated"]` metadata directive generates depends on the language mapping:

- In C++ and C#, the generated code carries the language's deprecation attribute, `[[deprecated]]` or `[Obsolete]`, with
  the message, so the C++ or C# compiler warns about application code that uses a deprecated definition. Client code
  that calls a deprecated operation gets the warning; a servant that implements it does not. For a deprecated interface,
  `slice2cpp` marks the proxy class; `slice2cs` marks nothing for a deprecated interface or constant.
- In JavaScript, the TypeScript declaration file that `slice2js --typescript` generates carries a JSDoc `@deprecated`
  tag on every deprecated definition, and the JavaScript code carries it on a deprecated class, exception, structure,
  enumeration, or proxy class. The tag's text is the message of the `@deprecated` doc-comment tag, or the metadata
  message when the doc comment gives none.
- In MATLAB, the generated help text has a "Deprecated" section, with the message of the `@deprecated` doc-comment tag
  when the definition has that tag, and otherwise the metadata message.
- In Ruby, the Ice runtime issues a warning, with the message, the first time the application invokes a deprecated
  operation, when Ruby runs with verbose warnings enabled (`ruby -w`). The directive acts on operations only.
- In Java, PHP, Python, and Swift, the directive has no effect. In Java, the
  [`@deprecated`](../documenting-slice-definitions/doc-comment-structure#@deprecated) doc-comment tag generates the
  `@Deprecated` annotation.

## See Also

- [`@deprecated` Doc-Comment Tag](../documenting-slice-definitions/doc-comment-structure#@deprecated)
