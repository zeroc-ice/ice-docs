{% language-section name="mapping" %}

You create a communicator by calling `Ice::initialize`, for example:

```ruby
require 'Ice'

Ice.initialize(ARGV) do |communicator|
    ...
end
```

`Ice.initialize` accepts the argument list that is passed to the program by the operating system. The function scans the
argument list for any [command-line options](../../properties-and-configuration/setting-properties-on-the-command-line)
that are relevant to the Ice runtime; any such options are removed from the argument list so, when `Ice.initialize`
returns, the only options and arguments remaining are those that concern your application. If anything goes wrong during
initialization, `initialize` raises an exception.

With a block, `Ice.initialize` destroys the communicator when the block completes, including when it raises an
exception. Without a block, `Ice.initialize` returns the communicator, and you call `destroy` on it when you no longer
need it.

{% /language-section %}
