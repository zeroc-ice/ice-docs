---
id: constants-and-literals
language: cpp
---

{% language-section name="lang-1" %}

Slice constant definitions map to corresponding C++ constant definitions. Slice constants are mapped to `constexpr`
constants whenever possible, and to `const` constants otherwise. For example:

```
const bool AppendByDefault = true;
const byte LowerNibble = 0x0f;
const string Advice = "Don't Panic!";
const short TheAnswer = 42;
const double PI = 3.1416;

enum Fruit { Apple, Pear, Orange }
const Fruit     FavoriteFruit = Pear;
```

Here are the generated C++ definitions for these constants:

```cpp
constexpr bool AppendByDefault = true;
constexpr std::uint8_t LowerNibble = 15;
const std::string Advice = "Don't Panic!";
constexpr std::int16_t TheAnswer = 42;
constexpr double PI = 3.1416;

enum class Fruit : std::uint8_t { Apple, Pear, Orange };
std::ostream& operator<<(std::ostream& os, Fruit value);

constexpr Fruit FavoriteFruit = Fruit::Pear;
```

All constants are initialized directly in the header file, so they are compile-time constants and can be used in
contexts where a compile-time constant expression is required, such as to dimension an array or as the `case` label of a
`switch` statement.

A Slice string literal that contains non-ASCII characters is mapped by default to a narrow C++ string literal with the
non-ASCII characters replaced by the octal escape sequences for the characters' UTF-8 encoding. For example:

```slice
const string Egg = "œuf";
```

is mapped to:

```cpp
const std::string Egg = "\305\223uf";
```

If you map a string constant to a `std::wstring`, the non-ASCII characters in the string literal are replaced by
universal character names. For example:

```slice
const ["cpp:type:wstring"] string LargeEgg = "gros œuf";
```

is mapped to:

```cpp
const std::wstring LargeEgg = L"gros \u0153uf";
```

A Slice string literal that contains universal character names is mapped to a narrow C++ string with one ore more octal
escape sequences or to a wide C++ string with the universal character names preserved. For example:

```slice
const string Heart = "c\u0153ur";
const ["cpp:type:wstring"] string BigHeart = "grand c\u0153ur";
const ["cpp:type:wstring"] string Banana = "\U0001F34C";
```

is mapped to:

```cpp
const std::string Heart = "c\305\223ur";
const std::wstring BigHeart = L"grand c\u0153ur";
const std::wstring Banana = L"\U0001F34C";
```

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}
