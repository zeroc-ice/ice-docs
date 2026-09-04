---
id: startup-scripts-for-icegrid-and-glacier2-on-linux
title: Startup Scripts for IceGrid and Glacier2 on Linux
---

All Ice distributions for Linux include the following service configuration files:

- `/etc/icegridregistry.conf`
- `/etc/icegridnode.conf`
- `/etc/glacier2router.conf`

Distributions which use `sysvinit` or `upstart` contain the following sample scripts:

- `/etc/init.d/icegridregistry`
- `/etc/init.d/icegridnode`
- `/etc/init.d/glacier2router`

Distributions which use `systemd` contain the following services:

- `icegridregistry.service`
- `icegridnode.service`
- `glacier2router.service`

The installation on Linux also creates a user account and group for running these services (account `ice` and group
`ice`), and data directories for `icegridregistry` and `icegridnode` (`/var/lib/ice/icegrid/registry` and
`/var/lib/ice/icegrid/node1`).

By default, all these services are off at all runlevels. You need to manually switch on one or more runlevels, as shown
below:

```shell
# On systems using sysvinit, configure the icegridregistry to start at the
# default run levels:
sudo chkconfig icegridregistry on
 
# On systems using systemd, start icegridregistry with the multi-user target
sudo systemctl enable icegridregistry.service
```

Before doing so, please review the script itself and its associated configuration file.
