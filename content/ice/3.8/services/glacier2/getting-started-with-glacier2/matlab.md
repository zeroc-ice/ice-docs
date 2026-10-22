{% language-section name="mapping" %}

```matlab
router = Glacier2.RouterPrx(communicator, ...
    'Glacier2/router:tcp -h 5.6.7.8 -p 4063');
username = char(java.lang.System.getProperty('user.name'));
session = router.createSession(username, 'password');
```

{% /language-section %}

{% language-section name="greeter-demo" %}

The [Glacier2 greeter demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/matlab/Glacier2/greeter) provides a MATLAB
client that runs against the router and server of a greeter demo written in another language.

{% /language-section %}
