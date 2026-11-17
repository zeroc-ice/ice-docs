---
title: Installing Ice
sidebarLabel: Installation
description: What to install for Ice, the ZeroC Linux package repositories, and the Ice source code.
pages:
  - ice-for-your-language
  - ice-services
---

You install Ice in two parts:

- [Ice for your language](./ice-for-your-language) provides the Ice libraries and the Slice compiler of your programming
  language. You install it on the computers where you build Ice applications.
- The [Ice services](./ice-services), such as IceGrid and IceStorm, and their administration tools are C++ programs. You
  install them on the computers that run them, only when your application uses them.

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
