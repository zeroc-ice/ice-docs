{% language-section name="mapping" %}

The [Ice context demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/ruby/Ice/context) provides a complete example of
using request context in Ruby.

A client application can set a request context to send additional metadata:

```ruby
# We request a French greeting by setting the context parameter.
greeting = greeter.greet("alice", {"language"=>"fr"})
```

{% /language-section %}
