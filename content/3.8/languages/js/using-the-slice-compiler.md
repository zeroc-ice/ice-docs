---
id: using-the-slice-compiler
language: js
---

{% language-section name="lang-1" %}

- `--depend`
  Print dependency information in Makefile format to standard output by default, or to the file specified by the `--depend-file` option.
{% /language-section %}

{% language-section name="lang-2" %}

- `--depend-json`
  Print dependency information in JSON format to standard output by default, or to the file specified by the `--depend-file` option.
{% /language-section %}

{% language-section name="lang-3" %}

# The Slice Compiler for JavaScript

The Slice-to-JavaScript compiler (`slice2js`) offers the following command-line options in addition to the standard options:

- `--stdout`
  Print generated code to standard output.
- `--typescript`
  Generate TypeScript declaration file.
- `--depend-json`
  Print dependency information in JSON format to standard output by default, or to the file specified by the `--depend-file` option. No code is generated when this option is specified. The output consists of the complete list of Slice files that the input Slice files depend on through direct or indirect inclusion.
{% /language-section %}
