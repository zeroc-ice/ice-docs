{% language-section name="creating" %}

You create a communicator by using its constructor, for example:

```typescript
import { Ice } from "@zeroc/ice";

await using communicator = new Ice.Communicator(process.argv);
```

This constructor takes the command-line arguments. It
[sets a property](../properties-and-configuration/setting-properties-on-the-command-line) for each argument that names
an Ice property, and removes these arguments from the array.

In a browser application, call the constructor without arguments, or with [initialization data](#initialization-data).

`Communicator` implements `[Symbol.asyncDispose]()`, so `await using` destroys the communicator when it goes out of
scope, as shown above. Without `await using`, call `await communicator.destroy()` when you no longer need it.

{% /language-section %}

{% language-section name="initialization-data" %}

The constructor takes either the command-line arguments or an `InitializationData`. To set properties from the arguments
when you pass initialization data, create the properties from the arguments and set them in the initialization data:

```typescript
const initData = new Ice.InitializationData();
initData.properties = new Ice.Properties(process.argv);
// ... set other initData fields ...
await using communicator = new Ice.Communicator(initData);
```

{% /language-section %}
