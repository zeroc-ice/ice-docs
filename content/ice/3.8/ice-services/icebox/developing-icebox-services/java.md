{% language-section name="lang-1" %}

## Java Service Entry Point

The _entry point_ is what the IceBox server calls to create an instance of the service.

IceBox requires a service implementation to have a public parameterless constructor or a public constructor with a
single `Communicator` parameter. This is the Java entry point for IceBox: the IceBox server dynamically loads the
service implementation class and calls this public constructor to create an instance of the service.

{% /language-section %}
