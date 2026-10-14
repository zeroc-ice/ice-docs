{% language-section name="ice.default.encodingversion" %}

## Ice.Default.CollocationOptimized

{% property-synopsis %}

`Ice.Default.CollocationOptimized=num`

{% /property-synopsis %}

{% property-description %}

Specifies whether proxy invocations use [collocation optimization](../../runtime/collocated-invocation-and-dispatch) by
default. When enabled, proxy invocations on a collocated servant (i.e., a servant whose object adapter was created by
the same communicator as the proxy) are made more efficiently by avoiding the network stack.

If not specified, the default value is 1. Set the property to 0 to disable collocation optimization by default.

{% /property-description %}

{% /language-section %}

{% language-section name="ice.default.locatorcachetimeout" %}

## Ice.Default.Package

{% property-synopsis %}

`Ice.Default.Package=package`

{% /property-synopsis %}

{% property-description %}

Specifies the base Java package for top-level Slice modules, typically the package that the `java:package`
[metadata directive](../../slice/slice-metadata-directives) sets.

When this property is set, the communicator adds a [DefaultPackageSliceLoader](api:Ice/DefaultPackageSliceLoader) to its
default [Slice loader](../../slice/user-defined-types/classes/slice-loaders). This loader maps Slice type IDs to Java
class names under the specified package. For example, with `Ice.Default.Package=com.example`, it loads
`com.example.Demo.Node` for the type ID `::Demo::Node`.

The loader can find a class or exception only if its Slice module and type names are preserved in Java.

This property is provided primarily for backwards compatibility; we recommend configuring Slice loaders programmatically
in new applications.

See also: [Ice.Package._module_](../ice-properties)

{% /property-description %}

{% /language-section %}
