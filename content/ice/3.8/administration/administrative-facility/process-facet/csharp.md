{% language-section name="mapping" %}

```csharp
// MyProcess implements Ice.Process
communicator.removeAdminFacet("Process");
communicator.addAdminFacet(new MyProcess(communicator), "Process");
communicator.getAdmin();
```

{% /language-section %}
