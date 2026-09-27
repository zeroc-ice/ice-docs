{% language-section name="language-mapping" %}

## Client-Side Mapping for Operations

# Mapping for Operations

As we saw in the [Client-Side PHP Mapping for Interfaces](../client-side-php-mapping-for-interfaces), for each
[operation](../operations) on an interface, a proxy object narrowed to that interface’s type supports a method with the
same name. To invoke an operation, you call it via the proxy. For example, here is our definition from the
[greeter example](../defining-the-greeter-interface-in-slice):

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

Given a proxy to an object of type `Greeter`, the client can invoke the `greet` operation as follows:

```php
$greeter = VisitorCenter\GreeterPrxHelper::createProxy(
    $communicator, 'greeter:tcp -h localhost -p 4061');

$greeting = $greeter->greet('Alice');  // Get name via RPC
```

# Exception Handling

Any operation invocation may throw a [runtime exception](../local-and-dispatch-exceptions) and, if the operation has an
exception specification, may also throw [user exceptions](../local-and-dispatch-exceptions). Suppose we have the
following simple interface:

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

Slice exceptions are thrown as PHP exceptions, so you can simply enclose one or more operation invocations in a
`try-catch` block:

```php
$child = ...        // Get child proxy...

try {
    $child->askToCleanUp();
} catch(Tantrum $t) {
    echo "The child says: " . $t->reason . "\n";
}
```

##### See Also

- [PHP Mapping for Parameters and Return Values](../php-mapping-for-parameters-and-return-values)

## Mapping for Parameters and Return Values

# In Parameters

The PHP mapping for `in` parameters guarantees that the value of a parameter will not be changed by the invocation.

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

The Slice compiler generates the following methods for this definition:

```php
function op1($i, $f, $b, $s, $context=null);
function op2($ns, $ss, $st, $context=null);
function op3($proxy, $context=null);
```

Given a proxy to a `ClientToServer` object, the client code can pass parameters as in the following example:

```php
$p = ...                                 // Get proxy...

$p->op1(42, 3.14, true, "Hello world!"); // Pass simple literals

$i = 42;
$f = 3.14;
$b = true;
$s = "Hello world!";
$p->op1($i, $f, $b, $s);                 // Pass simple variables

$ns = new NumberAndString;
$ns->x = 42;
$ns->str = "The Answer";
$ss = array("Hello world!");
$st = array();
$st[0] = $ns;
$p->op2($ns, $ss, $st);                  // Pass complex variables

$p->op3($p);                             // Pass proxy
```

# Out Parameters

Out parameters are passed by reference. Here is the same Slice definition we saw earlier, but this time with all
parameters being passed in the out direction:

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

The PHP mapping looks the same as it did for the in parameters version:

```php
function op1($i, $f, $b, $s, $context=null);
function op2($ns, $ss, $st, $context=null);
function op3($proxy, $context=null);
```

Given a proxy to a `ServerToClient` object, the client code can receive the results as in the following example:

```php
$p = ...                 // Get proxy...
$p->op1($i, $f, $b, $s);
$p->op2($ns, $ss, $st);
$p->op3($stcp);
```

Note that it is not necessary to use the reference operator (`&`) before each argument because the Ice runtime forces
each `out` parameter to have reference semantics.

# Parameter Type Mismatches

Ice validates the arguments to a proxy invocation at runtime and reports any type mismatches as a
`InvalidArgumentException` exception.

# Null Parameters

Some Slice types naturally have "empty" or "not there" semantics. Specifically, sequences, dictionaries, and strings all
can be `null`, but the corresponding Slice types do not have the concept of a null value. To make life with these types
easier, whenever you pass `null` as a parameter or return value of type sequence, dictionary, or string, the Ice runtime
automatically sends an empty sequence, dictionary, or string to the receiver.

This behavior is useful as a convenience feature: especially for deeply-nested data types, members that are sequences,
dictionaries, or strings automatically arrive as an empty value at the receiving end. This saves you having to
explicitly initialize, for example, every string element in a large sequence before sending the sequence in order to
avoid a run-time error. Note that using null parameters in this way does _not_ create null semantics for Slice
sequences, dictionaries, or strings. As far as the object model is concerned, these do not exist (only _empty_
sequences, dictionaries, and strings do). For example, it makes no difference to the receiver whether you send a string
as `null` or as an empty string: either way, the receiver sees an empty string.

# Optional Parameters

[Optional parameters](../operations) use the same mapping as required parameters. The only difference is that
\`Ice\None` can be passed as the value of an optional parameter or return value. Consider the following operation:

```slice
optional(1) int execute(optional(2) string params, out optional(3) float value);
```

A client can invoke this operation as shown below:

```php
$i = $proxy->execute("--file log.txt", $v);
$i = $proxy->execute(\Ice\None, $v);

if($v != Ice_Unset)
{
    echo "value = " . $v . "\n";
}
```

A well-behaved program must always compare an optional parameter to `\Ice\None` prior to using its value. Keep in mind
that the `\Ice\None` marker value has different semantics than `null`. Since `null` is a legal value for certain Slice
types, the Ice runtime requires a separate marker value so that it can determine whether an optional parameter is set.
An optional parameter set to `null` is considered to be set.

{% /language-section %}
