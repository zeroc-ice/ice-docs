// Copyright (c) ZeroC, Inc.
//
// Compilable example backing the C++ Enumerations page. The doc includes only
// the region between the <fruit-usage> markers; the markers are plain comments,
// so this file still compiles as-is.

#include <iostream>

enum class Fruit { Apple, Pear, Orange };

int main()
{
    // <fruit-usage>
    Fruit f = Fruit::Apple;
    if (f == Fruit::Apple)
    {
        std::cout << "an apple\n";
    }
    // </fruit-usage>
    return 0;
}
