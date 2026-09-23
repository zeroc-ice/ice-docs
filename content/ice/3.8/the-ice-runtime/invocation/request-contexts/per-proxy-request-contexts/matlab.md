{% language-section name="lang-1" %}

```matlab
% Create a request context.
context = configureDictionary('string', 'string');

% setting the context on the proxy.
context('language') = 'es';
greeterEs = greeter.ice_context(context);
```

{% /language-section %}
