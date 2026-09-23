{% language-section name="lang-1" %}

The configuration file for our example C++ service is shown below:

```
IceBox.Service.Greeter=GreeterService:create --Ice.Trace.Dispatch
```

Assuming this property resides in a configuration file named `config`, we can start the C++ IceBox server as follows:

```
icebox --Ice.Config=config
```

{% /language-section %}
