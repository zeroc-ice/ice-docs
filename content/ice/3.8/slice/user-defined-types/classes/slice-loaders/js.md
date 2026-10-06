{% language-section name="custom-slice-loaders" %}

A custom Slice loader is an object with a `newInstance` method. You install it by setting the `sliceLoader` property of
[InitializationData](api:Ice/InitializationData):

```typescript
const initData = new Ice.InitializationData();
initData.sliceLoader = {
    newInstance: (typeId: string) => (typeId === "::Demo::Node" ? new MyNode() : null),
};
await using communicator = new Ice.Communicator(initData);
```

{% /language-section %}
