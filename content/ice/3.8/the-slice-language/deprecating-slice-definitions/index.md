---
title: Deprecating Slice Definitions
---

All Slice compilers support a metadata directive that allows you to deprecate a Slice definition. For example:

```slice
interface Example
{
    ["deprecated:Use alternativeOperation instead."]
    void someOperation();

    void alternativeOperation();
}
```

The `["deprecated"]` metadata directive causes the compiler to emit code that generates a warning if you compile
application code that uses a deprecated feature. This is useful if you want to remove a feature from a Slice definition
but do not want to cause a hard error.

The message that follows the colon is optional; if you omit the message and use `["deprecated"]`, the Slice compilers
insert a default message into the generated code.

You can apply the `["deprecated"]` metadata directive to most Slice constructs, including operations, interfaces,
structures and classes.

##### See Also

- [Generating Slice Documentation](../generating-slice-documentation)
