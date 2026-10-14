{% language-section name="mapping" %}

You create a communicator by calling `Ice\initialize`, for example:

```php
<?php
require_once 'Ice.php';

$communicator = Ice\initialize();
...
?>
```

In PHP, unlike other languages, you do not need to destroy the communicator: when a PHP request completes, Ice for PHP
destroys every communicator that the request created and did not
[register](../communicators-in-php#registered-communicators-in-php).

{% /language-section %}
