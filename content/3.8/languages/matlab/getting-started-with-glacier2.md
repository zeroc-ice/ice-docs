---
id: getting-started-with-glacier2
language: matlab
---

{% language-section name="lang-1" %}

```matlab
router = Glacier2.RouterPrx(communicator, ...
    'Glacier2/router:tcp -h localhost -p 4063');
username = char(java.lang.System.getProperty('user.name'));
session = router.createSession(username, 'password');
```

{% /language-section %}
