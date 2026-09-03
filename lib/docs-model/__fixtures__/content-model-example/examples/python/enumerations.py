# Copyright (c) ZeroC, Inc.
#
# Compilable example backing the Python Enumerations page. The doc includes only
# the region between the <fruit-usage> markers; the markers are plain comments,
# so this file still runs as-is.

import enum


class Fruit(enum.IntEnum):
    Apple = 0
    Pear = 1
    Orange = 2


def main() -> None:
    # <fruit-usage>
    f = Fruit.Apple
    if f == Fruit.Apple:
        print("an apple")
    # </fruit-usage>


if __name__ == "__main__":
    main()
