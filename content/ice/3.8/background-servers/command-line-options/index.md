---
title: Command Line Options
---

The Ice services built on the C++ class `Ice::Service` (`glacier2router`, `icebox`, `icebridge`, `icegridnode` and
`icegridregistry`) share a common set of command line options. A C++ server that derives from `Ice::Service` accepts the
same options.

## Windows Services

- `--service NAME` Run as a Windows service named `NAME`, which must already be installed.

## Linux Daemons

These options are available on Linux and macOS:

```shell
--daemon [--nochdir] [--noclose] [--pidfile FILE]
```

A service started without `--daemon` runs in the foreground. A service started with `--noclose` or `--pidfile FILE` and
without `--daemon` prints an error message and exits.

- `--daemon` Run as a background daemon. The daemon sets its current working directory to the root directory unless
  `--nochdir` is set. After it initializes the communicator, and unless `--noclose` is set, the daemon closes the file
  descriptors that were open before it initialized the communicator, and redirects standard input, standard output and
  standard error to `/dev/null`. A file descriptor that communicator initialization opens, such as the log file named by
  [Ice.LogFile](../ice-properties#ice.logfile), remains open.

  The daemon keeps standard output open when [Ice.StdOut](../ice-properties#ice.stdout) is set, and standard error when
  [Ice.StdErr](../ice-properties#ice.stderr) is set. When only `Ice.StdOut` is set, the daemon also sends standard error
  to the file named by `Ice.StdOut`.

- `--pidfile FILE` Write the process ID of the daemon into the specified `FILE`. The daemon writes the file before it
  starts the service, and resolves a relative `FILE` against its current working directory, which is the root directory
  unless `--nochdir` is set. When the daemon cannot write the file, it logs a warning and continues. The file remains in
  place after the daemon exits.

- `--noclose` Skip the closing of file descriptors and the redirection of the standard streams to `/dev/null`. This can
  be useful during debugging and diagnosis because it provides access to the output from the daemon's standard output
  and standard error.

- `--nochdir` Keep the current working directory the daemon was started in. This option has an effect only with
  `--daemon`.
