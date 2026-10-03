{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

```diff
-proxy = communicator.stringToProxy("greeter: tcp -h localhost -p 4061");
-greeter = GreeterPrx.uncheckedCast(proxy);
+greeter = GreeterPrx.new(communicator, "greeter:tcp -h localhost -p 4061")
```

{% /language-section %}

{% language-section name="lang-3" %}

## Loading Slice Files

`Ice::loadSlice` now takes a single argument: an array that holds one string per compiler argument. Ice 3.7 accepted a
command string, optionally followed by such an array.

```diff
-Ice::loadSlice("-I. Foo.ice")
-Ice::loadSlice("-I.", ["Foo.ice"])
+Ice::loadSlice(["-I.", "Foo.ice"])
```

## Communicator Initialization

`Ice::initialize` now takes at most one argument, either an argument array or an `Ice::InitializationData` object. Ice
3.7 also accepted the name of a configuration file, and an argument array followed by an `Ice::InitializationData`
object or by the name of a configuration file.

To combine command-line arguments with an `Ice::InitializationData` object, create its properties from the arguments,
with the properties it already holds as the defaults:

```diff
-Ice::initialize(ARGV, initData) do |communicator|
+initData.properties = Ice::createProperties(ARGV, initData.properties)
+Ice::initialize(initData) do |communicator|
     ...
 end
```

To combine command-line arguments with a configuration file, load the file into a `Properties` object and pass that
object as the defaults to `Ice::createProperties`:

```diff
-Ice::initialize(ARGV, "config.client") do |communicator|
+defaults = Ice::createProperties
+defaults.load("config.client")
+properties = Ice::createProperties(ARGV, defaults)
+Ice::initialize(Ice::InitializationData.new(properties)) do |communicator|
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

`Ice::Unset` is now an alias for `nil`. In Ice 3.7, `Ice::Unset` was a separate marker object that Ice returned for an
optional parameter, return value, or field without a value, and that the generated classes and exceptions used as the
initial value of an optional field with no default value in Slice. Ice 3.8 returns and uses `nil` in all these cases, so
a comparison with `Ice::Unset` still identifies an optional without a value, except for an optional proxy (see below).

Review the code that passes `nil` for an optional parameter or field. Ice 3.7 sent `nil` as a value: `false` for a
`bool`, a null proxy, an empty sequence, an empty dictionary, or a default-constructed struct. Ice 3.8 sends no value
for `nil`. To keep sending a value, pass `false`, an empty array, an empty hash, or a new instance of the struct:

```diff
-greeter.greetAll(nil)
+greeter.greetAll([])
```

An optional proxy no longer distinguishes a null proxy from a missing value: Ice 3.8 returns `nil` for both. An
application that relies on this distinction needs to represent it with a separate Slice parameter or field.

{% /language-section %}
