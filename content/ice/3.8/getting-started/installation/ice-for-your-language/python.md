{% language-section name="language" %}

## Ice for Python

The [zeroc-ice](https://pypi.org/project/zeroc-ice/) package on PyPI provides Ice for Python 3.12 and later, with the
Slice-to-Python compiler (`slice2py`):

```shell
pip install zeroc-ice
```

PyPI has prebuilt wheels of `zeroc-ice` for macOS and for Windows on x64. On Linux, `pip` builds the package from
source, which requires a C++ compiler and the OpenSSL and bzip2 development headers.

### Linux

Ice for Python is also available as a Linux package, for every distribution except Debian 12. After you
[add the ZeroC repository](../../installation#linux-package-repositories), install it. On Ubuntu and Debian 13:

```shell
sudo apt-get install python3-zeroc-ice
```

On Red Hat Enterprise Linux and Amazon Linux:

```shell
sudo dnf install python3-ice
```

This package is built for Python 3.12.

{% /language-section %}
