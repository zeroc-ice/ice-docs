---
title: Object Identity
---

# The Identity Struct

Each Ice object has an object identity defined as follows:

```slice
module Ice 
{
    struct Identity 
    {
        string name;
        string category = "";
    }
}
```

As you can see, an object identity consists of a pair of strings, a `name` and a `category`. The complete object
identity is the combination of `name` and `category`, that is, for two identities to be equal, both `name` and
`category` must be the same. The `category` field is usually the empty string, unless you are using
[default servants](../default-servants) or callbacks with [Glacier2](../glacier2).

An identity with an empty `name` is not a valid identity.

Object identities can be represented as strings; the category part appears first and is followed by the name; the two
components are separated by a `/` character, for example:

```
Factory/File
```

In this example, `Factory` is the category, and `File` is the name. If the `name` or `category` field themselves contain
a `/` character, the stringified representation escapes the `/` character with a `\`, for example:

```
Factories\/Factory/Node\/File
```

In this example, the category is `Factories/Factory` and the name is `Node/File`.

# Syntax for Stringified Identities

You rarely need to write identities as strings because, typically, your code will be using the identity helper functions
`identityToString` and `stringToIdentity`, or simply deal with proxies instead of identities. However, on occasion, you
will need to use stringified identities in configuration files. If the identities happen to contain meta-characters
(such as a slash or backslash), or characters outside the printable ASCII range, these characters may need to be escaped
in the stringified representation.

Here are rules that the Ice runtime applies when parsing a stringified identity:

1. The parser scans the stringified identity for an unescaped slash character (`/`). If such a slash character can be
   found, the substrings to the left and right of the slash are parsed as the `category` and `name` fields of the
   identity, respectively; if no such slash character can be found, the entire string is parsed as the `name` field of
   the identity, and the `category` field is the empty string.
2. Each of the `category` (if present) and `name` substrings are parsed like
   [Slice String Literals](../constants-and-literals), except that an escaped slash character (`\/)` is converted into a
   simple slash (`/`).

# Identity Helper Functions

To make conversion of identities to and from strings easier, Ice provides functions to convert an Identity to and from a
native string, using the string format described in the preceding paragraph. These helper functions are called
`identityToString` (to stringify an identity into a string) and `stringToIdentity` (to parse a stringified identity and
create the corresponding identity).

## `ToStringMode` Enumeration

When _stringifying_ an identity with `identityToString`, you can choose the algorithm, or mode, used in this "to string"
implementation. These modes correspond to the enumerators of the
[ToStringMode](https://code.zeroc.com/manual/Ice/ToStringMode) enumeration.

These modes are used only when you create a stringified identity with `identityToString`, or when you “stringify” a
proxy.

The selected mode affects only the handling of non-ASCII characters and non-printable ASCII characters, such as the
ASCII character with ordinal value 127 (delete).

The table below shows how these characters are encoded depending of the selected `ToStringMode`:

| **ToStringMode** | **Non-Printable ASCII Character** **other than \a, \b, \f, \n, \r, \t and \v**      | **Non-ASCII Character**                                                                                                                                                                                                                                                          | **Notes**                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `Unicode`        | Replaced by its short universal character name. For example \u007F (delete).        | Not escaped - kept as is.                                                                                                                                                                                                                                                        | The resulting string contains printable ASCII characters plus possibly non-ASCII characters. |
| `ASCII`          | Replaced by its short universal character name, just like `Unicode`.                | If the character's code point is in the BMP, it's escaped with its short universal character name (\unnnn); if the character is outside the BMP, it's escaped with its long universal character name (\Unnnnnnnn).For example \u20ac (euro sign) and \U0001F34C (banana symbol). | The resulting string contains only printable ASCII characters.                               |
| `Compat`         | Replaced by an octal escape sequence with 3 digits, \ooo.For example \177 (delete). | Replaced by a sequence of 3-digit octal escape sequences, that represent the UTF-8 encoding of this character.For example \342\202\254 (euro sign) and \360\237\215\214 (banana symbol)                                                                                          | The resulting string contains only printable ASCII characters.                               |

The default mode is `Unicode`.

The `Compat` mode is provided for backwards-compatibility with Ice 3.6 and earlier. These older versions do not
recognize universal character names and reject non-printable ASCII characters in stringified identities.

##### See Also

- [Default Servants](../default-servants)
- [Glacier2](../glacier2)
