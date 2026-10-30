---
title: Using Ice with CMake
sidebarLabel: CMake
languages: [cpp]
---

Ice for C++ ships with a CMake package that defines an imported library target for each Ice library, such as `Ice::Ice`
and `Ice::IceGrid`, and the `slice2cpp_generate` function, which compiles the Slice files of a target as part of the
build. For example:

```cmake
cmake_minimum_required(VERSION 3.21)
project(greeter CXX)

find_package(Ice REQUIRED CONFIG)

add_executable(client Client.cpp Greeter.ice)
slice2cpp_generate(client)
target_link_libraries(client PRIVATE Ice::Ice)
```

The package requires CMake 3.21 or later. The `CONFIG` keyword makes `find_package` use config mode: it loads the
package configuration file that Ice for C++ provides, rather than the `FindIce` find module that ships with CMake.
Config mode is what CMake recommends for a project that provides its own package configuration
([cmake-packages(7)](https://cmake.org/cmake/help/latest/manual/cmake-packages.7.html)).

On Linux and macOS, if you installed Ice in a directory that CMake does not search by default, such as `/opt/Ice`, add
that directory to `CMAKE_PREFIX_PATH`.

`slice2cpp_generate(client)`:

- compiles each Slice file in the sources of `client` with `slice2cpp`, and adds the generated header and source files
  to the target's sources;
- adds the directory of the generated headers to the target's include directories, so `Client.cpp` can
  `#include "Greeter.h"`;
- passes `Ice_SLICE_DIR`, the directory of the Ice Slice files, to `slice2cpp` with `-I`, so
  `#include <Ice/Identity.ice>` resolves;
- records the Slice files that each Slice file includes in a dependency file, so the build compiles a Slice file again
  when it, or a file it includes, changes.

Call `slice2cpp_generate` in the same `CMakeLists.txt` as the `add_executable` or `add_library` call that creates the
target, after that call lists the target's Slice files.

## Imported Targets

`find_package` defines an imported library target for each Ice library in the installation:

| Library             | Imported target             |
| ------------------- | --------------------------- |
| Ice                 | `Ice::Ice`                  |
| DataStorm           | `Ice::DataStorm`            |
| Glacier2            | `Ice::Glacier2`             |
| IceBox              | `Ice::IceBox`               |
| IceDiscovery        | `Ice::IceDiscovery`         |
| IceGrid             | `Ice::IceGrid`              |
| IceLocatorDiscovery | `Ice::IceLocatorDiscovery`  |
| IceStorm            | `Ice::IceStorm`             |
| IceBT               | `Ice::IceBT`, on Linux only |

Each target adds the directory of the Ice headers, the one that contains `Ice/Ice.h`, to the include directories of the
target that links it, and links the Ice libraries that its library depends on, so a target that links `Ice::IceGrid`
also links `Ice::Glacier2` and `Ice::Ice`.

List the Ice libraries your project links as `COMPONENTS`, and `find_package` checks that the installation provides
them:

```cmake
find_package(Ice REQUIRED CONFIG COMPONENTS IceGrid IceStorm)
```

## Windows

On Windows, Ice for C++ is the `ZeroC.Ice.Cpp` NuGet package. Install the package, then set `Ice_ROOT` to its directory
before calling `find_package`:

```shell
nuget install ZeroC.Ice.Cpp -Version 3.8.3 -OutputDirectory packages
```

```cmake
set(Ice_ROOT "${CMAKE_CURRENT_SOURCE_DIR}/packages/ZeroC.Ice.Cpp.3.8.3")
find_package(Ice REQUIRED CONFIG)
```

Windows finds the Ice DLLs only when they are next to the executable or on `PATH`. The following post-build command
copies the Ice DLLs that `client` links, and the bzip2 DLL that Ice depends on, next to the executable:

```cmake
if(WIN32)
  add_custom_command(TARGET client POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy
      $<TARGET_RUNTIME_DLLS:client>
      $<GENEX_EVAL:$<TARGET_PROPERTY:Ice::Ice,ICE_RUNTIME_DLLS>>
      $<TARGET_FILE_DIR:client>
    COMMAND_EXPAND_LISTS
  )
endif()
```

## `slice2cpp_generate` Arguments

| Argument                                             | Description                                                                                                                   |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `INCLUDE_DIRS <dir>...`                              | Directories to search for included Slice files, passed to `slice2cpp` with `-I`.                                              |
| `OPTIONS <option>...`                                | Other `slice2cpp` options, such as `-D` or `--header-ext`.                                                                    |
| `HEADER_OUTPUT_DIR <dir>`                            | The directory for the generated headers, instead of the default under the build directory.                                    |
| `INCLUDE_DIR <dir>`                                  | The include prefix of the generated headers, passed to `slice2cpp` with `--include-dir`.                                      |
| `INCLUDE_SCOPE PRIVATE\|PUBLIC`                      | With `PUBLIC`, the targets that link this target also get the directories of the generated headers. The default is `PRIVATE`. |
| `DEPENDS <dep>...`                                   | Other files whose changes recompile the Slice files.                                                                          |
| `GENERATED_HEADERS <var>`, `GENERATED_SOURCES <var>` | Variables that receive the paths of the generated headers and sources.                                                        |

## Generated Files

By default, `slice2cpp_generate` writes the files it generates for a target under `generated/<target>` in the current
binary directory, `CMAKE_CURRENT_BINARY_DIR`.

Within this directory, `slice2cpp_generate` keeps the path of each Slice file relative to the `INCLUDE_DIRS` directory
that contains this file. For example, with `INCLUDE_DIRS ${CMAKE_CURRENT_SOURCE_DIR}/slice`, the Slice file
`slice/Demo/Weather.ice` generates `Demo/Weather.h` and `Demo/Weather.cpp` under `generated/<target>`. `slice2cpp` uses
the same path in the generated `#include` directives: the `#include <Demo/Weather.ice>` directive of another Slice file
becomes `#include <Demo/Weather.h>` in the header generated from that file (see [Header Files](..#header-files)). A
Slice file outside the `INCLUDE_DIRS` directories generates its files directly in `generated/<target>`.

## Sharing Generated Headers Between Targets

Set `INCLUDE_SCOPE PUBLIC` so that targets that link your library can include its generated headers.

`slice2cpp_generate` compiles only the Slice files listed in the target's sources, and uses `INCLUDE_DIRS` only to find
the Slice files included by these files. The recommended way to share a Slice file between several targets is to compile
this file in a library of its own, and link this library from each target that uses it:

```cmake
add_library(demo_common ../slice/Demo/Common.ice)
slice2cpp_generate(demo_common
  INCLUDE_DIRS ${CMAKE_CURRENT_SOURCE_DIR}/../slice
  HEADER_OUTPUT_DIR ${CMAKE_BINARY_DIR}/include
  INCLUDE_SCOPE PUBLIC)
target_link_libraries(demo_common PUBLIC Ice::Ice)

add_library(weather_api ../slice/Demo/Weather.ice)
slice2cpp_generate(weather_api
  INCLUDE_DIRS ${CMAKE_CURRENT_SOURCE_DIR}/../slice
  HEADER_OUTPUT_DIR ${CMAKE_BINARY_DIR}/include
  INCLUDE_SCOPE PUBLIC)
target_link_libraries(weather_api PUBLIC demo_common)
```

`Weather.ice` includes `<Demo/Common.ice>`, so the generated `Weather.h` includes `<Demo/Common.h>`, which `demo_common`
generates in `${CMAKE_BINARY_DIR}/include/Demo` and publishes to `weather_api`. A target that links `weather_api` can
include both `Demo/Weather.h` and `Demo/Common.h`.

## Installing the Generated Headers

Install the generated headers with the CMake `install` command. Add `GENERATED_HEADERS` to the target's existing
`slice2cpp_generate` call to collect the absolute paths of the generated headers. When all headers belong in one
installation directory, install them with `install(FILES)`:

```cmake
slice2cpp_generate(weather_api INCLUDE_DIR Demo INCLUDE_SCOPE PUBLIC GENERATED_HEADERS weather_api_headers)
install(FILES ${weather_api_headers} DESTINATION include/Demo)
```

`install(FILES)` puts every file directly in the destination. When the generated headers are in subdirectories, their
`#include` directives name these subdirectories, so install the root directory instead. In the example of the previous
section, both targets write their headers under `${CMAKE_BINARY_DIR}/include`:

```cmake
install(DIRECTORY ${CMAKE_BINARY_DIR}/include/ DESTINATION include)
```

The include directories that `INCLUDE_SCOPE PUBLIC` adds apply only in the build tree, so a target that you install and
export declares the installed include directory itself:

```cmake
target_include_directories(weather_api PUBLIC $<INSTALL_INTERFACE:include>)
```

## Result Variables

`find_package` sets the following variables:

| Variable                   | Description                                            |
| -------------------------- | ------------------------------------------------------ |
| `Ice_VERSION`              | The Ice version, such as `3.8.3`.                      |
| `Ice_SO_VERSION`           | The version of the Ice shared libraries, such as `38`. |
| `Ice_PREFIX`               | The installation prefix.                               |
| `Ice_INCLUDE_DIR`          | The directory of the Ice header files.                 |
| `Ice_SLICE_DIR`            | The directory of the Ice Slice files.                  |
| `Ice_SLICE2CPP_EXECUTABLE` | The path of the `slice2cpp` compiler.                  |

## See Also

- [Using the Slice Compiler](..)
