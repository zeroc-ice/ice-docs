---
title: Installing Ice
sidebarLabel: Installation
description: Install Ice for your programming language, the Ice services, and the Ice source code.
type: how-to
---

Install Ice for your programming language to get the Ice libraries and the Slice compiler for that language. You need
the [Ice services](#ice-services), such as IceGrid and IceStorm, only when your application uses them.

{% language-section name="language" /%}

## Linux Package Repositories

ZeroC publishes the Ice packages for Linux in an APT repository and a DNF repository. You add the repository of your
distribution by installing its repository package:

| Distribution                | Identifier    | Architectures   |
| --------------------------- | ------------- | --------------- |
| Ubuntu 26.04                | `ubuntu26.04` | amd64, arm64    |
| Ubuntu 24.04                | `ubuntu24.04` | amd64, arm64    |
| Debian 13                   | `debian13`    | amd64, arm64    |
| Debian 12                   | `debian12`    | amd64, arm64    |
| Red Hat Enterprise Linux 10 | `el10`        | x86_64, aarch64 |
| Red Hat Enterprise Linux 9  | `el9`         | x86_64, aarch64 |
| Amazon Linux 2023           | `amzn2023`    | x86_64, aarch64 |

On Ubuntu and Debian, replace `ubuntu24.04` with the identifier of your distribution:

```shell
wget https://download.zeroc.com/ice/3.8/ubuntu24.04/ice-repo-3.8_1.0.0_all.deb -O ice-repo.deb
sudo dpkg -i ice-repo.deb
rm ice-repo.deb
sudo apt-get update
```

On Red Hat Enterprise Linux and Amazon Linux, replace both occurrences of `el9` with the identifier of your
distribution:

```shell
sudo dnf install https://download.zeroc.com/ice/3.8/el9/ice-repo-3.8-1.0.0-1.el9.noarch.rpm
```

## Ice Services

The Ice services, such as IceGrid and IceStorm, and their administration tools are C++ programs. You install them on the
computers that run them, whatever language your applications use.

### Linux {% id="services-linux" %}

After you [add the ZeroC repository](#linux-package-repositories) for your distribution, install the packages of the
services you need:

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

### macOS {% id="services-macos" %}

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

### Windows {% id="services-windows" %}

The `ZeroC.IceServices` WinGet package installs every Ice service, the administration tools, and IceGrid GUI:

```shell
winget install ZeroC.IceServices
```

The same programs are available as an installer:
[Ice-Services-3.8.3.exe](https://download.zeroc.com/ice/3.8/Ice-Services-3.8.3.exe). Both install the x64 programs in
`C:\Program Files\ZeroC\Ice-Services-3.8.3`, and neither includes the Ice SDKs or the Slice compilers. IceGrid GUI
requires a Java runtime.

## Source Code

The Ice source code is on [GitHub](https://github.com/zeroc-ice/ice). To build an Ice release from source, clone its tag
and follow the `BUILDING.md` instructions of the language mapping you build:

```shell
git clone -b v3.8.3 https://github.com/zeroc-ice/ice
```

To build the latest 3.8 changes, including those not released yet, clone the `3.8` branch instead. The source archive of
each release is attached to its [GitHub release](https://github.com/zeroc-ice/ice/releases/tag/v3.8.3).

## See Also

- [Ice 3.8.3 Supported Platforms](../../releases/ice-3-8-3/supported-platforms)
- [Greeter Example](../greeter-example)
- [Using the Slice Compiler](../../slice/using-the-slice-compiler)
