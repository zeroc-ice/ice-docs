---
title: Generating Slice Documentation
---

# Documenting Slice Definitions

Adding comments to your Slice definitions is useful because it helps readers understand the semantics of your
application's interfaces and data types. To make your comments more accessible, you can process your Slice files with
[Doxygen](../generating-slice-documentation) to produce output in HTML and other formats. Furthermore, the Slice
compiler for each supported language mapping will transfer your Slice comments to the code that it generates for your
Slice types, which means you can also process your generated code with a documentation generator and get meaningful
results. You'll need to consider whether to generate documentation from Slice files, from generated code, or both.

The [Slice API reference](https://code.zeroc.com/ice/3.8/api/slice/index.html) offers an example of the HTML output that
Doxygen generates for Ice's own Slice files.

# Comment Syntax

Slice uses a [Javadoc-style syntax](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html)
(described below) for comments. Doxygen and Slice compilers such as `slice2cpp` and `slice2java` fully support this
syntax. The Slice compilers do not recognize any other Doxygen-compatible comment syntax.

As an example of the Slice comment syntax, here is the definition of `Ice::Current`:

```slice
/**
 *
 * Information about the current method invocation for servers. Each
 * operation on the server has a <tt>Current</tt> as its implicit final
 * parameter. <tt>Current</tt> is mostly used for Ice services. Most
 * applications ignore this parameter.
 *
 **/
local struct Current
{
    /**
     * The object adapter.
     **/
    ObjectAdapter adapter;

    /**
     * Information about the connection over which the current
     * method invocation was received. If the invocation is direct
     * due to collocation optimization, this value is set to null.
     **/
    Connection con;

    /**
     * The Ice object identity.
     **/
    Identity id;

    /**
     * The facet.
     ***/
    string facet;

    /**
     * The operation name.
     **/
    string operation;

    /**
     * The mode of the operation.
     **/
    OperationMode mode;

    /**
     * The request context, as received from the client.
     **/
    Context ctx;

    /**
     * The request id unless oneway (0) or collocated (-1).
     **/
    int requestId;

    /**
     * The encoding version used to encode the input and output parameters.
     **/
    EncodingVersion encoding;
}
```

A documentation comment starts with `/**` and ends with `**/`. Such a comment can precede any Slice construct, such as a
module, interface, structure, operation, and so on. Within a documentation comment, you can either start each line with
a `*`, or you can leave the beginning of the line blank:

```slice
/**
 *
 * This is a documentation comment for which every line
 * starts with a '*' character.
 **/

/**

 This is a documentation comment without a leading '*'
 for each line. Either style of comment is fine.

 **/
```

The first sentence of the documentation comment for a Slice construct should be a summary sentence.

## Hyperlinks

Any Slice identifier enclosed in `{@link ...}` is presented as a hyperlink in code font. For example:

```slice
/**
 * An empty {@link name} denotes a null object.
 **/
```

This generates a hyperlink for the `name` markup that points at the definition of the corresponding Slice symbol. (The
symbol can denote any Slice construct, such as a type, interface, parameter, or structure member.)

{% callout type="tip" %}

Doxygen by default will automatically create links from symbols that appear in comments, which means explicit `@link`
tags are rarely necessary in practice.

{% /callout %}

## Explicit Cross References

The directive `@see` creates an explicit cross reference to another entity:

```slice
/**
 * The object adapter, which is responsible for receiving requests
 * from endpoints, and for mapping between servants, identities,
 * and proxies.
 *
 * @see Communicator
 * @see ServantLocator
 **/
```

## Markup for Operations

There are three directives specifically to document Slice operations: `@param`, `@return`, and `@throws`. For example:

```slice
/**
 * Look for an item with the specified
 * primary and secondary key.
 *
 * @param p The primary search key.
 *
 * @param s The secondary search key.
 *
 * @return The item that matches the specified keys.
 *
 * @throws NotFound Raised if no item matches the specified keys.
 **/

Item findItem(Key p, Key s) throws NotFound;
```

For clarity, the comment order should match the order of declaration for the parameters.

# doxygenUsing Doxygen for Slice Documentation

This section describes how to use Doxygen to generate a Slice API reference documentation from your Slice files.

## Selecting a Doxygen Version

Doxygen recognizes Slice since version 1.8.15.

## Configuring Doxygen

You can generate a default configuration file as follows:

```
doxygen -g config
```

Next you'll want to edit the generated file (in the example above we called the file `config`) and review its settings.

At a minimum, we recommend that you review the following settings, shown in the order they appear in the file:

- `PROJECT_NAME` The project name is used as the page title.
- `JAVADOC_AUTOBRIEF` This setting is disabled by default. Enable it to use the first sentence of a construct's
  documentation as its summary.
- `OPTIMIZE_OUTPUT_SLICE` This setting is only available with ZeroC's fork of Doxygen. Enabling it changes the output in
  several ways: modules are called "Modules" instead of "Namespaces"; classes, interfaces, structs and exceptions have
  separate indices; sequences and dictionaries have their own sections; and constants are called "Constants" instead of
  "Variables". The [Slice API reference](https://code.zeroc.com/ice/3.8/api/slice/index.html) demonstrates these
  changes.
- `EXTRACT_ALL` Enabling this setting causes Doxygen to include all constructs even if they aren't documented.
- `SORT_BRIEF_DOCS` This setting is disabled by default but we recommend enabling it, which causes the summary sections
  of a module to be sorted alphabetically rather than in the order of declaration.
- `INPUT` List the files or subdirectories to be processed.
- `RECURSIVE` Enable this setting to force Doxygen to recurse into subdirectories when searching for input files.
- `EXCLUDE_SYMBOLS` Use this setting to exclude certain types or modules that you don't want to appear in the output.
- `USE_MDFILE_AS_MAINPAGE` This setting allows you to specify the name of a markdown file that contains content for the
  main page of the output. Note that this file must also be mentioned in `INPUT`.
- `COLS_IN_ALPHA_INDEX` The default value of 5 for this setting can make for an overly wide presentation. We recommend
  using 3 instead.
- `GENERATE_LATEX` LaTeX output is enabled by default. If you don't need to generate this format, set this to `NO`.
- `INCLUDE_PATH` Specify the path name of any include directories used by your Slice files.
- `TAGFILES` Refer to the next section below.
- `HAVE_DOT` Enable this setting if you want Doxygen to use the `dot` tool to generate inheritance and collaboration
  diagrams.

When you're ready to generate documentation, run Doxygen like this:

```
doxygen config
```

By default, the HTML output will be generated into an `html` subdirectory.

## Linking to ZeroC Documentation

Doxygen has the ability to
[embed links to the documentation of external types](https://www.doxygen.nl/manual/external.html) that are used by your
source files. For example, if your Slice file refers to a type from the Ice API reference and you'd like your
documentation to link to ZeroC's documentation for that type, you simply need to download the appropriate _tag file_ for
your Ice version and configure the `TAGFILES` setting in your Doxygen configuration file:

```
TAGFILES = slice.tag=https://code.zeroc.com/ice/3.8/api
```

The tag file is available here:

- [https://code.zeroc.com/ice/3.8/api/slice.tag](https://code.zeroc.com/ice/3.8/api/slice.tag)

##### See Also

- [Doxygen](https://www.doxygen.nl)
- [Slice API reference](https://code.zeroc.com/ice/3.8/api/slice/index.html)
- [HTML specification](https://www.w3.org/TR/html401/)
