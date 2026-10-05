{% language-section name="using-the-ssl-transport-1" %}

```matlab
greeter = visitorcenter.GreeterPrx( ...
    communicator, ...
    'greeter:ssl -h localhost -p 4061');
```

{% /language-section %}
