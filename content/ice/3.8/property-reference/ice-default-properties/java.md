{% language-section name="ice.default.locatorcachetimeout" %}

## Ice.Default.Package

{% property-synopsis %}

`Ice.Default.Package=package`

{% /property-synopsis %}

{% property-description %}

Specifies the enclosing Java package of all top-level Slice modules, the same package as in their `java:package`
[metadata directive](../../slice/slice-metadata-directives).

When this property is set, the communicator adds a [DefaultPackageSliceLoader](api:Ice/DefaultPackageSliceLoader) to its
default [Slice loader](../../slice/user-defined-types/classes/slice-loaders). This loader maps Slice type IDs to Java
class names under the specified package. For example, with `Ice.Default.Package=com.example`, it loads
`com.example.Demo.Node` for the type ID `::Demo::Node`.

The loader finds a class or exception only when neither the type name nor an enclosing module name is remapped with
`java:identifier`.

See also: [Ice.Package._module_](../ice-properties)

{% /property-description %}

{% /language-section %}
