---
title: Generating Documentation with Doxygen
sidebarLabel: Doxygen
---

Using [Doxygen](https://www.doxygen.nl), version 1.8.15 or later, you can generate an API reference for your Slice
definitions, including their doc comments. The
[Slice API reference](https://code.zeroc.com/ice/3.8/api/slice/index.html) is Doxygen's output for Ice's own Slice
files.

Create a `Doxyfile` with `doxygen -g`, and set these settings in it:

- `OPTIMIZE_OUTPUT_SLICE = YES`, so that Doxygen tailors its output to Slice.
- `INPUT`, to your Slice files or the directories that hold them, and `RECURSIVE = YES` when these directories have
  subdirectories of Slice files.
- `INCLUDE_PATH`, to the directories your Slice files include from, when these directories are not in `INPUT`.

Set `EXTRACT_ALL = YES` to also list the definitions that have no doc comment.

Then run `doxygen` in the directory that holds the `Doxyfile`.

To link your reference to ZeroC's for the Ice types your Slice files use, download the
[tag file](https://code.zeroc.com/ice/3.8/api/slice.tag) and add it to `TAGFILES`, followed by the URL of the Slice API
reference it describes:

```text
TAGFILES = slice.tag=https://code.zeroc.com/ice/3.8/api/slice
```
