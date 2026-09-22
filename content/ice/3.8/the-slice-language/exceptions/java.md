---
id: exceptions
language: java
---

{% language-section name="lang-1" %}

A Slice exception is mapped to a Java class with the same name. This mapping is similar to the mapping of
[classes](../java-mapping-for-classes).

Consider the following Slice exceptions:

```slice
module M
{
    exception GenericException
    {
        string reason;
    }

    exception BadTimeValException extends GenericException {}
}
```

The Slice compiler generates the following code for these exceptions:

```csharp
public class GenericException extends com.zeroc.Ice.UserException {
    public String reason;

    public GenericException() {
        this.reason = "";
    }

    public GenericException(String reason) {
        this.reason = reason;
    }

    // ...
}

public class BadTimeValException extends GenericException {
    public BadTimeValException() {
    }

    public BadTimeValException(String reason) {
        super(reason);
    }

    // ...
}
```

There are a number of things to note about this generated code:

1. The generated class `GenericException` inherits from `UserException`. `UserException` is the ultimate ancestor of all
   mapped exceptions. It’s a checked exception that derives from `java.lang.Exception`.
2. The generated class contains a public field for each Slice field.
3. The generated class for `BadTimeValException` derives from the generated class `GenericException`.
4. The generated class provides a canonical constructor and a parameterless constructor; they are identical to the
   generated constructors for classes. See [Java Mapping for Classes](../java-mapping-for-classes).

## Exception Specification

When an Slice operation has an exception specification, the corresponding client-side and server-side methods in Java
have an exception specification. This is true for all mapped methods, except the proxy `Async` methods.

For example:

```
interface Greeter
{
    ["amd"]
    string greet(string name) throws BadNameException, GoneFishingException;
}
```

maps to:

```java
// Client-side
public interface GreeterPrx extends com.zeroc.Ice.ObjectPrx {
    default String greet(String name)
        throws BadNameException, GoneFishingException {
        ...
    }

    default String greet(String name, java.util.Map<String, String> context)
        throws BadNameException, GoneFishingException {
        ...
    }

    // No exception specification
    default CompletableFuture<String> greetAsync(String name) {
        ...
    }

    default CompletableFuture<String> greetAsync(String name, java.util.Map<String, String> context) {
        ...
    }
}

// Server-side
public interface Greeter extends com.zeroc.Ice.Object {
    CompletionStage<String> greetAsync(String name, com.zeroc.Ice.Current current)
        throws BadNameException, GoneFishingException;
}
```

{% callout type="info" %}

If you remap your exception class name or the name of the enclosing package with `java:identifier` or `java:package`,
remember to set a custom [Slice loader](../slice-loaders) in communicators that receive this exception.

{% /callout %}

{% /language-section %}
