{% language-section name="mapping" %}

You create a communicator by calling `Ice\initialize`, for example:

```php
<?php
require_once 'Ice.php';

$communicator = Ice\initialize();
...
?>
```

`Ice\initialize` also accepts the argument array of a command-line script, such as `$argv`. It removes the Ice
[command-line options](../../properties-and-configuration/setting-properties-on-the-command-line) from this array, so
when `Ice\initialize` returns, the array holds only the arguments of your application.

In PHP, unlike other languages, you do not need to destroy the communicator: when a PHP request completes, Ice for PHP
destroys every communicator that the request created and did not
[register](../communicators-in-php#registered-communicators-in-php).

{% /language-section %}
