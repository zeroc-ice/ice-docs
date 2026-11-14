{% language-section name="mapping" %}

```py
# MyProcess implements Ice.Process
myProcessFacet = MyProcess(...)

communicator.removeAdminFacet("Process")
communicator.addAdminFacet(myProcessFacet, "Process")
communicator.getAdmin()
```

{% /language-section %}
