{% language-section name="mapping" %}

You create a communicator by using its constructor for example:

```typescript
import { Ice } from "@zeroc/ice";

await using communicator = new Ice.Communicator(process.argv);
```

This constructor accepts the argument vector. It scans the argument vector for any
[command-line options](../../properties-and-configuration/setting-properties-on-the-command-line) that are relevant to
the Ice runtime; any such options are removed from the argument vector so, when the constructor returns, the only
options and arguments remaining are those that concern your application. If anything goes wrong during initialization,
it throws an exception.

In a browser application, you should call the constructor without the argument vector.

`Communicator` implements the `asyncDispose` method. This allows you to create and cleanup your communicator with
`await using` as shown above.

{% /language-section %}
