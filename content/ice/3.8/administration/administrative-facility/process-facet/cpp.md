{% language-section name="mapping" %}

```cpp
// MyProcess implements Ice::Process
auto myProcessFacet = std::make_shared<MyProcess>(...);

communicator->removeAdminFacet("Process");
communicator->addAdminFacet(myProcessFacet, "Process");
communicator->getAdmin();
```

{% /language-section %}
