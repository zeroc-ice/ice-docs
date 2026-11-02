{% language-section name="mapping" %}

The [Ice context demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/php/Ice/context) provides a complete example of
using request context in PHP.

A client application can set a request context to send additional metadata:

```php
// We request a French greeting by setting 'language' in the context parameter.
$context = ["language" => "fr"];
$greeting = $greeter->greet("alice", $context);
```

{% /language-section %}
