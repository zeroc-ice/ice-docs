---
id: using-the-slice-compiler
language: matlab
---

{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}

{% language-section name="lang-3" %}

# The Slice Compiler for MATLAB

The Slice-to-MATLAB compiler (`slice2matlab`) offers two additional options:

- `--all` Generate code for all Slice definitions, including those from included files.
- `--list-generated` Emit a list of generated files in XML format.

`slice2matlab` does **not** support the `--depend` flag, although it does still support `--depend-xml` and
`--depend-file`.

{% /language-section %}
