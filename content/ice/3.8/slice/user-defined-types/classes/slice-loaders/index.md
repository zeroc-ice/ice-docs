---
title: Slice Loaders
---

When Ice unmarshals a Slice-defined class or exception, it starts by locating the mapped class and creating an instance
of this class.

The abstraction that drives this locate and create process is called the Slice loader. Each communicator has a default
Slice loader, implemented by Ice, that locates the generated class for a Slice type ID.

{% language-section name="default-slice-loader" /%}

## Custom Slice Loaders

{% iflang langs="cpp,csharp,java,js,matlab,python,ruby,swift" %}

You can install your own custom Slice loader on a communicator to create instances of your own classes, typically
classes derived from the generated classes, during unmarshaling. The communicator calls your Slice loader first, and
falls back on its default Slice loader when your Slice loader doesn't create an instance.

{% /iflang %}

{% language-section name="custom-slice-loaders" /%}

## See Also

- [Type IDs](../../../type-ids)
