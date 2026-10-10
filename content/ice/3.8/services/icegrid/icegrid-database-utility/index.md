---
title: IceGrid Database Utility
---

The `icegriddb` utility is a command-line tool for importing and exporting an IceGrid registry database.

## Usage

The IceGrid Database utility supports the following command-line options:

```text
Usage: icegriddb <options>
Options:
 -h, --help             Show this message.
 -v, --version          Display version.
 --import FILE          Import database from FILE.
 --export FILE          Export database to FILE.
 --dbpath DIR           Source or target database environment.
 --mapsize VALUE        Set LMDB map size in MB (optional, import only).
 --server-version VER   Set Ice version for IceGrid servers (optional, import only).
 -d, --debug            Print debug messages.
```

## Exporting an IceGrid Database

To export an IceGrid registry database, use the `--export` option to specify the output file and the `--dbpath` option
to specify the path name of the registry's database directory. To discover the location of your database, review the
registry's configuration and look for the setting of `IceGrid.Registry.LMDB.Path`. For example, the IceGrid sample
programs typically use this setting:

```config
IceGrid.Registry.LMDB.Path=db/registry
```

Run the following command to export the database:

```shell
icegriddb --export registry.ixp --dbpath db/registry
```

{% callout type="tip" %}

You can export the database while the IceGrid registry is running: `icegriddb` reads it in a single read-only
transaction and does not block the registry. To copy the database files themselves, use the
[mdb_copy](https://manpages.org/mdb_copy) tool, which also works while the registry is running.

{% /callout %}

## Importing an IceGrid Database

To import an IceGrid registry database, use the `--import` option to specify the input file and the `--dbpath` option to
specify the path name of the registry's database directory. For example, use the following command to import a database
into the `dbNew/registry` directory from a file named `registry.ixp`:

```shell
mkdir -p dbNew/registry
icegriddb --import registry.ixp --dbpath dbNew/registry
```

The target directory must already exist and be empty.

### mapsize Option

The `--mapsize` option allows you to set the map size of the new LMDB database. See
[IceGrid.Registry.LMDB.MapSize](../../../property-reference/icegrid-properties) for additional information.

### server-version Option

IceGrid allows you to assign an Ice version to each server it manages. IceGrid uses this information to generate
configuration files for this server that are compatible with the specified Ice version. When a server has no associated
Ice version, IceGrid assumes this server uses the same version of Ice, for example, IceGrid 3.8.2 assumes such a server
also uses Ice 3.8.2.

By default, `icegriddb` imports each server's `ice-version` attribute unchanged. With the `--server-version` option,
`icegriddb` sets the `ice-version` attribute of every server and IceBox server to the version you specify, including the
servers that already have an `ice-version`, as shown in the example below:

```shell
icegriddb --server-version 3.7.1 --import registry.ixp --dbpath dbNew/registry
```

## Compatibility

Besides importing files that it creates itself, `icegriddb` can also import the files exported by older versions of this
utility.
