{% language-section name="lang-1" %}

```matlab
router = Glacier2.RouterPrx(communicator, ...
    'Glacier2/router:tcp -h 5.6.7.8 -p 4063');
username = char(java.lang.System.getProperty('user.name'));
session = router.createSession(username, 'password');
```

{% /language-section %}
