---
title: Generating Documentation with Doxygen
---

[Doxygen](https://www.doxygen.nl) generates a reference for your Slice definitions from their doc comments, in HTML and
other formats. The [Slice API reference](https://code.zeroc.com/ice/3.8/api/slice/index.html) is an example: it is the
output Doxygen generates for Ice's own Slice files.

Doxygen supports Slice since version 1.8.15: it recognizes `.ice` files, and it has an output mode tailored for Slice.

# Configuring Doxygen

You can generate a default configuration file as follows:

```
doxygen -g config
```

Next, edit the generated file (in the example above we called the file `config`) and review its settings. At a minimum,
we recommend that you review the following settings, shown in the order they appear in the file:

- `PROJECT_NAME` Doxygen uses the project name as the page title.
- `JAVADOC_AUTOBRIEF` This setting is off by default. Enable it so that Doxygen uses the first sentence of a `/** */`
  doc comment as the summary of the definition it documents.
- `OPTIMIZE_OUTPUT_SLICE` Enable this setting when your project consists of Slice files only: Doxygen then presents
  modules as modules instead of namespaces, and separates types into more groups. The
  [Slice API reference](https://code.zeroc.com/ice/3.8/api/slice/index.html) demonstrates these changes.
- `EXTRACT_ALL` Enable this setting to make Doxygen include every construct, documented or not.
- `SORT_BRIEF_DOCS` This setting is off by default, but we recommend enabling it: Doxygen then sorts the summary
  sections of a module alphabetically rather than in the order of declaration.
- `INPUT` List the files or subdirectories for Doxygen to process.
- `RECURSIVE` Enable this setting to force Doxygen to recurse into subdirectories when searching for input files.
- `EXCLUDE_SYMBOLS` Use this setting to exclude certain types or modules that you don't want to appear in the output.
- `USE_MDFILE_AS_MAINPAGE` Name a Markdown file whose content becomes the main page of the output, and list that file in
  `INPUT` too.
- `COLS_IN_ALPHA_INDEX` The default value of 5 for this setting can make for an overly wide presentation. We recommend
  using 3 instead.
- `GENERATE_LATEX` Doxygen generates LaTeX output by default. If you don't need this format, set this setting to `NO`.
- `INCLUDE_PATH` Specify the path of every include directory your Slice files use.
- `TAGFILES` See the next section.
- `HAVE_DOT` Enable this setting if you want Doxygen to use the `dot` tool to generate inheritance and collaboration
  diagrams.

When you're ready to generate documentation, run Doxygen like this:

```
doxygen config
```

By default, Doxygen writes the HTML output into an `html` subdirectory.

# Linking to ZeroC Documentation

Doxygen can [embed links to the documentation of external types](https://www.doxygen.nl/manual/external.html) that your
source files use. For example, if your Slice file refers to a type from the Ice API reference and you'd like your
documentation to link to ZeroC's documentation for that type, download the _tag file_ for your Ice version and configure
the `TAGFILES` setting in your Doxygen configuration file:

```
TAGFILES = slice.tag=https://code.zeroc.com/ice/3.8/api
```

The tag file is available here:

- [https://code.zeroc.com/ice/3.8/api/slice.tag](https://code.zeroc.com/ice/3.8/api/slice.tag)

##### See Also

- [Doxygen](https://www.doxygen.nl)
- [Slice API reference](https://code.zeroc.com/ice/3.8/api/slice/index.html)
