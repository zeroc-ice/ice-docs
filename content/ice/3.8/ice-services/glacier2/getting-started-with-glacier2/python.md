---
id: getting-started-with-glacier2
language: python
---

{% language-section name="lang-1" %}

```py
router = Glacier2.RouterPrx(
    communicator,
    "Glacier2/router:tcp -h localhost -p 4063")
session = await router.createSessionAsync(getpass.getuser(), "password")
```

{% /language-section %}
