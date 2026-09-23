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
  - generating-slice-documentation
  - slice-keywords
---

The Slice [IDL](https://en.wikipedia.org/wiki/Interface_description_language) is the fundamental abstraction mechanism
for separating object interfaces from their implementations. Slice establishes a contract between client and server that
describes the interfaces, operations and data types used by an application. This description is independent of the
implementation language, so it does not matter whether the client is written in the same language as the server.

{% callout type="info" %}

Even though Slice is an acronym, it is pronounced as a single syllable, like a slice of bread.

{% /callout %}

Slice definitions are compiled for a particular implementation language by a compiler. The language-specific Slice
compiler translates the language-independent Slice definitions into language-specific type definitions and APIs. These
types and APIs are used by the developer to provide application functionality and to interact with Ice. The translation
algorithms for various implementation languages are known as _language mappings_, and Ice provides a number of language
mappings (for C++, C#, Java, JavaScript, Python, Swift and more).

Because Slice describes interfaces and types (but not implementations), it is a purely declarative language; there is no
way to write executable statements in Slice.

Slice definitions focus on object interfaces, the operations supported by those interfaces, and exceptions that may be
raised by operations. This requires quite a bit of supporting machinery; in particular, much of Slice is concerned with
the definition of data types. This is because data can be exchanged between client and server only if their types are
defined in Slice. You cannot exchange arbitrary C++ data between a client and a server because it would destroy the
language independence of Ice. However, you can always create a Slice type definition that corresponds to the C++ data
you want to send, and then you can transmit the Slice type.

We present the full syntax and semantics of Slice here. Because much of Slice is based on C++ and Java, we focus on
those areas where Slice differs from C++ or Java or constrains the equivalent C++ or Java feature in some way. Slice
features that are identical to C++ and Java are mentioned mostly by example.
