{% language-section name="packaging" %}

### Swift Package

ZeroC distributes Ice for Swift as the Swift package `https://github.com/zeroc-ice/ice.git`. This package replaces the
Carthage dependency and the `ice-spm` Swift package of Ice 3.7.

| **Product**    | **Description**                                                        |
| -------------- | ---------------------------------------------------------------------- |
| `Ice`          | The main Ice library.                                                  |
| `Glacier2`     | The Glacier2 library, used by Glacier2 client applications.            |
| `IceBox`       | The IceBox library, used by IceBox client applications.                |
| `IceGrid`      | The IceGrid library, used by IceGrid client applications.              |
| `IceStorm`     | The IceStorm library, used by publishers and subscribers for IceStorm. |
| `CompileSlice` | A build tool plugin that compiles Slice files with `slice2swift`.      |

The package includes the `slice2swift` compiler, which the `CompileSlice` plugin runs during Swift Package Manager and
Xcode builds.

### Upgrade Steps

1. Remove Ice from the Carthage dependencies of your project, or remove the `ice-spm` package from `Package.swift`.
2. Add the `ice` package to `Package.swift`, and add the products you need to the dependencies of each target. The
   package requires macOS 15 or later, or iOS 18 or later, and Swift 6.1 or later: set the `swift-tools-version` of
   `Package.swift` to `6.1`.

   ```diff
   -// swift-tools-version: 5.5
   +// swift-tools-version: 6.1

    import PackageDescription

    let package = Package(
        name: "greeter",
   +    platforms: [.macOS(.v15)],
        dependencies: [
   -        .package(url: "https://github.com/zeroc-ice/ice-spm.git", from: "3.7.11"),
   -        .package(url: "https://github.com/mxcl/PromiseKit.git", from: "6.22.1"),
   +        .package(url: "https://github.com/zeroc-ice/ice.git", .upToNextMinor(from: "3.8.3"))
        ],
        targets: [
            .executableTarget(
                name: "Server",
   -            dependencies: [.product(name: "Ice", package: "ice-spm"), "PromiseKit"]
   +            dependencies: [.product(name: "Ice", package: "ice")],
   +            plugins: [.plugin(name: "CompileSlice", package: "ice")]
            )
        ]
    )
   ```

3. Add the `CompileSlice` plugin to each target that compiles Slice files, as shown above. The plugin compiles the
   `.ice` files among the source files of the target. To compile Slice files stored elsewhere, add a `slice-plugin.json`
   file to the source files of the target. Paths in this file are relative to its directory.

   ```json
   {
     "sources": ["../../slice/Greeter.ice"]
   }
   ```

   | Key            | Description                                                                                       |
   | -------------- | ------------------------------------------------------------------------------------------------- |
   | `sources`      | The Slice files that the plugin compiles. A directory stands for the `.ice` files directly in it. |
   | `search_paths` | The directories that `slice2swift` searches for included Slice files (`-I` options).              |

   The plugin adds the Slice files of Ice to the search path.

{% /language-section %}

{% language-section name="proxy-creation-1" %}

```diff
-let proxy = communicator.stringToProxy("greeter: tcp -h localhost -p 4061")!
-let greeter = try uncheckedCast(prx: proxy, type: GreeterPrx.self)
+let greeter = try makeProxy(
+  communicator: communicator,
+  proxyString: "greeter:tcp -h localhost -p 4061",
+  type: GreeterPrx.self)
```

{% /language-section %}

{% language-section name="proxy-creation-2" %}

## async/await and Structured Concurrency

Ice for Swift now requires Swift 6.1, uses `async/await` and structured concurrency, and no longer depends on
PromiseKit. Every proxy invocation is `async`:

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

Every operation of a skeleton protocol is now `async throws`, and the `amd` metadata directive no longer affects the
generated code. A servant method that completes synchronously and throws no exception keeps its Ice 3.7 signature, since
a method can omit `async` and `throws`:

```swift
func greet(name: String, current _: Ice.Current) -> String {
    ...
}
```

A servant method that implemented an `amd` operation with PromiseKit becomes an `async` method:

```diff
-func greetAsync(name: String, current _: Ice.Current) -> Promise<String> {
+func greet(name: String, current _: Ice.Current) async throws -> String {
    ...
}
```

## Sendable Servants

Skeleton protocols inherit `Sendable` from `Ice.Dispatcher`, and the object adapter dispatches each request in its own
task, so several tasks can call the same servant concurrently. Implement a servant with mutable state as an actor, or as
a final class that synchronizes access to its state and is declared `@unchecked Sendable`.

```diff
-class MFile: File {
+actor MFile: File {
    private var lines: [String] = []

    func write(text: [String], current _: Ice.Current) {
        lines = text
    }
}
```

## Removed Dispatch Structs

The generated dispatch structs, such as `GreeterDisp`, have been removed: you now add an object that implements the
skeleton protocol directly to the object adapter.

```diff
-try adapter.add(servant: GreeterDisp(Chatbot()), id: Ice.Identity(name: "greeter"))
+try adapter.add(servant: Chatbot(), id: Ice.Identity(name: "greeter"))
```

{% /language-section %}
