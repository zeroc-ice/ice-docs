{% language-section name="mapping" %}

```csharp
// MyProcess implements Ice.Process
var myProcessFacet = new MyProcess(...);

communicator.removeAdminFacet("Process");
communicator.addAdminFacet(myProcessFacet, "Process");
communicator.getAdmin();
```

{% /language-section %}
