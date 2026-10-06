{% language-section name="default-slice-loader" %}

The default Slice loader of Ice for Java converts the Slice type ID into a Java class name. It cannot locate the class
for a Slice class or exception when:

- you remap either the class name or an enclosing module using the `java:identifier` or `java:package` metadata; or
- you assign a compact ID to the class.

For these classes, install a [ClassSliceLoader](api:Ice/ClassSliceLoader) created from the generated classes, in the
same way as a custom Slice loader:

```java
var initData = new InitializationData();
initData.sliceLoader = new ClassSliceLoader(Compact.class, CompactExt.class);
```

{% /language-section %}

{% language-section name="custom-slice-loaders" %}

A custom Slice loader implements the `SliceLoader` functional interface. You install it by setting the `sliceLoader`
field of [InitializationData](api:Ice/InitializationData):

```java
var initData = new InitializationData();
initData.sliceLoader = typeId -> "::Demo::Node".equals(typeId) ? new MyNode() : null;
try (var communicator = new Communicator(initData)) {
    ...
}
```

{% /language-section %}
