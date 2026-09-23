{% language-section name="lang-1" %}

# Ice.Default.CollocationOptimized

#### Synopsis

`Ice.Default.CollocationOptimized=num`

#### Description

Specifies whether proxy invocations use [collocation optimization](../collocated-invocation-and-dispatch) by default.
When enabled, proxy invocations on a collocated servant (i.e., a servant whose object adapter was created by the same
communicator as the proxy) are made more efficiently by avoiding the network stack.

If not specified, the default value is 1. Set the property to 0 to disable collocation optimization by default.

{% /language-section %}

{% language-section name="lang-2" %}

# Ice.Default.Package

#### Synopsis

`Ice.Default.Package=package`

#### Description

Ice for Java allows you to customize the Slice module to Java package mapping with the `java:package` and
`java:identifier` [metadata directive](../slice-metadata-directives).

When you use this feature, you need to help Ice locate your remapped classes during unmarshaling, by installing a
[Slice loader](../slice-loaders) in your communicator. The `Ice.Default.Package` property tells the Ice communicator to
install automatically a [DefaultPackageSliceLoader](https://code.zeroc.com/manual/Ice/DefaultPackageSliceLoader) during
initialization, configured using the value of this property.

This property is provided primarily for backwards compatibility; we recommend configuring Slice loaders programmatically
in new applications.

See also: [Ice.Package._module_](../ice-properties)

{% /language-section %}
