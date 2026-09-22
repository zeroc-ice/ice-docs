---
id: communicator-initialization-and-destruction
language: php
---

{% language-section name="lang-1" %}

You create a communicator by calling `Ice\initialize`, for example:

```php
<?php
require_once 'Ice.php';

$communicator = Ice\initialize();
...
?>
```

In PHP, unlike other languages, you do not need to destroy the communicator: the Ice PHP extension automatically
destroys the communicator created during a request.

{% /language-section %}
