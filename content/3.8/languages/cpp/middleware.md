---
id: middleware
language: cpp
---

{% language-section name="lang-1" %}
In C++, a middleware is a concrete class that implements `Ice::Object` and delegates to another dispatcher called “next”. For example:

```cpp
// A typical C++ middleware class
class AuthorizationMiddleware final : public Ice::Object
{
public:
    AuthorizationMiddleware(Ice::ObjectPtr next, std::string validToken);
    void dispatch(
        Ice::IncomingRequest& request, 
        std::function<void(Ice::OutgoingResponse)> sendResponse) final;
};
```

The constructor accepts the “next” dispatcher and other data, and `dispatch` dispatches incoming requests by delegating to “next”.

You install a middleware on an object adapter by calling `use`:

```cpp
class ObjectAdapter
{
public:
   ObjectAdapterPtr use(std::function<ObjectPtr(ObjectPtr)> middlewareFactory);
};
```

`use` accepts a middleware factory – not a middleware. This allows the object adapter to create and connect the middleware into its dispatch pipeline when it receives its first request.

For example, you can call `use` as follows:

```cpp
 adapter->use(
   [](Ice::ObjectPtr next)
   { 
        return make_shared<Server::AuthorizationMiddleware>(
            std::move(next), 
            "iced tea"); 
   });
```

The middleware, once created and woven into the dispatch pipeline, intercept requests in the order of their registration through `use`.
{% /language-section %}
