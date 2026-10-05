{% language-section name="language-mapping" %}

## Client-Side Mapping for Operations

### Mapping for Operations

For each Slice operation defined on an interface, the generated proxy class provides a method with the same name. To
invoke an operation, you call this method on the proxy.

For example, consider the following Slice definition:

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

The generated proxy class (simplified) looks like this:

```js
class GreeterPrx extends Ice.ObjectPrx {
    constructor(communicator, proxyString) { ... }

    greet(name, context) { ... }

    // ...
}
```

And the TypeScript declaration:

```typescript
export namespace VisitorCenter {
    export class GreeterPrx extends Ice.ObjectPrx {
        constructor(communicator: Ice.Communicator, proxyString: string);

        greet(name: string, context?: Map<string, string>): Ice.AsyncResult<string>;

        // ...
    }
}
```

{% callout type="note" %}

`Ice.AsyncResult` extends the JavaScript `Promise` type. It adds functionality specific to Ice invocations.

{% /callout %}

Given a proxy to a Greeter object, a client can invoke greet as follows:

```typescript
const greeter = new VisitorCenter.GreeterPrx(
    communicator,
    "greeter:tcp -h localhost -p 4061");

const greeting = await greeter.greet("Alice");  // Get name via RPC
```

Ice for JavaScript supports only **asynchronous method invocation (AMI)**. The JavaScript runtime does not provide a
blocking I/O model in order to keep the event loop responsive.

The arguments passed to the promise resolution depend on the operation signature:

- If the operation has a **single return value**, the promise is fulfilled with that value.
- If the operation has a **return value and/or out parameters**, the promise is fulfilled with an array: the return
  value (if any) followed by the out parameters.

### Exception Handling

Any operation invocation may throw a [local exception](../../runtime/local-and-dispatch-exceptions) and, if the
operation has an exception specification, may also throw [user exceptions](../exceptions). Suppose we have the following
simple interface:

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

Slice exceptions are thrown as JavaScript exceptions, so you can simply enclose one or more operation invocations in a
try-catch block:

```typescript
const child = ...   // Get child proxy...

try {
    await child.askToCleanUp();
} catch (error: unknown) {
    if (error instanceof Tantrum) {
        console.log("The child says:", error.reason);
    } else {
        throw error;
    }
}
```

## Server-Side Mapping for Operations

For each Slice operation defined on an interface, the generated skeleton class includes a corresponding abstract member
function with the same name.

For example, consider the following Slice definition:

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

The generated JavaScript skeleton class is:

```js
VisitorCenter.Greeter = class extends Ice.Object {};
```

Since JavaScript does not support abstract methods, the generated class does not provide an actual abstract declaration.
Instead, the servant class that derives from this skeleton must add the operation implementations, as if the methods
were abstract.

This is clearer in the generated TypeScript declarations, which can use abstract methods:

```typescript
export abstract class Greeter extends Ice.Object {
    abstract greet(
        name: string,
        current: Ice.Current): PromiseLike<string> | string;
    ...
```

The servant implementation can choose how to provide the result:

- **Return the result directly** (synchronous implementation).
- **Return a promise-like object** that will be fulfilled with the result.
- **Declare the method as async** and use await inside the implementation.

**Synchronous version:**

```typescript
greet(name: string, current: Ice.Current): PromiseLike<string> | string {
    return `Hello, ${name}`;
}
```

**Asynchronous version:**

```typescript
async greet(name: string, current: Ice.Current): Promise<string> {
    // Nested async invocation
    return await this._target.greet(name);
}
```

## Mapping for Parameters and Return Values

### Passing Parameters in JavaScript

The parameter passing rules for the JavaScript mapping are very simple: parameters are passed either by value (for
simple types) or by reference (for complex types). Semantically, the two ways of passing parameters are identical: it is
guaranteed that the value of a parameter will not be changed by the invocation.

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

The Slice compiler generates the following proxy methods for these definitions:

```js
class ClientToServerPrx extends Ice.ObjectPrx {
    op1(i, f, b, s, context) { ... }
    op2(ns, ss, st, context) { ... }
    op3(proxy, context) { ... }
}
```

```typescript
abstract class ClientToServerPrx extends Ice.ObjectPrx {
    op1(
        i:number,
        f:number,
        b:boolean,
        s:string,
        context?:Map<string, string>):Ice.AsyncResult<void>;

    op2(
        ns:NumberAndString,
        ss:StringSeq,
        st:StringTable,
        context?:Map<string, string>):Ice.AsyncResult<void>;

    op3(
        proxy:ClientToServerPrx,
        context?:Map<string, string>):Ice.AsyncResult<void>;
}
```

Given a proxy to a `ClientToServer` interface, the client code can pass parameters as in the following example:

```js
const p = ...;          // Get ClientToServerPrx proxy...

await p.op1(42, 3.14, true, "Hello world!");  // Pass simple literals

const i = 42;
const f = 3.14;
const b = true;
const s = "Hello world!";
await p.op1(i, f, b, s);                      // Pass simple variables

const ns = new NumberAndString();
ns.x = 42;
ns.str = "The Answer";
const ss = [];
ss.push("Hello world!");
const st = new StringTable();
st.set(0, ss);
await p.op2(ns, ss, st);                      // Pass complex variables

await p.op3(p);                               // Pass proxy
```

### Null Parameters in JavaScript

Some Slice types naturally have "empty" or "not there" semantics. Specifically, sequences, dictionaries, and strings all
can be `null`, but the corresponding Slice types do not have the concept of a null value. To make life with these types
easier, whenever you pass `null` as a parameter or return value of type sequence, dictionary, or string, the Ice run
time automatically sends an empty sequence, dictionary, or string to the receiver.

This behavior is useful as a convenience feature: especially for deeply-nested data types, members that are sequences,
dictionaries, or strings automatically arrive as an empty value at the receiving end. This saves you having to
explicitly initialize, for example, every string element in a large sequence before sending the sequence in order to
avoid a run-time error. Note that using null parameters in this way does _not_ create null semantics for Slice
sequences, dictionaries, or strings. As far as the object model is concerned, these do not exist (only _empty_
sequences, dictionaries, and strings do). For example, whether you send a string as `null` or as an empty string makes
no difference to the receiver: either way, the receiver sees an empty string.

### Optional Parameters in JavaScript

[Optional parameters](./) use the same mapping as required parameters. The only difference is that `undefined` can be
passed as the value of an optional parameter or return value to indicate an "unset" condition. Consider the following
operation:

```slice
optional(1) int execute(optional(2) string params, out optional(3) float value);
```

The corresponding proxy method is:

```typescript
execute(
  params?: string | undefined,
  context?: Map<string, string>):
  Ice.AsyncResult<[number | undefined, number | undefined]>;
```

{% callout type="note" %}

For optional parameters and optional return values, there is not distinction between `null` and `undefined`, both are
treated as a not set optional and unmarshall as `undefined`.

{% /callout %}

{% /language-section %}
