{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

```diff
-let proxy = communicator.stringToProxy("greeter: tcp -h localhost -p 4061")!
-let greeter = try uncheckedCast(prx: proxy, type: GreeterPrx.self)
+let greeter = try makeProxy(
+  communicator: communicator,
+  proxyString: "greeter:tcp -h localhost -p 4061",
+  type: GreeterPrx.self)
```

{% /language-section %}

{% language-section name="lang-3" %}

## async/await and Structured Concurrency

Ice for Swift now requires Swift 6.1 and includes support for `async/await` and structured concurrency. As a result
we’ve removed the dependency on `PromiseKit`. In addition all proxy invocations and dispatch operations are now `async`.

```diff
-let greeting = try greeter.greet(name)
+let greeting = try await greeter.greet(name)
print(greeting)

-firstly {
-    greeter.greetAsync(name)
-}.get { greeting in
-    print("\(greeting)")
-}
+let greeting = try await greeter.greet(name)
print(greeting)
```

```diff
-func greetAsync(name: String, current _: Current) -> Promise<String> {
    ...
}
+func greet(name: String, current _: Ice.Current) async throws -> String {
    ...
}
```

## Removed Dispatch Structs

Generated dispatch (Disp) structs for Slice interfaces have been removed. Implementations of server-side protocols can
now be used directly as ObjectAdapter servants.

```diff
-try adapter.add(servant: GreeterDisp(Chatbot()), id: Ice.Identity(name: "greeter"))
+try adapter.add(servant: Chatbot(), id: Ice.Identity(name: "greeter"))
```

{% /language-section %}
