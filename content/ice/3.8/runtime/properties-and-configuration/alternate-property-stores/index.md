---
title: Alternate Property Stores
---

Ice for C++, Java, MATLAB, and Python can load properties from the Windows registry. Ice for Java can also load
properties from class loader resources. Ice for C#, JavaScript, PHP, and Ruby support neither.

## Loading Properties from the Windows Registry

On Windows, store property settings under a key in `HKEY_LOCAL_MACHINE` or `HKEY_CURRENT_USER`. Set `Ice.Config` to the
key's path with an `HKLM\` or `HKCU\` prefix, respectively. For example:

```powershell
client --Ice.Config=HKLM\MyCompany\MyApp
```

For this example, Ice loads the string values under `HKEY_LOCAL_MACHINE\MyCompany\MyApp`. You can also pass an `HKLM\`
or `HKCU\` path directly to `Properties.load`.

The name of each string value is the name of the property (such as `Ice.Trace.Network`). Note that the value must be a
string (even if the property setting is numeric). For example, to set `Ice.Trace.Network` to 3, you must store the
string "3" as the value, not a binary or `DWORD` value.

String values in the registry can be regular strings (`REG_SZ`) or expandable strings (`REG_EXPAND_SZ`). Expandable
strings allow you to include symbolic references to environment variables (such as `%ICE_HOME%`). Ice skips values of
other types. C++ and the mappings based on its runtime also log an "unsupported type for Windows registry property"
warning for these values.

Ice applies the same [property validation](../properties-overview#property-validation) to the names it reads from the
registry as to the names in a configuration file, so an unknown property name that begins with a reserved prefix
followed by a dot makes communicator initialization fail with a `PropertyException`.

## Loading Properties from Java Resources

The Ice runtime for Java supports the ability to load a configuration file as a class loader resource, which is
especially useful for deploying an Ice application in a self-contained JAR file. For example, suppose we define
[ICE_CONFIG](../using-configuration-files) as shown below:

```shell
export ICE_CONFIG=app_config
```

During the creation of a property set (which often occurs implicitly when initializing a new communicator), Ice asks the
Java runtime to search the application's class path for a file named `app_config`. This file might reside in the same
JAR file as the application's class files, or in a different JAR file in the class path, or it might be a regular file
located in one of the directories in the class path. If Java is unable to locate the configuration file in the class
path, Ice attempts to open the file in the local file system.

The class path resource always takes precedence over a regular file. In other words, if a class path resource and a
regular file are both present with the same path name, Ice always loads the class path resource in preference to the
regular file.

The path name for a class path resource uses a relative Unix-like format such as `subdir/myfile`. Java searches for the
resource relative to each JAR file or subdirectory in an application's class path.

## See Also

- [Using Configuration Files](../using-configuration-files)
