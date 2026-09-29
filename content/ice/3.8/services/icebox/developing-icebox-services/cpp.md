{% language-section name="lang-1" %}

The example we present here is taken from the `IceBox/greeter` demo program.

The class definition for our service is quite straightforward:

```cpp
#include <IceBox/IceBox.h>

namespace Service
{
    class GreeterService final : public IceBox::Service
    {
    public:
        void start(
            const std::string& name,
            const Ice::CommunicatorPtr& communicator,
            const Ice::StringSeq& args) final;

        void stop() final;
    };
}
```

The implementation is equally straightforward:

```cpp
void
Service::GreeterService::start(
    [[maybe_unused]] const string& name,
    const Ice::CommunicatorPtr& communicator,
    [[maybe_unused]] const Ice::StringSeq& args)
{
    assert(!_adapter);
    _adapter = communicator->createObjectAdapterWithEndpoints(
        "GreeterAdapter",
        "tcp -p 4061");

    _adapter->add(
        make_shared<GreeterServer::Chatbot>("Syd"),
        Ice::Identity{"greeter"});

    _adapter->activate();
    cout << "Listening on port 4061..." << endl;
}

void
Service::GreeterService::stop()
{
    cout << "Shutting down..." << endl;

    assert(_adapter);
    _adapter->destroy();
    _adapter = nullptr;
}
```

The `start` method creates an object adapter “GreeterAdapter”, activates a single servant of type `Chatbot` (not shown),
and activates the object adapter. The `stop` method simply destroys the object adapter.

## C++ Service Entry Point

The last piece of the puzzle is the _entry point_ function, which the IceBox server calls to create an instance of the
IceBox service:

```cpp
extern "C"
{
    ICE_DECLSPEC_EXPORT IceBox::Service*
    create(const Ice::CommunicatorPtr&)
    {
        return new Service::GreeterService;
    }
}
```

In this example, the `create` function returns a new instance of the `GreeterService` service. The name of the function
is not important, but it must have the signature shown above. In particular, the function must have C linkage, accept a
single `const Ice::CommunicatorPtr&` parameter and return an `IceBox::Service*`.

{% /language-section %}
