{% language-section name="language" %}

## Ice for C++

Ice for C++ provides the Ice libraries and headers, the Slice-to-C++ compiler (`slice2cpp`), and a CMake package that
compiles Slice files as part of your build. See [CMake](../../build-tools/cmake).

### Linux

After you [add the ZeroC repository](#linux-package-repositories) for your distribution, install the development
package. On Ubuntu and Debian:

```shell
sudo apt-get install libzeroc-ice-dev
```

On Red Hat Enterprise Linux and Amazon Linux:

```shell
sudo dnf install libice-c++-devel
```

The development package installs the headers, `slice2cpp`, and the CMake package, and depends on the package that holds
the shared libraries: `libzeroc-ice3.8` or `libice3.8-c++`. A computer that only runs your application needs this
runtime package alone.

### macOS

The `ice` formula of the ZeroC Homebrew tap installs Ice for C++, along with the Ice services:

```shell
brew install zeroc-ice/tap/ice
```

### Windows

Ice for C++ is the [ZeroC.Ice.Cpp](https://www.nuget.org/packages/ZeroC.Ice.Cpp) NuGet package. The package holds the
Ice libraries for x64 and Win32, in Debug and Release configurations, `slice2cpp`, the MSBuild integration that compiles
the Slice files of your project, and the CMake package.

For a Visual Studio project, add the package with the NuGet package manager of Visual Studio.

For a CMake project, download the package with the NuGet command-line tool, then point CMake to it as described in
[CMake](../../build-tools/cmake#windows):

```shell
nuget install ZeroC.Ice.Cpp -Version 3.8.3 -OutputDirectory packages
```

{% /language-section %}
