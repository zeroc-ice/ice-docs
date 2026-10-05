{% language-section name="using-the-ssl-transport-1" %}

```ruby
greeter = VisitorCenter::GreeterPrx.new(
    communicator,
    "greeter:ssl -h localhost -p 4061");
```

{% /language-section %}
