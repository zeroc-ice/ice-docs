---
title: IceStorm Database Utility
---

The `icestormdb` utility is a command-line tool for importing and exporting IceStorm databases.

## Usage

The IceStorm Database utility supports the following command-line options:

```text
Usage: icestormdb <options>
Options:
-h, --help             Show this message.
-v, --version          Display version.
--import FILE          Import database from FILE.
--export FILE          Export database to FILE.
--dbhome DIR           Source or target database environment.
--dbpath DIR           Source or target database environment.
--mapsize VALUE        Set LMDB map size in MB (optional, import only).
-d, --debug            Print debug messages.
```

`--dbhome` and `--dbpath` are synonyms; specify exactly one of them.

## Exporting an IceStorm Database

To export an IceStorm database, use the `--export` option to specify the output file and the `--dbpath` option to
specify the path name of the database. For example, use the following command to export a database found in the `db`
directory to a file named `db.ixp`:

```shell
icestormdb --export db.ixp --dbpath db
```

{% callout type="tip" %}

You can back up a running IceStorm service with `--export`: `icestormdb` reads the database in a single read-only
transaction, which gives it a consistent snapshot while IceStorm continues to update the database.

If you want to back-up the IceStorm database while IceStorm is running, we recommend using the
[mdb_copy](https://manpages.org/mdb_copy) tool.

{% /callout %}

## Importing an IceStorm Database

To import an IceStorm database, use the `--import` option to specify the input file and the `--dbpath` option to specify
the path name of the database. For example, use the following command to import a database into the `dbNew` directory
from a file named `db.ixp`:

```shell
mkdir dbNew
icestormdb --import db.ixp --dbpath dbNew
```

The target directory must already exist and be empty.

### mapsize Option

The `--mapsize` option allows you to set the map size of the new LMDB database. See
[IceStorm.LMDB.MapSize](../../../property-reference/icestorm-properties) for additional information.

## Compatibility

Besides importing files that it creates itself, `icestormdb` can also import the files exported by older versions of
this utility.
