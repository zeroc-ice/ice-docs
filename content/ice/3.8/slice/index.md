---
title: The Slice Language
pages:
  - slice-compilation
  - slice-source-files
  - lexical-rules
  - basic-types
  - modules
  - user-defined-types
  - fields
  - constants-and-literals
  - interfaces
  - operations
  - exceptions
  - forward-declarations
  - type-ids
  - operations-on-object
  - names-and-scoping
  - slice-metadata-directives
  - deprecating-slice-definitions
  - using-the-slice-compiler
  - code-generation
  - documenting-slice-definitions
  - slice-keywords
---

Slice is the [interface definition language](https://en.wikipedia.org/wiki/Interface_description_language) (IDL) of Ice.
Slice definitions describe the interfaces of Ice objects, with their operations, parameters, return values and
exceptions, and the data types those operations exchange. A client and a server can exchange only data whose types are
defined in Slice.

{% callout type="note" %}

Even though Slice is an acronym, it is pronounced as a single syllable, like a slice of bread.

{% /callout %}

Slice definitions are independent of any programming language. They form a contract between client and server, so the
client and the server can be written in different languages.

Each language has its own Slice compiler, such as `slice2cpp` for C++ or `slice2java` for Java, which translates Slice
definitions into types and APIs for that language. Clients use the generated code to invoke operations, and servers use
it to implement them. The rules of this translation are called a _language mapping_; Ice provides language mappings for
C++, C#, Java, JavaScript, MATLAB, PHP, Python, Ruby and Swift.

Slice is a purely declarative language: it describes interfaces and types, and contains no executable statements.
