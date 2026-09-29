{% language-section name="lang-1" %}

For a Java service, the [entry point](../icebox-properties) is typically the class name (including any package) of the
service implementation class, but may also include a leading path to a class directory or JAR file. The class must
define a public constructor.

To create the service, the IceBox server first checks to see if the service defines a constructor taking an argument of
type `com.zeroc.Ice.Communicator`. If so, the server invokes this constructor and passes the server's communicator,
which should only be used for administrative purposes. For example, the constructor could use this communicator's logger
to display log messages. For a service's normal operations, it must use the communicator that it receives as an argument
to its `start` method.

If the service does not define a constructor taking a `com.zeroc.Ice.Communicator` argument, the server invokes the
service's default constructor.

Here is a sample configuration for our [Java example](../developing-icebox-services):

```config
IceBox.Service.Greeter=com.example.icebox.greeter.service.GreeterService --Ice.Trace.Network=1 hello there
```

This configuration results in the creation of a service named `Greeter`. The service is expected to reside in the class
`com.example.icebox.greeter.service.GreeterService`. The argument `--Ice.Trace.Network=1` is converted into a property
definition, and the arguments `hello` and `there` become the two elements in the `args` sequence parameter that is
passed to the `start` method.

{% /language-section %}
