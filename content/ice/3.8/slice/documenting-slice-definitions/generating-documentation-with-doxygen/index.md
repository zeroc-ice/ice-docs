---
title: Generating Documentation with Doxygen
sidebarLabel: Doxygen
---

Using [Doxygen](https://www.doxygen.nl), you can generate an API reference for your Slice definitions, including their
doc comments. The [Slice API reference](https://code.zeroc.com/ice/3.8/api/slice/index.html) is Doxygen's output for
Ice's own Slice files.

Create a `Doxyfile` with `doxygen -g`, and set the following in it:

- `OPTIMIZE_OUTPUT_SLICE = YES`, so that Doxygen tailors its output to Slice.
- `INPUT`, to your Slice files or the directories that hold them, and `RECURSIVE = YES` when these directories have
  subdirectories of Slice files.

Set `EXTRACT_ALL = YES` when some of your modules have no doc comment: Doxygen otherwise leaves these modules out, with
their enums, sequences, dictionaries, and constants.

Then run `doxygen` in the directory that holds the `Doxyfile`.

To link your reference to ZeroC's for the Ice types your Slice files use, download the
[tag file](https://code.zeroc.com/ice/3.8/api/slice.tag) and add it to `TAGFILES`, followed by the URL of the Slice API
reference it describes:

```text
TAGFILES = slice.tag=https://code.zeroc.com/ice/3.8/api/slice
```
