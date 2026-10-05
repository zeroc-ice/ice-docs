{% language-section name="proxy-creation-1" %}

```diff
-proxy = communicator.stringToProxy("greeter: tcp -h localhost -p 4061");
-greeter = GreeterPrx.uncheckedCast(proxy);
+greeter = GreeterPrx.new(communicator, "greeter:tcp -h localhost -p 4061")
```

{% /language-section %}
