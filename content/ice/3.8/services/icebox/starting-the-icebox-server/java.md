{% language-section name="lang-1" %}

The configuration file for our example Java service is shown below:

```config
IceBox.Service.Greeter=com.example.icebox.greeter.service.GreeterService --Ice.Trace.Dispatch
```

Assuming this property resides in a configuration file named `config`, we can start the Java IceBox server as follows:

```shell
java com.zeroc.IceBox.Server --Ice.Config=config
```

The class path must include the Ice and IceBox JAR files, as well as the service's classes.

{% /language-section %}
