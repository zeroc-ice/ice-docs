{% language-section name="language" %}

## Ice for PHP

Ice for PHP is available as packages for Linux. After you [add the ZeroC repository](#linux-package-repositories) for
your distribution, install the Ice for PHP package. On Ubuntu and Debian:

```shell
sudo apt-get install php-zeroc-ice
```

On Red Hat Enterprise Linux:

```shell
sudo dnf install php-ice
```

On Amazon Linux 2023:

```shell
sudo dnf install php8.4-ice
```

The package installs the Ice extension for the PHP of your distribution and enables it, along with the Slice-to-PHP
compiler (`slice2php`). On other platforms, you build Ice for PHP from [source](#source-code).

{% /language-section %}
