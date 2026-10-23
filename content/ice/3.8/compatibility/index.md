---
title: Backward Compatibility of Ice Versions
sidebarLabel: Compatibility
---

This page describes the guarantees and non-guarantees provided by Ice’s versioning scheme.

## Major, Minor and Patch

An Ice release version has 3 components: _major_._minor_._patch_. For example, Ice 3.8.5.

A major release introduces a new major version, a minor release introduces a new minor version, and a patch release only
introduces a new patch version.

## Source-Code Compatibility

Ice keeps source code compatible across the patch releases of a minor version: code that builds with Ice 3.8.0 builds
with Ice 3.8.5. Ice does not guarantee source-code compatibility between minor releases, such as 3.7 and 3.8.

The [Upgrade Guide](../upgrade-guide) describes the significant API changes in this release that may impact source-code
compatibility.

## Binary Compatibility

Ice keeps binary compatibility across the patch releases of a minor version: an application built with Ice 3.8.0 runs
with Ice 3.8.5. Ice does not guarantee binary compatibility between minor releases.

When upgrading to a new minor (or major) release, you always need to recompile your Slice files. You also need to
upgrade your source code to use the latest Ice APIs.

## On-the-Wire Compatibility

Ice maintains on-the-wire compatibility across releases: a client and a server using different Ice releases can
communicate with each other.

## Interface Compatibility

Ice and its services provide Slice interfaces that applications use, such as `Ice::Locator`, `IceStorm::Topic` or
`IceGrid::Query`. Ice keeps these interfaces compatible across the patch releases of a minor version, but does not
guarantee their compatibility between minor releases.

Changes to service interfaces can also make an administrative tool incompatible with a service from another minor
release.

The [Upgrade Guide](../upgrade-guide) describes interface changes made by Ice services.

## Database Compatibility

The IceGrid and IceStorm services store data persistently in LMDB databases.

Ice keeps the database schema compatible across the patch releases of a minor version, but does not guarantee its
compatibility between minor releases.

For example, you can start an IceGrid registry 3.8.5 using a database created by IceGrid registry 3.8.0. But there is no
blanket guarantee that you can start IceGrid registry 3.9 using a database created by IceGrid registry 3.8.5.

The [Upgrade Guide](../upgrade-guide) describes database schema changes made by IceGrid and IceStorm.
