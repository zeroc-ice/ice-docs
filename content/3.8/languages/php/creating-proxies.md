---
id: creating-proxies
language: php
---

{% language-section name="lang-1" %}

The generated helper class for a proxy provides a static factory method `createProxy` that creates a proxy from a
communicator and a [stringified representation](../syntax-for-stringified-proxies) of the proxy, as shown in the
following example:

```php
$greeter = GreeterPrxHelper::createProxy(
    $communicator,
    'greeter:tcp -h localhost -p 4061');
```

{% /language-section %}

{% language-section name="lang-2" %}

We can use the `propertyToProxy` method on `Communicator` to convert the property's value into a proxy. A null proxy is
returned if no property is found with the specified name.

```php
$greeter = $communicator->propertyToProxy('Greeter.Proxy');
```

{% /language-section %}

{% language-section name="lang-3" %}

```php
$greeter = GreeterPrxHelper::createProxy(
    $communicator,
    'greeter:tcp -h localhost -p 4061');
$greeter = $greeter->ice_endpointSelection(Ice\EndpointSelectionType::Ordered);
```

{% /language-section %}

{% language-section name="lang-4" %}

```php
$account = $bank->findAccount('WXY-123456');
```

{% /language-section %}
