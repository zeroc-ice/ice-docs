{% language-section name="creating" %}

You create a communicator by using its constructor, for example:

```py
import Ice
import sys

def main():
    with Ice.Communicator(sys.argv) as communicator:
        ...
```

The `Ice.Communicator` constructor takes the command-line arguments of the program. It
[sets a property](../properties-and-configuration/setting-properties-on-the-command-line) for each argument that names
an Ice property, and removes these arguments from the list.

`Communicator` implements the [Python context manager protocol](https://peps.python.org/pep-0343/), which cleans up the
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

{% language-section name="initialization-data" %}

To combine initialization data with the command-line arguments, create the communicator's properties from the argument
list:

```py
initData = Ice.InitializationData()
initData.properties = Ice.Properties(sys.argv)
# ... set other initData fields ...
with Ice.Communicator(initData=initData) as communicator:
    ...
```

{% /language-section %}
