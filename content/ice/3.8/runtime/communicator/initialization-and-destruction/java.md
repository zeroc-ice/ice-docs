{% language-section name="mapping" %}

You create a communicator by using its constructor, for example:

```java
class Client {
    public static void main(String[] args) {
        try (Communicator communicator = new Communicator(args)) {
            ...
        }
    }
}
```

The constructor accepts the argument vector that is passed to `main` by the operating system. The constructor scans the
argument vector for any
[command-line options](../../properties-and-configuration/setting-properties-on-the-command-line) that are relevant to
the Ice runtime; if anything goes wrong during initialization, it throws an exception. The constructor leaves `args`
unchanged; to get the arguments that remain once the Ice options are removed, call the constructor that also accepts a
`List<String> remainingArgs`, which it fills with these arguments.

{% callout type="warning" %}

Class
[com.zeroc.Ice.Communicator](https://code.zeroc.com/ice/3.8/api/java/com.zeroc.ice/com/zeroc/Ice/Communicator.html)
provides additional constructor overloads to pass other information to the Ice runtime.

{% /callout %}

`Communicator` implements `AutoCloseable`. This allows you to create and cleanup your communicator in a
try-with-resources statement as shown above.

Both `close` and `destroy` destroy the communicator. `close`, which try-with-resources calls, completes the destruction
even when the calling thread is interrupted, and then restores the thread's interrupt status. `destroy` throws
`OperationInterruptedException` when the calling thread is interrupted while `destroy` waits during the destruction; the
destruction is then incomplete, and you complete it by calling `destroy` or `close` again.

{% /language-section %}
