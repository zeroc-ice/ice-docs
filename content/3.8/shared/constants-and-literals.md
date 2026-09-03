---
id: constants-and-literals
title: Constants and Literals
---

# Allowable Types for Constants

Slice allows you to define constants for the following types:

- An [integral](../basic-types) type (`bool`, `byte`, `short`, `int`, `long`)
- A [floating point](../basic-types) type (`float` or `double`)
- [string](../basic-types)
- [enum](../enumerations)

Here are a few examples:

```slice
module M
{
    const bool AppendByDefault = true;
    const byte LowerNibble = 0x0f;
    const string Advice = "Don't Panic!";
    const short TheAnswer = 42;
    const double PI = 3.1416;

    enum Fruit { Apple, Pear, Orange }
    const Fruit FavoriteFruit = Pear;
}
```

The syntax for literals is the same as for C++ and Java (with a few minor exceptions).

# Boolean constants

Boolean constants can only be initialized with the keywords `false` and `true`. (You cannot use `0` and `1` to represent `false` and `true`.)

# Integer literals

Integer literals can be specified in decimal, octal, or hexadecimal notation.

For example:

```slice
const byte TheAnswer = 42;
const byte TheAnswerInOctal = 052;
const byte TheAnswerInHex = 0x2A;       // or 0x2a
```

Be aware that, if you interpret `byte` as a number instead of a bit pattern, you may get different results in different languages. For example, for C++, `byte` maps to `std::uint8_t` whereas, for Java, `byte` maps to `byte`, which is a signed type.

Note that suffixes to indicate long and unsigned constants (`l`, `L`, `u`, `U`, used by C++) are illegal:

```slice
const long Wrong = 0u;          // Syntax error
const long WrongToo = 1000000L; // Syntax error
```

The value of an integer literal must be within the range of its constant type, as shown in the [Built-In Basic Types table](../basic-types); otherwise the compiler will issue a diagnostic.

# Floating-point literals

Floating-point literals use C++ syntax, except that you cannot use an `l` or `L` suffix to indicate an extended floating-point constant; however, `f` and `F` are legal (but are ignored).

Here are a few examples:

```slice
const float P1 = -3.14f;    // Integer & fraction, with suffix
const float P2 = +3.1e-3;   // Integer, fraction, and exponent
const float P3 = .1;        // Fraction part only
const float P4 = 1.;        // Integer part only
const float P5 = .9E5;      // Fraction part and exponent
const float P6 = 5e2;       // Integer part and exponent
```

Floating-point literals must be within the range of the constant type (`float` or `double`); otherwise, the compiler will issue a diagnostic.

# String literals

Slice string literals support the same [escape sequences as C++](https://en.cppreference.com/w/cpp/language/escape.html), with the exception of hexadecimal escape sequences that are limited to two hexadecimal digits.

| **Escape Sequence** | **Name** | **Corresponding ASCII or** **Unicode Code Point** | **Notes** |
| --- | --- | --- | --- |
| `\'` | single quote | 0x27 | |
| `\"` | double quote | 0x22 | |
| `\?` | question mark | 0x3f | |
| `\\` | backslash | 0x5c | |
| `\a` | audible bell | 0x07 | |
| `\b` | backspace | 0x08 | |
| `\f` | form feed | 0x0c | |
| `\n` | line feed | 0x0a | |
| `\r` | carriage return | 0x0d | |
| `\t` | horizontal tab | 0x09 | |
| `\v` | vertical tab | 0x0b | |
| `\nnn` | octal escape sequence | | 1 to 3 octal digits (0-7) that represent a byte value between 0 and 255 |
| `\xnn` | hexadecimal escape sequence | | 1 to 2 hexadecimal digits (0-9, a-f, A-F) |
| `\unnnn` | universal character name | U+nnnn | Exactly 4 hexadecimal digits.Use the \Unnnnnnnn notation for [astral characters](https://en.wikipedia.org/wiki/Plane_(Unicode)). |
| `\Unnnnnnnn` | universal character name | U+nnnnnnnn | Exactly 8 hexadecimal digits. |

A backslash (\) followed by another character is simply preserved as is.

Octal and hexadecimal escape sequences can represent ASCII characters (ordinal value 0 to 127) or the UTF-8 encoding of non-ASCII characters.

A string literal can contain printable ASCII characters (including the escape sequences presented above) and non-ASCII characters; non-printable ASCII characters (such as an unescaped tab) are not allowed.

Here are some examples:

```slice
const string AnOrdinaryString = "Hello World!";

const string DoubleQuote = "\"";
const string TwoSingleQuotes = "'\'"; // ' and \' are OK
const string QuestionMark = "\?";
const string Backslash = "\\";
const string AudibleBell = "\a";
const string Backspace = "\b";
const string FormFeed = "\f";
const string Newline = "\n";
const string CarriageReturn = "\r";
const string HorizontalTab = "\t";
const string VerticalTab = "\v";

const string OctalEscape = "\007"; // Same as \a
const string HexEscape1 = "\x07"; // Ditto
const string HexEscape2 = "\x41F"; // Same as AF 
const string Universal1 = "\u0041"; // Same as A
const string Universal2 = "\U00000041"; // Ditto
 
const string EuroSign1 =  "€";   // Euro sign (U+20AC)
// Euro sign as a short universal character name
const string EuroSign2 = "\u20AC";   
// Euro sign as a long universal character name
const string EuroSign3 =  "\U000020ac";   
// Euro sign in UTF-8 encoding, using hex escape sequences
const string EuroSign4 = "\xe2\x82\xAC";
// Euro sign in UTF-8 encoding, using octal escape sequences
const string EuroSign5 = "\342\202\254";
// Euro sign in UTF-8 encoding, using a mix or hex and octal escape sequences
const string EuroSign6 = "\342\x82\254";
```

```slice
const string NullString = null;    // Illegal!
```

Null strings simply do not exist in Slice and, therefore, do not exist as a legal value for a string anywhere in the Ice platform.

# Constant Expressions

A constant definition may also refer to another constant. It is not necessary for both constants to have the same Slice type, but the value of the existing constant must be compatible with the type of the constant being defined.

Consider the examples below:

```slice
const int SIZE = 500;

const int DEFAULT_SIZE = SIZE; // OK
const short SHORT_SIZE = SIZE; // OK
const byte BYTE_SIZE = SIZE; // ERROR
```

The `DEFAULT_SIZE` constant is legal because it has the same type as `SIZE`, and `SHORT_SIZE` is legal because the value of `SIZE` (`500`) is within the range of the Slice `short` type. However, `BYTE_SIZE` is illegal because the value of `SIZE` is outside the range of the `byte` type.

# Language Mapping

{% language-section name="lang-1" /%}

{% language-section name="lang-2" /%}

##### See Also

- [Enumerations](../enumerations)
- [Structures](../structures)
- [Sequences](../sequences)
- [Dictionaries](../dictionaries)
