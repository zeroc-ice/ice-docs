{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

```diff
-proxy = communicator.stringToProxy("greeter: tcp -h localhost -p 4061");
-greeter = GreeterPrx.uncheckedCast(proxy);
+greeter = GreeterPrx(communicator, 'greeter:tcp -h localhost -p 4061');
```

{% /language-section %}

{% language-section name="lang-3" %}

{% /language-section %}
