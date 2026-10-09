{% language-section name="default-slice-loader" %}

The default Slice loader of Ice for MATLAB converts the Slice type ID into a MATLAB class name, for example `::M::Node`
into `M.Node`. It cannot locate the class for a Slice class or exception when:

- you remap either the class name or an enclosing module using the `matlab:identifier` metadata; or
- you assign a compact ID to the class.

For these classes, create an `Ice.ClassSliceLoader` from the meta classes of the generated classes and give it to the
communicator, in the same way as a custom Slice loader:

```matlab
communicator = Ice.Communicator(args, SliceLoader = Ice.ClassSliceLoader(?Compact, ?CompactExt));
```

{% /language-section %}

{% language-section name="custom-slice-loaders" %}

A custom Slice loader derives from `Ice.SliceLoader` and implements its `newInstance` method, which returns an empty
array when it does not create an instance:

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
