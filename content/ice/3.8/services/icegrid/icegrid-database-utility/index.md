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
 --server-version VER   Set Ice version for IceGrid servers (optional).
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
[IceGrid.Registry.LMDB.MapSize](../../../property-reference/icegrid-properties#icegrid.registry.lmdb.mapsize) for
additional information.

### server-version Option

The `--server-version` option sets the `ice-version` attribute of every server and IceBox server in the imported or
exported data to the version you specify. Use it after upgrading your servers to replace the Ice versions recorded in
your database with the version the servers now use.

## Compatibility

`icegriddb` imports the files it exports itself and the files exported by this utility in IceGrid 3.6 and later.
