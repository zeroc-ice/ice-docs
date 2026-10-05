{% language-section name="mapping" %}

```ruby
router = Glacier2::RouterPrx.new(
    communicator,
    "Glacier2/router:tcp -h localhost -p 4063")

username = Etc.getlogin
session = router.createSession(username, "password")
```

{% /language-section %}
