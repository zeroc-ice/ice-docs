---
title: Alternate Property Stores
languages:
  - cpp
  - java
  - matlab
  - python
---

Ice can load properties from the Windows registry{% iflang langs="java" %} and from class loader resources{% /iflang %}.

## Loading Properties from the Windows Registry

On Windows, you can store properties under a key in `HKEY_LOCAL_MACHINE` or `HKEY_CURRENT_USER`. To load them, set
[Ice.Config](../using-configuration-files) to the path of this key with an `HKLM\` or `HKCU\` prefix, respectively:

```powershell
client --Ice.Config=HKLM\MyCompany\MyApp
```

Ice then loads the values of `HKEY_LOCAL_MACHINE\MyCompany\MyApp`: the name of each value is the name of a property,
such as `Ice.Trace.Network`, and its data is the property value. You can also pass an `HKLM\` or `HKCU\` path to
`Properties.load`.

Ice loads string values only, including for numeric properties: store `Ice.Trace.Network` as the string `3`, not as a
`DWORD`. An expandable string (`REG_EXPAND_SZ`) can refer to environment variables, such as `%ICE_HOME%`, which Ice
expands.

{% iflang langs="java" %}

## Loading Properties from Java Resources

Ice for Java looks for a configuration file named by [ICE_CONFIG or Ice.Config](../using-configuration-files) on the
class path first, and then in the file system. A configuration file can therefore be part of the JAR file of your
application, of another JAR file, or of a directory on the class path. For example:

```shell
export ICE_CONFIG=app_config
```

loads the `app_config` resource when the class path has one, and the `app_config` file otherwise. A resource path uses a
relative Unix-like format, such as `subdir/myfile`.

{% /iflang %}

## See Also

- [Using Configuration Files](../using-configuration-files)
