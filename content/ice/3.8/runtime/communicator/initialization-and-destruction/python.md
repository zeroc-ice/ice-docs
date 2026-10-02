{% language-section name="lang-1" %}

You create a communicator by using its constructor, for example:

```py
import Ice
import sys

def main():
    with Ice.Communicator(sys.argv) as communicator:
        ...
```

`Ice.Communicator` constructor accepts the argument list that is passed to the program by the operating system. The
constructor scans the argument list for any
[command-line options](../../properties-and-configuration/setting-properties-on-the-command-line) that are relevant to
the Ice runtime; any such options are removed from the argument list so, when `Ice.Communicator` constructor returns,
the only options and arguments remaining are those that concern your application. If anything goes wrong during
initialization, it throws an exception.

`Communicator` implements the [Python context manager protocol](https://peps.python.org/pep-0343/), with cleans up the
communicator automatically at the end of the with block.

`async with` is preferred in an async context. For example:

```py
import Ice
import asyncio
import sys

async def main():
    async with Ice.Communicator(
        sys.argv,
        eventLoop=asyncio.get_running_loop()) as communicator:
        ...
```

{% /language-section %}
