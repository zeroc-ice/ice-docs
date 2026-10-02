---
title: Setting Environment Variables in Descriptors
---

[Server descriptors](../server-descriptor-element) and [IceBox descriptors](../icebox-descriptor-element) may specify
environment variables that the node will define when starting a server. An environment variable definition uses the
familiar `name=value` syntax, and you can also refer to other environment variables within the value. The exact syntax
for variable references depends on the platform on which the server's descriptor is deployed.

On a Linux, the Bourne shell syntax is required:

```text
LD_LIBRARY_PATH=/opt/Ice/lib:$LD_LIBRARY_PATH
```

On a Windows platform, the syntax uses the conventional style:

```text
PATH=C:\Ice\lib;%PATH%
```

In XML, the `env` element supplies a definition for an environment variable:

```xml
<node name="LinuxBox">
    <server id="UnixServer" exe="/opt/app/bin/server" ...>
        <env>LD_LIBRARY_PATH=/opt/Ice/lib:$LD_LIBRARY_PATH</env>
        ...
    </server>
</node>
<node name="WindowsBox">
    <server id="WindowsServer" exe="C:/app/bin/server.exe" ...>
        <env>PATH=C:\Ice\lib;%PATH%</env>
        ...
    </server>
</node>
```

If a value refers to an environment variable that is not defined, the reference is substituted with an empty string.

Environment variable definitions may also refer to
[descriptor variables and template parameters](../../using-descriptor-variables-and-parameters):

```xml
<node name="LinuxBox">
    <server id="LinuxServer" exe="/opt/app/bin/server" ...>
        <env>PATH=${server.distrib}/bin:$PATH</env>
        ...
    </server>
</node>
```

On Linux, an environment variable `VAR` can be referenced as `$VAR` or `${VAR}`. You must be careful when using the
latter syntax because IceGrid assumes `${VAR}` refers to a descriptor variable or parameter and will report an error if
no match is found. If you prefer to use this style to refer to environment variables, you must escape these occurrences
as shown in the example below:

```xml
<node name="LinuxBox">
    <server id="LinuxServer" exe="/opt/app/bin/server" ...>
        <env>PATH=${server.distrib}/bin:$${PATH}</env>
        ...
    </server>
</node>
```

IceGrid does not attempt to perform [substitution](../../using-descriptor-variables-and-parameters) on `$${PATH}`, but
rather removes the leading `$` character and then performs environment variable substitution on `$${PATH}`.

## See Also

- [Server Descriptor Element](../server-descriptor-element)
- [IceBox Descriptor Element](../icebox-descriptor-element)
- [Using Descriptor Variables and Parameters](../../using-descriptor-variables-and-parameters)
