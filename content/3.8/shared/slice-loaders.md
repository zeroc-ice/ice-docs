---
id: slice-loaders
title: Slice Loaders
---

When Ice unmarshals a Slice-defined class or exception, it starts by locating and creating an instance of the mapped class, using the parameterless constructor of the mapped class.

The abstraction that drives this locate and create process is called the Slice loader. You can install your own custom Slice loader on a communicator by setting the `sliceLoader` field in [InitializationData](https://code.zeroc.com/manual/Ice/InitializationData). Such a custom Slice loader allows you to instantiate custom (derived) implementations during unmarshaling. This custom Slice loader is always in addition to an internal Slice loader that Ice uses when you don't set a custom Slice loader or when your Slice loader returns null.

In most languages, generated classes for Slice classes and exceptions register themselves at startup with a default Slice loader implemented by Ice, and you don't need to do anything to help Ice locate these generated classes. However, in Java and MATLAB, there is no such registration at startup, and you need to help Ice locate these generated classes when:

- you remap either the class name or an enclosing module using the `java:identifier`, `java:package`, or `matlab:identifier` metadata; or
- you assign a compact ID to your class

You help Ice locate these classes by installing a Slice loader in `InitializationData`, just like when you provide a custom Slice loader. Ice for Java and Ice for MATLAB provide implementations of `SliceLoader` for this purpose. For example, you can use the [ClassSliceLoader](https://code.zeroc.com/manual/Ice/ClassSliceLoader) implementation to create a Slice loader for one or more generated classes (typically classes with remapped names or compact IDs).

##### See Also

- [Type IDs](../type-ids)
