---
title: Command Line Options
---

The Ice services share a common set of command line options.

## Windows Services

- `--service NAME` Run as a Windows service named `NAME`, which must already be installed.

## Linux Daemons

- `--daemon` Run as a background daemon. The current working directory gets set to the root directory and closes all
  file descriptors.

- `--pidfile FILE` This option writes the process ID of the service into the specified `FILE`.

- `--noclose` Prevents the service from closing unnecessary file descriptors. This can be useful during debugging and
  diagnosis because it provides access to the output from the daemon's standard output and standard error.

- `--nochdir` Prevents the service from changing the current working directory.
