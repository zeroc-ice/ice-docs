{% language-section name="proxy-creation-1" %}

```diff
-$proxy = $communicator->stringToProxy("greeter: tcp -h localhost -p 4061");
-$greeter = GreeterPrxHelper::uncheckedCast($proxy);
+$greeter =
+    GreeterPrxHelper::createProxy($communicator, 'greeter:tcp -h localhost -p 4061');
```

{% /language-section %}
