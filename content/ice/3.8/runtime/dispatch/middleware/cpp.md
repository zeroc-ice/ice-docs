{% language-section name="mapping" %}

```cpp
class AuthorizationMiddleware final : public Ice::Object
{
public:
    AuthorizationMiddleware(Ice::ObjectPtr next, std::string validToken);
    void dispatch(
        Ice::IncomingRequest& request,
        std::function<void(Ice::OutgoingResponse)> sendResponse) final;
};
```

```cpp
adapter->use(
    [](Ice::ObjectPtr next)
    { return make_shared<AuthorizationMiddleware>(std::move(next), "iced tea"); });
```

{% /language-section %}
