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
parameter type is deprecated.

## See Also

- [`@deprecated` Doc-Comment Tag](../documenting-slice-definitions/doc-comment-structure#@deprecated)
