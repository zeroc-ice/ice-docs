{% language-section name="proxy-creation-1" %}

```diff
-proxy = communicator.stringToProxy("greeter: tcp -h localhost -p 4061");
-greeter = GreeterPrx.uncheckedCast(proxy);
+greeter = GreeterPrx.new(communicator, "greeter:tcp -h localhost -p 4061")
```

{% /language-section %}

{% language-section name="proxy-creation-2" %}

## Loading Slice Files

`Ice::loadSlice` now takes a single argument: an array that holds one string per compiler argument. Ice 3.7 accepted a
command string, optionally followed by such an array.

```diff
-Ice::loadSlice("-I. Foo.ice")
-Ice::loadSlice("-I.", ["Foo.ice"])
+Ice::loadSlice(["-I.", "Foo.ice"])
```

## Arguments of Ice::initialize

`Ice::initialize` now takes at most one argument, either an argument array or an `Ice::InitializationData` object.

To combine command-line arguments with an `Ice::InitializationData` object, create its properties from the arguments,
with the properties it already holds as the defaults:

```diff
-Ice::initialize(ARGV, initData) do |communicator|
+initData.properties = Ice::createProperties(ARGV, initData.properties)
+Ice::initialize(initData) do |communicator|
     ...
 end
```

To combine command-line arguments with a configuration file, add `--Ice.Config` to the arguments:

```diff
-Ice::initialize(ARGV, "config.client") do |communicator|
+Ice::initialize(ARGV + ["--Ice.Config=config.client"]) do |communicator|
     ...
 end
```

The block given to `Ice::initialize` now takes a single parameter, the communicator. Ice 3.7 also accepted a block with
a second parameter that received the remaining command-line arguments. `Ice::initialize` and `Ice::createProperties`
remove the options they recognize from the array you pass, so read the remaining arguments from that array:

```diff
-Ice::initialize(ARGV) do |communicator, args|
-    run(communicator, args)
+Ice::initialize(ARGV) do |communicator|
+    run(communicator, ARGV)
 end
```

## Optional Values

`Ice::Unset` is now an alias for `nil`: Ice returns `nil` for an optional parameter, return value or field without a
value, an optional field with no default value in Slice is initially `nil`, and a `nil` you pass for an optional
parameter or field means "not set". Code that compares with `Ice::Unset` keeps working.

## Using nil for a Struct

A non-optional struct parameter or field no longer accepts `nil`. Ice 3.7 marshaled a default-constructed struct in its
place. Pass an instance of the struct:

```diff
-greeter.setLocation(nil)
+greeter.setLocation(VisitorCenter::Location.new)
```

{% /language-section %}
