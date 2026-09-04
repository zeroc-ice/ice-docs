---
id: communicator-initialization-and-destruction
language: ruby
---

{% language-section name="lang-1" %}

You create a communicator by calling `Ice::initialize`, for example:

```ruby
require 'Ice'

Ice.initialize(ARGV) do |communicator|
    ...
end
```

`Ice,initialize` accepts the argument list that is passed to the program by the operating system. The function scans the
argument list for any [command-line options](../setting-properties-on-the-command-line) that are relevant to the Ice
runtime; any such options are removed from the argument list so, when `Ice.initialize` returns, the only options and
arguments remaining are those that concern your application. If anything goes wrong during initialization, `initialize`
throws an exception.

This syntax ensures the communicator is destroyed when the block completes. The `destroy` method is responsible for
cleaning up the communicator. In particular, `destroy` ensures that any outstanding threads started by the underlying
Ice C++ communicator are joined with and reclaims a number of operating system resources, such as file descriptors and
memory. Never allow your program to terminate without calling `destroy` first.

The `initialize` block accepts a single argument, the communicator.

{% /language-section %}
