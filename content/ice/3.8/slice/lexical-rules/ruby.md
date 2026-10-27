{% language-section name="mapping" %}

A Slice identifier maps to a Ruby identifier derived from it. For example, the Slice interface `Greeter` maps to the
Ruby class `GreeterPrx`.

The mapping changes the case of the first letter of some identifiers:

- It capitalizes the names of modules, interfaces, classes, exceptions, structures, enumerations, enumerators, and
  constants, as Ruby requires for constant, class, and module names. For example, the Slice enumerator `red` maps to the
  Ruby constant `Red`.
- It lowercases the first letter of parameter names.

Operation and field names keep their case.

A Slice identifier that is a Ruby keyword keeps its name in the generated Ruby code, which is then invalid. Give this
identifier a Ruby name of your choice with the `ruby:identifier` metadata directive. For example, `retry` is a Ruby
keyword but a valid Slice identifier:

```slice
struct Policy
{
    ["ruby:identifier:retryCount"]
    int retry;
}
```

In the generated Ruby code, the field `retry` becomes `retryCount`. The mapping uses an identifier set with
`ruby:identifier` as is.

{% /language-section %}
