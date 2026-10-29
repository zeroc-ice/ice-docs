---
title: Constants and Literals
---

## Allowable Types for Constants

Slice allows you to define constants for the following types:

- [bool](../basic-types), initialized with `true` or `false`
- An [integral](../basic-types) type (`byte`, `short`, `int`, `long`)
- A [floating point](../basic-types) type (`float` or `double`)
- [string](../basic-types)
- [enum](../user-defined-types/enumerations)

Here are a few examples:

```slice
module M
{
    const bool AppendByDefault = true;
    const byte LowerNibble = 0x0f;
    const string Advice = "Don't Panic!";
    const short TheAnswer = 42;
    const double PI = 3.1416;

    enum Fruit { Apple, Pear, Orange }
    const Fruit FavoriteFruit = Pear;
}
```

## Integer Literals

Integer literals can be specified in decimal, octal, or hexadecimal notation.

For example:

```slice
const byte TheAnswer = 42;
const byte TheAnswerInOctal = 052;
const byte TheAnswerInHex = 0x2A;       // or 0x2a
```

The value of an integer literal must be within the range of its constant type, as shown in the
[Built-In Basic Types table](../basic-types). A `byte` constant takes a value from 0 to 255.

## Floating-Point Literals

A floating-point literal has an integer part, a fractional part after a period, or both, followed by an optional
exponent. A literal without a period requires an exponent. A floating-point literal can end with an `f` or `F` suffix,
which the Slice compiler ignores.

Here are a few examples:

```slice
const float P1 = -3.14f;    // Integer and fraction, with suffix
const float P2 = +3.1e-3;   // Integer, fraction, and exponent
const float P3 = .1;        // Fraction part only
const float P4 = 1.;        // Integer part only
const float P5 = .9E5;      // Fraction part and exponent
const float P6 = 5e2;       // Integer part and exponent
```

Floating-point literals must be within the range of the constant type (`float` or `double`).

## String Literals

Slice string literals support the following escape sequences:

| **Escape Sequence** | **Name**                    | **Corresponding ASCII or** **Unicode Code Point** | **Notes**                                                                                                                             |
| ------------------- | --------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `\'`                | single quote                | 0x27                                              |                                                                                                                                       |
| `\"`                | double quote                | 0x22                                              |                                                                                                                                       |
| `\?`                | question mark               | 0x3f                                              |                                                                                                                                       |
| `\\`                | backslash                   | 0x5c                                              |                                                                                                                                       |
| `\a`                | audible bell                | 0x07                                              |                                                                                                                                       |
| `\b`                | backspace                   | 0x08                                              |                                                                                                                                       |
| `\f`                | form feed                   | 0x0c                                              |                                                                                                                                       |
| `\n`                | line feed                   | 0x0a                                              |                                                                                                                                       |
| `\r`                | carriage return             | 0x0d                                              |                                                                                                                                       |
| `\t`                | horizontal tab              | 0x09                                              |                                                                                                                                       |
| `\v`                | vertical tab                | 0x0b                                              |                                                                                                                                       |
| `\nnn`              | octal escape sequence       |                                                   | 1 to 3 octal digits (0-7) that represent a byte value between 0 and 255                                                               |
| `\xnn`              | hexadecimal escape sequence |                                                   | 1 to 2 hexadecimal digits (0-9, a-f, A-F)                                                                                             |
| `\unnnn`            | universal character name    | U+nnnn                                            | Exactly 4 hexadecimal digits. Use the `\Unnnnnnnn` notation for [astral characters](<https://en.wikipedia.org/wiki/Plane_(Unicode)>). |
| `\Unnnnnnnn`        | universal character name    | U+nnnnnnnn                                        | Exactly 8 hexadecimal digits.                                                                                                         |

Octal and hexadecimal escape sequences can represent ASCII characters (ordinal value 0 to 127) or the UTF-8 encoding of
non-ASCII characters.

A string literal can contain printable ASCII characters (including the escape sequences presented above) and non-ASCII
characters; non-printable ASCII characters (such as an unescaped tab) are not allowed.

Here are some examples:

```slice
const string AnOrdinaryString = "Hello World!";

const string DoubleQuote = "\"";
const string TwoSingleQuotes = "'\'"; // ' and \' are OK
const string Newline = "\n";

const string OctalEscape = "\007"; // Same as \a
const string HexEscape1 = "\x07"; // Ditto
const string HexEscape2 = "\x41F"; // Same as AF: a hexadecimal escape has at most 2 digits
const string Universal = "\u0041"; // Same as A

const string EuroSign1 = "€"; // Euro sign (U+20AC)
const string EuroSign2 = "\u20AC"; // Universal character name
const string EuroSign3 = "\xe2\x82\xac"; // UTF-8 encoding, using hexadecimal escape sequences
```

## Referencing Other Constants

A constant definition may also refer to another constant. It is not necessary for both constants to have the same Slice
type, but the value of the existing constant must be compatible with the type of the constant being defined.

Consider the examples below:

```slice
const int SIZE = 500;

const int DEFAULT_SIZE = SIZE; // OK: same type
const short SHORT_SIZE = SIZE; // OK: 500 is within the range of short
const byte BYTE_SIZE = SIZE;   // Error: 500 is outside the range of byte
```

## Language Mapping

{% language-section name="language-mapping-1" /%}

{% language-section name="language-mapping-2" /%}

## See Also

- [Basic Types](../basic-types)
- [Fields](../fields#default-values)
- [Enumerations](../user-defined-types/enumerations)
