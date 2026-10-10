---
title: Backward Compatibility of Ice Versions
---

This page describes the guarantees and non-guarantees provided by Ice’s versioning scheme.

## Major, Minor and Patch

An Ice release version has 3 components: _major_._minor_._patch_. For example, Ice 3.8.5.

A major release introduces a new major version, a minor release introduces a new minor version, and a patch release only
introduces a new patch version.

## Source-Code Compatibility

Ice maintains source-code compatibility between a patch release (e.g., 3.8.5) and the most recent minor release (e.g.,
3.8.0), but does not guarantee source-code compatibility between minor releases (e.g., between 3.7 and 3.8).

The [Upgrade Guide](../upgrade-guide) describes the significant API changes in this release that may impact source-code
compatibility.

## Binary Compatibility

As for source-code compatibility, Ice maintains backward binary compatibility between a patch release and the most
recent minor release, but does not guarantee binary compatibility between minor releases.

When upgrading to a new minor (or major) release, you always need to recompile your Slice files. You also need to
upgrade your source code to use the latest Ice APIs.

## On-the-Wire Compatibility

Applications using different Ice releases can communicate with each other only when:

- both applications support the encoding version that the proxy selects. A proxy that Ice 3.8 creates from a string uses
  encoding version 1.1 unless
  [Ice.Default.EncodingVersion](../property-reference/ice-default-properties#ice.default.encodingversion) or the proxy's
  `-e` option selects another version, while Ice 3.4 and earlier support only encoding version 1.0.
- the data they exchange uses only Slice features that both releases support. For example, Ice 3.8 cannot skip an
  [optional class](../upgrade-guide#optional-classes), so an Ice 3.8 application can reject a request or response from
  an Ice 3.7 application that carries an optional parameter or field of a class type, even when its own Slice
  definitions no longer include this parameter or field.
- their connection settings are compatible. The idle check of an Ice 3.8 application can abort a healthy connection to
  an Ice 3.7 or earlier application that does not send heartbeats; see
  [The Idle Check](../runtime/connection-management/connection-closure#the-idle-check) for the configuration that
  prevents these aborts.

## Interface Compatibility

Changing Slice definitions can also lead to incompatibilities between applications. Ice maintains interface
compatibility between a patch release and the most recent minor release, but does not guarantee interface compatibility
between minor releases.

This issue is particularly relevant if your application uses Ice services such as IceGrid or IceStorm, as a change to an
interface in one of these services may adversely affect your application.

Interface changes in an Ice service can also impact compatibility with its administrative tools, which means it may not
be possible to administer a service using a tool from a previous minor release (or vice-versa).

The [Upgrade Guide](../upgrade-guide) describes interface changes made by Ice services.

## Database Compatibility

The IceGrid and IceStorm services store data persistently in LMDB databases.

Ice maintains database schema compatibility between a patch release and the most recent minor release, but does not
guarantee database schema compatibility between minor releases.

For example, you can start an IceGrid registry 3.8.5 using a database created by IceGrid registry 3.8.0. But there is no
blanket guarantee that you can start IceGrid registry 3.9 using a database created by IceGrid registry 3.8.5.

The [Upgrade Guide](../upgrade-guide) describes database schema changes made by IceGrid and IceStorm.
