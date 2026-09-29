{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

The metadata directives for Java uses the `java` prefix.

### `java:buffer`

This directive applies to [sequences](../sequences) of certain primitive types. It directs the Slice compiler to map the
sequence to a subclass of `java.nio.Buffer`.

### `java:getset`

This directive applies to fields, structures, classes, and exceptions. It adds accessor and modifier methods
([JavaBean methods](../fields)) for fields.

### `java:identifier:java-identifier`

This directive applies to all Slice constructs, and instructs the Slice compiler to use the specified `java-identifier`.

For example:

```slice
struct Descriptor
{
    ["java:identifier:ephemeral"]
    bool transient;
}
```

The `java:identifier` directive in this example remaps the Slice field `transient` (a Java keyword) to `ephemeral` in
Java.

{% callout type="warning" %}

When you apply this directive to a module that contains classes or exceptions, or directly to a class or an exception,
you need to install a [Slice loader](../slice-loaders) in communicators that receive (unmarshal) these classes or
exceptions. Without a Slice loader, the communicator cannot locate the Java class and the unmarshaling fails.

{% /callout %}

### `java:package:enclosing-java-package`

This deprecated directive applies to top-level modules and can also be used as file metadata. It instructs the Slice
compiler to place the generated Java package in the specified Java package. You should use `java:identifier` instead on
your modules.

{% callout type="warning" %}

When you apply this directive to a module that contains classes or exceptions, you need to install a
[Slice loader](../slice-loaders) in communicators that receive (unmarshal) these classes or exceptions. Without a Slice
loader, the communicator cannot locate the Java class and the unmarshaling fails.

{% /callout %}

### `java:serializable`

This directive applies to `sequence<byte>`. It allows you to use Ice to transmit serializable Java classes as native
objects, without having to define corresponding Slice definitions for these classes.

### `java:serialVersionUID`

The Slice-to-Java compiler computes a default value for the `serialVersionUID` member of Slice [classes](../classes),
[exceptions](../exceptions) and [structures](../structures). This directive overrides the this default generated value.

By using this metadata, the application assumes responsibility for updating the UID whenever changes to the Slice
definition affect the serializable state of the type.

### `java:type:<instance-type[:formal-type]>`

This directive allows you to use custom types for [sequences](../sequences) and [dictionaries](../dictionaries).

### `java:UserException`

This directive applies to operations, and indicates that the generated Java methods on the mapped servant interface and
class can throw any user exception, regardless the exception specification of the Slice operation. The exception
specification for these methods is simply `throws com.zeroc.Ice.UserException`. This metadata has no effect on the
methods of generated proxies.

{% /language-section %}
