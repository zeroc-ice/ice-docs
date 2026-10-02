---
title: systemd Services for IceGrid and Glacier2 on Linux
---

The ZeroC DEB and RPM packages for IceGrid and Glacier2 install a `systemd` unit and a sample configuration file for
each service:

| Service          | DEB package      | RPM package | Unit                      | Configuration file          |
| ---------------- | ---------------- | ----------- | ------------------------- | --------------------------- |
| IceGrid registry | `zeroc-icegrid`  | `icegrid`   | `icegridregistry.service` | `/etc/icegridregistry.conf` |
| IceGrid node     | `zeroc-icegrid`  | `icegrid`   | `icegridnode.service`     | `/etc/icegridnode.conf`     |
| Glacier2 router  | `zeroc-glacier2` | `glacier2`  | `glacier2router.service`  | `/etc/glacier2router.conf`  |

Each unit runs its service as the user `ice` and passes the service's configuration file in `--Ice.Config`. The sample
configuration files set [Ice.UseSystemdJournal](../../property-reference/ice-properties#ice.usesystemdjournal), so the
services log to the `systemd` journal.

Installing either package creates the user account `ice` and the group `ice`. The IceGrid package also creates the data
directories that the sample configuration files name: `/var/lib/ice/icegrid/registry` for `icegridregistry` and
`/var/lib/ice/icegrid/node1` for `icegridnode`.

Installing a package does not start its services: you enable and start them yourself.

The IceGrid sample configuration files describe a deployment with the IceGrid registry and one IceGrid node, `node1`, on
the same host. Review the configuration file of a service before you start it. Then start the service and enable it at
each boot, as shown below for the IceGrid registry:

```shell
# Start icegridregistry now and with the multi-user target at each boot
sudo systemctl enable --now icegridregistry.service

# Check that the service is running
systemctl status icegridregistry.service
```
