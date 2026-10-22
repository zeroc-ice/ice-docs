{% language-section name="mapping" %}

```ruby
router = Glacier2::RouterPrx.new(
    communicator,
    "Glacier2/router:tcp -h 5.6.7.8 -p 4063")

username = Etc.getlogin
session = router.createSession(username, "password")
```

{% /language-section %}

{% language-section name="greeter-demo" %}

The [Glacier2 greeter demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/ruby/Glacier2/greeter) provides a Ruby
client that runs against the router and server of a greeter demo written in another language.

{% /language-section %}
