{% language-section name="mapping" %}

```cpp
class CustomSessionManager : public Glacier2::SessionManager
{
public:

    optional<Glacier2::SessionPrx> create(
        string username,
        optional<Glacier2::SessionControlPrx> ctrl,
        const Ice::Current& current) override
    {
        string category = "_" + username;
        ctrl->categories()->add(category);
        // ...
    }
};
```

{% /language-section %}
