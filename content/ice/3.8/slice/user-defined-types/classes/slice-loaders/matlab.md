{% language-section name="default-slice-loader" %}

The default Slice loader of Ice for MATLAB converts the Slice type ID into a MATLAB class name, for example `::M::Node`
into `M.Node`. It cannot locate the class for a Slice class or exception when:

- you remap either the class name or an enclosing module using the `matlab:identifier` metadata; or
- you assign a compact ID to the class.

For these classes, create an `Ice.ClassSliceLoader` from the meta classes of the generated classes and install it as
your custom Slice loader (see below); the communicator keeps using its default Slice loader for all other classes:

```matlab
communicator = Ice.Communicator(args, SliceLoader = Ice.ClassSliceLoader(?Compact, ?CompactExt));
```

{% /language-section %}

{% language-section name="custom-slice-loaders" %}

A custom Slice loader derives from `Ice.SliceLoader` and implements its `newInstance` method, which takes a type ID and
returns a new instance:

```matlab
classdef NodeLoader < Ice.SliceLoader
    methods
        function r = newInstance(~, typeId)
            if strcmp(typeId, '::Demo::Node')
                r = MyNode();
            else
                r = [];
            end
        end
    end
end
```

You install it with the `SliceLoader` argument of the `Ice.Communicator` constructor:

```matlab
communicator = Ice.Communicator(args, SliceLoader = NodeLoader());
```

{% /language-section %}
