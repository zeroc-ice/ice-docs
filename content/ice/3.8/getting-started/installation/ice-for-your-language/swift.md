{% language-section name="language" %}

## Ice for Swift

Ice for Swift is a Swift package, for macOS 15 and iOS 18 and later. Add it to the dependencies of your package, and add
the `CompileSlice` build tool plugin to each target that has Slice files:

```swift
// swift-tools-version: 6.1

import PackageDescription

let package = Package(
    name: "greeter",
    platforms: [.macOS(.v15)],
    dependencies: [.package(url: "https://github.com/zeroc-ice/ice.git", .upToNextMinor(from: "3.8.3"))],
    targets: [
        .executableTarget(
            name: "Client",
            dependencies: [.product(name: "Ice", package: "ice")],
            plugins: [.plugin(name: "CompileSlice", package: "ice")]
        )
    ]
)
```

The package provides the `Ice`, `Glacier2`, `IceBox`, `IceGrid`, and `IceStorm` libraries.

{% /language-section %}
