{% language-section name="lang-1" %}

You can stringify a proxy by calling `toString` on this proxy. For example:

```js
const greeter = new GreeterPrx(communicator, "greeter:tcp -h localhost -p 4061");
const s = greeter.toString();
```

`toString` stringifies non-printable ASCII characters and non-ASCII characters in the proxy's identity, facet and object
adapter ID as specified through the [Ice.ToStringMode](../ice-properties) property.

{% /language-section %}

{% language-section name="lang-2" %}

```js
const greeter = new GreeterPrx(
    communicator,
    "greeter:tcp -h localhost -p 4061");
const propertyDict = communicator.proxyToProperty(greeter,"Greeter");
```

```typescript
const greeter = new GreeterPrx(
    communicator,
    "greeter:tcp -h localhost -p 4061");
const propertyDict: Map<string,string> =
    communicator.proxyToProperty(greeter,"Greeter");
```

{% /language-section %}
