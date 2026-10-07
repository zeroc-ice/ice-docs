{% language-section name="mapping" %}

## Client-Side Mapping for Operations

### Mapping for Operations

As we saw in the [Client-Side PHP Mapping for Interfaces](../interfaces#client-side-mapping-for-interfaces), for each
[operation](./) on an interface, a proxy object narrowed to that interface’s type supports a method with the same name.
To invoke an operation, you call it via the proxy. For example, here is our definition from the
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

Given a proxy to an object of type `Greeter`, the client can invoke the `greet` operation as follows:

```php
$greeter = VisitorCenter\GreeterPrxHelper::createProxy(
    $communicator, 'greeter:tcp -h localhost -p 4061');

$greeting = $greeter->greet('Alice');  // Get name via RPC
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

## Mapping for Parameters and Return Values

### In Parameters

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

The Ice extension gives a `ClientToServer` proxy the following methods:

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
$st[0] = $ss;
$p->op2($ns, $ss, $st);                  // Pass complex variables

$p->op3($p);                             // Pass proxy
```

### Out Parameters

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
    void op1(out int i, out float f, out bool b, out string s);
    void op2(out NumberAndString ns,
             out StringSeq ss,
             out StringTable st);
    void op3(out ServerToClient* proxy);
}
```

The Ice extension gives a `ServerToClient` proxy the following methods:

```php
function op1(&$i, &$f, &$b, &$s, $context=null);
function op2(&$ns, &$ss, &$st, $context=null);
function op3(&$proxy, $context=null);
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

### Parameter Type Mismatches

Ice validates the arguments to a proxy invocation at runtime and reports any type mismatches as a
`InvalidArgumentException` exception.

### Null Parameters

Slice strings, sequences, and dictionaries have no null value. When you pass `null` for one of these types, whether as a
parameter, a field, or a sequence element, Ice sends an empty string, sequence, or dictionary.

### Optional Parameters

[Optional parameters](./) use the same mapping as required parameters. The only difference is that `Ice\None` can be
passed as the value of an optional parameter or return value. Consider the following operation:

```slice
optional(1) int execute(optional(2) string params, out optional(3) float value);
```

A client can invoke this operation as shown below:

```php
$i = $proxy->execute("--file log.txt", $v);
$i = $proxy->execute(\Ice\None, $v);

if($v != \Ice\None)
{
    echo "value = " . $v . "\n";
}
```

A well-behaved program must always compare an optional parameter to `\Ice\None` prior to using its value. Keep in mind
that the `\Ice\None` marker value has different semantics than `null`. Since `null` is a legal value for certain Slice
types, the Ice runtime requires a separate marker value so that it can determine whether an optional parameter is set.
An optional parameter set to `null` is considered to be set.

{% /language-section %}
