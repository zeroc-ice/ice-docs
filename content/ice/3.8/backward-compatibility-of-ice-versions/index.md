---
id: backward-compatibility-of-ice-versions
title: Backward Compatibility of Ice Versions
---

This page describes the guarantees and non-guarantees provided by Ice’s versioning scheme.

## Major, Minor and Patch

An Ice release version has 3 components: _major_._minor_._patch_. For example, Ice 3.8.5.

A major release introduces a new major version, a minor release introduces a new minor version, and a patch release only
introduces a new patch version.

## Source-code compatibility

Ice maintains source-code compatibility between a patch release (e.g., 3.8.5) and the most recent minor release (e.g.,
3.8.0), but does not guarantee source-code compatibility between minor releases (e.g., between 3.7 and 3.8).

The [Upgrade Guide](../upgrade-guide) describes the significant API changes in this release that may impact source-code
compatibility.

## Binary compatibility

As for source-code compatibility, Ice maintains backward binary compatibility between a patch release and the most
recent minor release, but does not guarantee binary compatibility between minor releases.

When upgrading to a new minor (or major) release, you always need to recompile your Slice files. You also need to
upgrade your source code to use the latest Ice APIs.

## On-the-wire compatibility

Ice always maintains "on the wire" compatibility with prior releases. A client using Ice version _x_ can communicate
with a server using Ice version _y_ and vice versa.

## Interface compatibility

Although Ice always maintains compatibility at the protocol level, changing Slice definitions can also lead to
incompatibilities. As a result, Ice maintains interface compatibility between a patch release and the most recent minor
release, but does not guarantee interface compatibility between minor releases.

This issue is particularly relevant if your application uses Ice services such as IceGrid or IceStorm, as a change to an
interface in one of these services may adversely affect your application.

Interface changes in an Ice service can also impact compatibility with its administrative tools, which means it may not
be possible to administer a service using a tool from a previous minor release (or vice-versa).

The [Upgrade Guide](../upgrade-guide) describes interface changes made by Ice services.

## Database compatibility

The IceGrid and IceStorm services store data persistently in LMDB databases.

Ice maintains database schema compatibility between a patch release and the most recent minor release, but does not
guarantee database schema compatibility between minor releases.

For example, you can start an IceGrid registry 3.8.5 using a database created by IceGrid registry 3.8.0. But there is no
blanket guarantee that you can start IceGrid registry 3.9 using a database created by IceGrid registry 3.8.5.

The [Upgrade Guide](../upgrade-guide) describes database schema changes made by IceGrid and IceStorm.
