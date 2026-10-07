{% language-section name="mapping" %}

```ruby
router = Glacier2::RouterPrx.new(
    communicator,
    "Glacier2/router:tcp -h 5.6.7.8 -p 4063")

username = Etc.getlogin
session = router.createSession(username, "password")
```

{% /language-section %}
