{% language-section name="mapping" %}

In C++, `entry_point` has the form `path[,version]:function`.

The `path` and optional `version` components are used to construct the name of a DLL or shared library. If no version is
supplied, the version is the empty string. The `function` component is the name of a function with extern C linkage. For
example, the entry point `IceStormService,38:createIceStorm` implies a shared library name of `libIceStormService.so.38`
on Linux, `libIceStormService.38.dylib` on macOS, and `IceStormService38.dll` on Windows. Furthermore, a Windows debug
build of the Ice library appends a `d` to the version (e.g., `IceStormService38d.dll`).

The function must be declared with extern C linkage and have the following signature:

```cpp
IceBox::Service* function(const Ice::CommunicatorPtr&);
```

Note that the function must return a raw pointer and not a `shared_ptr`. IceBox deallocates the object when it unloads
the library. The communicator instance passed to this function is the server's communicator, which is not the same as
the communicator passed to the service's `start` method.

The `path` component may optionally contain a relative or absolute path name, indicated by the presence of a path
separator (`/` or `\`). In this case, the last component of the path is used to construct the name of the shared library
or DLL. Consider this example:

```config
IceBox.Service.IceStorm=./IceStormService,38:createIceStorm
```

The use of a relative path means the Ice runtime will look in the current working directory for
`libIceStormService.so.38` on Linux or `IceStormService38.dll` on Windows.

If the `path` component contains spaces, the entire entry point must be enclosed in quotes:

```config
IceBox.Service.IceStorm="C:\Program Files\ZeroC\Ice-3.8\bin\IceStormService,38:createIceStorm"
```

If the `path` component does not include a leading path name, Ice delegates to the operating system to locate the shared
library or DLL, which typically means that the plug-in can reside in any of the directories in your shared library or
DLL search path.

{% /language-section %}
