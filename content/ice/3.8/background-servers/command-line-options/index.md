---
title: Command Line Options
---

The Ice services `glacier2router`, `icebox`, `icebridge`, `icegridnode` and `icegridregistry` share a common set of
command line options.

## Windows Services

- `--service NAME` Run as a Windows service named `NAME`, which must already be installed.

## Linux and macOS Daemons

A service managed by systemd, or by launchd on macOS, runs in the foreground, as the [systemd units](../linux-services)
included in the Linux packages do: the init system tracks the process. The options below are for an init system that
expects the service to detach. They are available on Linux and macOS:

```shell
--daemon [--nochdir] [--noclose] [--pidfile FILE]
```

A service started without `--daemon` runs in the foreground. The other three options modify `--daemon`.

- `--daemon` Run as a background daemon. The daemon sets its current working directory to the root directory, closes the
  file descriptors it inherited, and redirects standard input, standard output and standard error to `/dev/null`. It
  keeps standard output when [Ice.StdOut](../../property-reference/ice-properties#ice.stdout) is set, and standard error
  when [Ice.StdErr](../../property-reference/ice-properties#ice.stderr) is set; when only `Ice.StdOut` is set, standard
  error also goes to the file named by `Ice.StdOut`.

- `--pidfile FILE` Write the process ID of the daemon into the specified `FILE`. The daemon resolves a relative `FILE`
  against its current working directory, which is the root directory unless `--nochdir` is set.

- `--noclose` Skip the closing of file descriptors and the redirection of the standard streams to `/dev/null`. This can
  be useful during debugging and diagnosis because it provides access to the output from the daemon's standard output
  and standard error.

- `--nochdir` Keep the current working directory the daemon was started in.
