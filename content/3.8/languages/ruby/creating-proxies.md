---
id: creating-proxies
language: ruby
---

{% language-section name="lang-1" %}

The constructor of the generated proxy class allows you to construct a proxy from a communicator and a
[stringified representation](../syntax-for-stringified-proxies) of the proxy, as shown in the following example:

```ruby
greeter = GreeterPrx.new(communicator, "greeter:tcp -h localhost -p 4061")
```

{% /language-section %}

{% language-section name="lang-2" %}

We can use the `propertyToProxy` method on `Communicator` to convert the property's value into a proxy. A null proxy is
returned if no property is found with the specified name.

```ruby
greeter = communicator.propertyToProxy("Greeter.Proxy")
```

{% /language-section %}

{% language-section name="lang-3" %}

```ruby
greeter = GreeterPrx.new(communicator, "greeter:tcp -h localhost -p 4061")
greeter = greeter.ice_endpointSelection(Ice::EndpointSelectionType::Ordered)
```

{% /language-section %}

{% language-section name="lang-4" %}

```ruby
account = bank.findAccount('WXY-123456')
```

{% /language-section %}
