{% language-section name="lang-1" %}

The example we present here is taken from the `IceBox/greeter` demo program.

The class definition for our service is quite straightforward:

```java
package com.example.icebox.greeter.service;

import com.zeroc.Ice.Communicator;
import com.zeroc.Ice.Identity;
import com.zeroc.Ice.ObjectAdapter;
import com.zeroc.IceBox.Service;

public class GreeterService implements Service {
    private ObjectAdapter _adapter;

    @Override
    public void start(String name, Communicator communicator, String[] args) {
        _adapter = communicator.createObjectAdapterWithEndpoints(
            "GreeterAdapter",
            "tcp -p 4061");

        _adapter.add(new Chatbot(), new Identity("greeter", ""));
        _adapter.activate();
        System.out.println("Listening on port 4061...");
    }

    @Override
    public void stop() {
        System.out.println("Shutting down...");

        assert _adapter != null;
        _adapter.destroy();
        _adapter = null;
    }
}
```

The `start` method creates an object adapter “GreeterAdapter”, activates a single servant of type `Chatbot` (not shown),
and activates the object adapter. The `stop` method simply destroys the object adapter.

### Java Service Entry Point

The last piece of the puzzle is the _entry point_, which the IceBox server calls to create an instance of the service.

IceBox requires a service implementation to have a public parameterless constructor or a public constructor with a
single `Communicator` parameter. This is the Java entry point for IceBox: the IceBox server dynamically loads the
service implementation class and calls this public constructor to create an instance of the service.

{% /language-section %}
