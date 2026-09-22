---
id: explicit-request-contexts
language: ruby
---

{% language-section name="lang-1" %}

The [Ice context demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/ruby/Ice/context) provides a complete example of
using request context in Ruby.

Using the Slice greeter definitions once again:

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

A client application can set a request context to send additional metadata:

```ruby
# We request a French greeting by setting the context parameter.
greeting = greeter.greet(Etc.getlogin, {"language"=>"fr"})
```

{% /language-section %}
