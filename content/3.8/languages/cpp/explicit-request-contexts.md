---
id: explicit-request-contexts
language: cpp
---

{% language-section name="lang-1" %}
The [Ice context demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/cpp/Ice/context) provides a complete example of using request context in C++.

Using the Slice greeter definitions once again:

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

A client application can set a request context to send additional metadata:

```cpp
// We request a French greeting by setting the context parameter.
string greeting = greeter->greet(name, {{"language", "fr"}});
```

On the server side, the request context is available through the ctx member of the `Ice::Current` parameter:

```cpp
string
Server::Chatbot::greet(string name, const Ice::Current& current)
{
    // We retrieve the value for the language entry in the context.
    auto p = current.ctx.find("language");
    string language = p != current.ctx.end() ? p->second : "";
    ...
}
```

{% /language-section %}
