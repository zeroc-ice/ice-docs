{% language-section name="mapping" %}

A Slice identifier maps to an identical Java identifier. For example, the Slice identifier `Clock` becomes the Java
identifier `Clock`. A single Slice identifier often results in several Java identifiers: for a Slice interface named
`Greeter`, the generated Java code uses the identifiers `Greeter`, `GreeterPrx`, and `AsyncGreeter`.

A Slice identifier that is a Java keyword keeps its name in the generated Java code, which then does not compile. Give
this identifier a Java name of your choice with the `java:identifier` metadata directive. For example, `synchronized` is
a Java keyword but a valid Slice identifier:

```slice
struct FileStatus
{
    ["java:identifier:isSynchronized"]
    bool synchronized;
}
```

In the generated Java code, the field `synchronized` becomes `isSynchronized`.

{% /language-section %}
