{% language-section name="creating" %}

You create a communicator by calling `Ice.initialize`, for example:

```ruby
require 'Ice'

Ice.initialize(ARGV) do |communicator|
    ...
end
```

`Ice.initialize` takes the command-line arguments of the program. It
[sets a property](../properties-and-configuration/setting-properties-on-the-command-line) for each argument that names
an Ice property, and removes these arguments from the array.

With a block, `Ice.initialize` destroys the communicator when the block completes, including when it raises an
exception. Without a block, `Ice.initialize` returns the communicator, and you call `destroy` on it when you no longer
need it.

{% /language-section %}

{% language-section name="initialization-data" %}

`Ice.initialize` takes either the command-line arguments or an `InitializationData`. To set properties from the
arguments when you pass initialization data, create the properties from the arguments and set them in the initialization
data:

```ruby
initData = Ice::InitializationData.new
initData.properties = Ice.createProperties(ARGV)
# ... set other initData fields ...
Ice.initialize(initData) do |communicator|
    ...
end
```

{% /language-section %}
