---
id: developing-icebox-services
language: java
---

{% language-section name="lang-1" %}

The example we present here is taken from the `IceBox/greeter` demo program.

The class definition for our service is quite straightforward:

```java
// TODO: copy from Java demo once written
```

The `start` method creates an object adapter “GreeterAdapter”, activates a single servant of type `Chatbot` (not shown),
and activates the object adapter. The `stop` method simply destroys the object adapter.

## Java Service Entry Point

The last piece of the puzzle is the _entry point_, which the IceBox server calls to create an instance of the service.

IceBox requires a service implementation to have a public parameterless constructor or a public constructor with a
single `Communicator` parameter. This is the Java entry point for IceBox: the IceBox server dynamically loads the
service implementation class and calls this public constructor to create an instance of the service.

{% /language-section %}
