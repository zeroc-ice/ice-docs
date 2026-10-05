{% language-section name="creating-a-proxy-from-a-string" %}

The constructor of the generated proxy class allows you to construct a proxy from a communicator and a
[stringified representation](../syntax-for-stringified-proxies) of the proxy, as shown in the following example:

```matlab
 greeter = GreeterPrx(communicator, 'greeter:tcp -h localhost -p 4061');
```

{% /language-section %}

{% language-section name="creating-a-proxy-from-a-property-1" %}

We can use the `propertyToProxy` method on `Communicator` to convert the property's value into a proxy. An empty array
(null proxy) is returned if no property is found with the specified name.

```matlab
greeter = communicator.propertyToProxy('Greeter.Proxy');
```

{% /language-section %}

{% language-section name="creating-a-proxy-from-a-property-2" %}

```matlab
greeter = GreeterPrx(communicator, 'greeter:tcp -h localhost -p 4061');
greeter = greeter.ice_endpointSelection(Ice.EndpointSelectionType.Ordered);
```

{% /language-section %}

{% language-section name="receiving-a-proxy-from-an-operation" %}

```matlab
account = bank.findAccount('WXY-123456');
```

{% /language-section %}
