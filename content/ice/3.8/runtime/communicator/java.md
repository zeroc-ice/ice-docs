{% language-section name="creating" %}

You create a communicator by using its constructor, for example:

```java
class Client {
    public static void main(String[] args) {
        try (Communicator communicator = new Communicator(args)) {
            // ...
        }
    }
}
```

The constructor takes the command-line arguments passed to `main`. It
[sets a property](../properties-and-configuration/setting-properties-on-the-command-line) for each argument that names
an Ice property, and leaves `args` unchanged. To get the remaining arguments, call the constructor that also accepts a
`List<String> remainingArgs`, which it fills with the arguments that do not name an Ice property.

`Communicator` implements `AutoCloseable`. This allows you to create and clean up your communicator in a
try-with-resources statement as shown above.

{% /language-section %}

{% language-section name="initialization-data" %}

The constructor takes either the command-line arguments or an `InitializationData`. To set properties from the arguments
when you pass initialization data, create the properties from `args` and set them in the initialization data:

```java
var initData = new InitializationData();
initData.properties = new Properties(args);
// ... set other initData fields ...
try (var communicator = new Communicator(initData)) {
    // ...
}
```

{% /language-section %}
