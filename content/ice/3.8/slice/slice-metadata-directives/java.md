{% language-section name="general-metadata-directives" %}

The mapped skeleton method for `getGrid` is:

```java
GridIntf.GetGridMarshaledResult getGrid(com.zeroc.Ice.Current current);
```

where `GetGridMarshaledResult` is a nested static class with a constructor that accepts a parameter for the return
value, followed by `Current`:

```java
// Generated server-side code
public interface GridIntf extends com.zeroc.Ice.Object {
    public static class GetGridMarshaledResult implements
          com.zeroc.Ice.MarshaledResult {
        public GetGridMarshaledResult(
            Grid returnValue,
            com.zeroc.Ice.Current current) {
            ...
        }
    }
    ...
}
```

A typical implementation of the `getGrid` operation in your servant would be:

```java
@Override
public GridIntf.GetGridMarshaledResult getGrid(com.zeroc.Ice.Current current) {
    synchronized (_mutex) {
       // marshal _grid field within synchronization
       return new GridIntf.GetGridMarshaledResult(_grid, current);
    }
}
```

{% /language-section %}

{% language-section name="language-specific-metadata-directives" %}

Java metadata directives use the `java` prefix.

### java:buffer

`["java:buffer"]`. Applies to sequences of certain basic types.

This directive maps the [sequence](../user-defined-types/sequences) to a subclass of `java.nio.Buffer`.

### java:getset

`["java:getset"]`. Applies to fields, structs, classes, and exceptions.

This directive adds accessor and modifier methods ([JavaBean methods](../fields)) for fields.

### java:identifier

`["java:identifier:name"]`. Applies to any definition, parameter, or field.

This directive maps the Slice construct to the Java identifier `name`. For example:

```slice
struct Descriptor
{
    ["java:identifier:ephemeral"]
    bool transient;
}
```

The field `transient` maps to `ephemeral` in Java, because `transient` is a Java keyword.

{% callout type="warning" %}

When you apply this directive to a module that contains classes or exceptions, or directly to a class or an exception,
you need to install a [Slice loader](../user-defined-types/classes/slice-loaders) in communicators that receive
(unmarshal) these classes or exceptions.

{% /callout %}

### java:package

`["java:package:package"]` or `[["java:package:package"]]`. Applies to top-level modules and Slice files.

This deprecated directive places the generated Java package in the Java package `package`. Use `java:identifier` on your
modules instead.

{% callout type="warning" %}

When you apply this directive to a module that contains classes or exceptions, communicators that receive (unmarshal)
these classes or exceptions need a [Slice loader](../user-defined-types/classes/slice-loaders) to locate their Java
classes. Setting the matching [Ice.Package._module_](../../property-reference/ice-properties#ice.package.module)
property or [Ice.Default.Package](../../property-reference/ice-default-properties#ice.default.package) to `package` also
works.

{% /callout %}

### java:serializable

`["java:serializable:class"]`. Applies to `sequence<byte>`.

This directive maps the sequence to `class`, the fully qualified name of a Java class that implements
`java.io.Serializable`, so that you can transmit serializable Java objects without defining them in Slice. Ice transmits
the Java serialization of the object as a sequence of bytes, which other language mappings receive as a plain byte
sequence. See
[Filling a Sequence of Bytes with a Serializable Object](../user-defined-types/sequences#filling-a-sequence-of-bytes-with-a-serializable-object)
for an example.

### java:serialVersionUID

`["java:serialVersionUID:uid"]`. Applies to classes, exceptions, and structs.

The Slice-to-Java compiler computes a default value for the `serialVersionUID` member of Slice
[classes](../user-defined-types/classes), [exceptions](../exceptions), and
[structures](../user-defined-types/structures). This directive replaces this value with `uid`, an integer literal. The
application is then responsible for updating the UID whenever changes to the Slice definition affect the serializable
state of the type.

### java:type

`["java:type:instance-type"]` or `["java:type:instance-type:formal-type"]`. Applies to sequences and dictionaries.

This directive maps a [sequence](../user-defined-types/sequences) or [dictionary](../user-defined-types/dictionaries) to
a custom Java type.

### java:UserException

`["java:UserException"]`. Applies to operations.

The methods of the mapped servant interface and class declare `throws com.zeroc.Ice.UserException`, so they can throw
any user exception, regardless of the exception specification of the Slice operation. This directive does not change the
methods of the generated proxies.

{% /language-section %}
