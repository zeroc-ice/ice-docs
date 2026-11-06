---
title: Installing the Ice Services
sidebarLabel: Ice Services
description: Install IceGrid, IceStorm, and the other Ice services and their administration tools.
type: how-to
---

The Ice services, such as IceGrid and IceStorm, and their administration tools are C++ programs. You install them on the
computers that run them, whatever language your applications use.

## Linux

After you [add the ZeroC repository](../../installation#linux-package-repositories) for your distribution, install the
packages of the services you need:

| Service                                                                       | APT package       | DNF package  |
| ----------------------------------------------------------------------------- | ----------------- | ------------ |
| DataStorm node (`dsnode`)                                                     | `zeroc-dsnode`    | `dsnode`     |
| Glacier2                                                                      | `zeroc-glacier2`  | `glacier2`   |
| IceBox                                                                        | `zeroc-icebox`    | `icebox`     |
| IceBridge                                                                     | `zeroc-icebridge` | `icebridge`  |
| IceGrid                                                                       | `zeroc-icegrid`   | `icegrid`    |
| IceGrid GUI                                                                   |                   | `icegridgui` |
| IceStorm                                                                      | `zeroc-icestorm`  | `icestorm`   |
| `iceboxadmin`, `icegridadmin`, `icegriddb`, `icestormadmin`, and `icestormdb` | `zeroc-ice-utils` | `ice-utils`  |

For example, on Ubuntu or Debian:

```shell
sudo apt-get install zeroc-icegrid
```

The IceGrid and IceStorm packages also install IceBox and the administration tools. The IceGrid GUI package requires a
Java runtime.

## macOS

The `ice` formula of the ZeroC Homebrew tap installs every Ice service and administration tool, along with Ice for C++:

```shell
brew install zeroc-ice/tap/ice
```

To install the IceGrid GUI app, install the `icegridgui` cask:

```shell
brew install --cask zeroc-ice/tap/icegridgui
```

The IceGrid GUI app is also available as a disk image:
[IceGridGUI-3.8.3.dmg](https://download.zeroc.com/ice/3.8/IceGridGUI-3.8.3.dmg).

## Windows

The `ZeroC.IceServices` WinGet package installs every Ice service, the administration tools, and IceGrid GUI:

```shell
winget install ZeroC.IceServices
```

The same programs are available as an installer:
[Ice-Services-3.8.3.exe](https://download.zeroc.com/ice/3.8/Ice-Services-3.8.3.exe). Both install the x64 programs in
`C:\Program Files\ZeroC\Ice-Services-3.8.3`, and neither includes the Ice SDKs or the Slice compilers. IceGrid GUI
requires a Java runtime.

## See Also

- [Installing Ice for Your Language](../ice-for-your-language)
- [Ice 3.8.3 Supported Platforms](../../../releases/ice-3-8-3/supported-platforms)
