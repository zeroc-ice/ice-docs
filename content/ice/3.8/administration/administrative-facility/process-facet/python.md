{% language-section name="mapping" %}

```py
# MyProcess implements Ice.Process
communicator.removeAdminFacet("Process")
communicator.addAdminFacet(MyProcess(communicator), "Process")
communicator.getAdmin()
```

{% /language-section %}
