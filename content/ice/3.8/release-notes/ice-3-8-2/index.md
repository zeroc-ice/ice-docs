---
title: Ice 3.8.2
date: "2026-06-04"
---

This [patch release](../compatibility) includes bug fixes and small improvements to Ice 3.8.

We list below the main highlights. Please refer to the
[changelog](https://github.com/zeroc-ice/ice/blob/3.8/CHANGELOG-3.8.md) for a detailed description of all the changes
included in this release.

## C# Changes

### New compiler option for IceRPC

We added a new `--icerpc` option to the Slice compiler for C# (`slice2cs`). When this option is specified, `slice2cs`
generates code for IceRPC C#. The generated code is compatible with [IceRPC](https://docs.icerpc.dev) C# 0.6.

### New metadata directives

We added two new metadata directives:

- `["cs:internal"]`, for top-level Slice definitions such as struct and interfaces. This metadata changes the access
  modifier for the generated C# constructs to `internal`(the default remains `public`).
- `["cs:readonly"]`, for Slice structs. See [Slice Metadata Directives](../slice-metadata-directives) for details.

## Code hardening

We performed a comprehensive audit of the Ice source code using AI tools and applied fixes for various issues uncovered
by this audit.
