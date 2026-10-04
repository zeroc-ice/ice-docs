{% language-section name="mapping" %}

## Client-Side Mapping for Operations

### Mapping for Operations

As we saw in the [Client-Side Ruby Mapping for Interfaces](../interfaces#client-side-mapping-for-interfaces), for each
[operation](./) on an interface, the generated proxy class contains a method with the same name. To invoke an operation,
you call this method on the proxy. For example, let’s take the generated code from the
[greeter example](../../greeter-example/defining-the-greeter-interface-in-slice):

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

The proxy class generated from the `Greeter` interface, after removing extra details, is as follows:

```ruby
module ::VisitorCenter
    module GreeterPrx_mixin
        def greet(name, context=nil)
            GreeterPrx_mixin::OP_greet.invoke(self, [name], context)
        end
    end

    class GreeterPrx < Ice::ObjectPrx
        include GreeterPrx_mixin
    end

    # ...
end
```

Given a proxy to an object of type `Greeter`, the client can invoke the `greet` operation as follows:

```ruby
greeter = VisitorCenter::GreeterPrx.new(
    communicator, "greeter:tcp -h localhost -p 4061")

greeting = greeter.greet("Alice")  # Get name via RPC
```

### Exception Handling

Any operation invocation may throw a [runtime exception](../../runtime/local-and-dispatch-exceptions) and, if the
operation has an exception specification, may also throw [user exceptions](../../runtime/local-and-dispatch-exceptions).
Suppose we have the following simple interface:

```slice
exception Tantrum
{
    string reason;
}

interface Child
{
    void askToCleanUp() throws Tantrum;
}
```

Slice exceptions are thrown as Ruby exceptions, so you can simply enclose one or more operation invocations in a
`begin-rescue` block:

```ruby
child = ...        # Get child proxy...

begin
    child.askToCleanUp()
rescue Tantrum => t
    puts "The child says: #{t.reason}"
end
```

## Mapping for Parameters and Return Values

### In Parameters

All parameters are passed by reference in the Ruby mapping; it is guaranteed that the value of a parameter will not be
changed by the invocation.

Here is an interface with operations that pass parameters of various types from client to server:

```slice
struct NumberAndString
{
    int x;
    string str;
}

sequence<string> StringSeq;

dictionary<long, StringSeq> StringTable;

interface ClientToServer
{
    void op1(int i, float f, bool b, string s);
    void op2(NumberAndString ns, StringSeq ss, StringTable st);
    void op3(ClientToServer* proxy);
}
```

The Slice compiler generates the following proxy for this definition:

```ruby
module ClientToServerPrx_mixin
  def op1(i, f, b, s, context=nil)
      ...
  end

  def op2(ns, ss, st, context=nil)
      ...
  end

  def op3(proxy, context=nil)
      ...
  end
end

class ClientToServerPrx < Ice::ObjectPrx
    include ClientToServerPrx_mixin
end
```

Given a proxy to a `ClientToServer` interface, the client code can pass parameters as in the following example:

```ruby
p = ...                                 # Get proxy...

p.op1(42, 3.14, true, "Hello world!")   # Pass simple literals

i = 42
f = 3.14
b = true
s = "Hello world!"
p.op1(i, f, b, s)                       # Pass simple variables

ns = NumberAndString.new()
ns.x = 42
ns.str = "The Answer"
ss = [ "Hello world!" ]
st = {}
st[0] = ss
p.op2(ns, ss, st)                       # Pass complex variables

p.op3(p)                                # Pass proxy
```

### Out Parameters and Return Values

The return value of a mapped method depends on how many values the corresponding Slice operation returns, including out
parameters and a non-`void` return value:

- Zero values The corresponding Ruby method returns `void`. For the purposes of this discussion, we're not interested in
  these operations.
- One value The client receives a single return value, regardless of whether the Slice definition of the operation
  declared it as a return value or as an out parameter.
- Two or more value The client receives them in the form of a _result array_. A non-`void` return value, if any, is
  always the first element in the result array, followed by the `out` parameters in the order of declaration.

Here again are the same Slice definitions we saw earlier, but this time with all parameters being passed in the `out`
direction:

```slice
struct NumberAndString
{
    int x;
    string str;
}

sequence<string> StringSeq;
dictionary<long, StringSeq> StringTable;

interface ServerToClient
{
    int op1(out float f, out bool b, out string s);

    void op2(out NumberAndString ns,
             out StringSeq ss,
             out StringTable st);

    void op3(out ServerToClient* proxy);
}
```

The Ruby mapping generates the following code for this definition:

```ruby
def op1(context=nil)
def op2(context=nil)
def op3(context=nil)
```

Given a proxy to a `ServerToClient` interface, the client code can receive the results as in the following example:

```ruby
p = ...              # Get proxy...
i, f, b, s = p.op1()
ns, ss, st = p.op2()
stcp = p.op3()
```

The operations have no `in` parameters, therefore no arguments are passed to the proxy methods. Since `op1` and `op2`
return multiple values, their result arrays are unpacked into separate values, whereas the return value of `op3`
requires no unpacking.

### Parameter Type Mismatches

Ice validates the arguments to a proxy invocation at runtime and reports any type mismatches as a `TypeError` exception.

### Nil Parameters

Slice sequences and dictionaries have no null value. When you pass `nil` for a sequence or dictionary, whether as a
parameter, a field, or a sequence element, Ice sends an empty sequence or dictionary, and the receiver gets an empty
value. For an [optional](#optional-parameters) parameter or field, `nil` instead leaves the value unset.

### Optional Parameters

[Optional parameters](./) use the same mapping as required parameters. The only difference is that `nil` can be passed
as the value of an optional parameter or return value to leave it unset. Consider the following operation:

```slice
optional(1) int execute(optional(2) string p, out optional(3) float value);
```

A client can invoke this operation as shown below:

```ruby
i, v = proxy.execute("--file log.txt")
i, v = proxy.execute(nil)

if v != nil
    puts "value = " + v.to_s
end
```

A well-behaved program must always compare an optional parameter to `nil` prior to using its value. `Ice::Unset` is an
alias for `nil`.

{% /language-section %}
