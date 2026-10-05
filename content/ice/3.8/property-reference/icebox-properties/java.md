{% language-section name="mapping" %}

In Java, `entry_point` has the form `[path:]class`.

The `class` component must be the name of a class that implements the `com.zeroc.IceBox.Service` interface and provides
at least one of the constructors shown in the example below:

```java
public class MyService implements com.zeroc.IceBox.Service {
    public MyService(com.zeroc.Ice.Communicator serverCommunicator);
    public MyService();

    // ...
}
```

The constructor taking a `Communicator` argument is invoked if present, otherwise the default constructor is invoked.

If `path` is specified, it may be the path name of a JAR file or class directory, as shown below:

```config
IceBox.Service.MyService=MyService.jar:MyService
IceBox.Service.MyOtherService=/classes:MyOtherService
```

If `path` contains spaces, it must be enclosed in quotes:

```config
IceBox.Service.MyService="factory classes.jar":MyService
```

IceBox uses a single class loader to load all services having the same value for `path`.

If `class` is specified without a path, IceBox attempts to load the class with the current thread's context class
loader, then with `Class.forName`, and finally with the system class loader.

{% /language-section %}
