{% language-section name="api" %}

`Properties` is a protocol. Create an empty set with `Ice.createProperties()`, or pass an argument array to parse
arguments and load configuration files. Passing `&args` selects the overload that removes consumed options.

```swift
let properties = try Ice.createProperties(&args)
properties.setProperty(key: "Filesystem.MaxFileSize", value: "1024")
let maxFileSize = try properties.getPropertyAsInt("Filesystem.MaxFileSize")
let copy = properties.clone()
```

The `WithDefault` methods use `key:` and `value:` labels, for example
`try properties.getPropertyAsIntWithDefault(key: "Filesystem.MaxFileSize", value: 1024)`. Use
`try properties.parseCommandLineOptions(prefix: "Filesystem", options: args)` to parse application options, and
`try properties.load("config")` to load a file.

{% /language-section %}
