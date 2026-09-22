---
id: the-per-process-logger
language: csharp
---

{% language-section name="lang-1" %}

```csharp
namespace Ice;

public sealed class Util
{
    public static Logger getProcessLogger()
    {
      ...
    }

    public static void setProcessLogger(Logger logger)
    {
      ...
    }
}
```

{% /language-section %}
