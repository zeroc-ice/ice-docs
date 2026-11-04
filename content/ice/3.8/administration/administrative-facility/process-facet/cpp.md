{% language-section name="mapping" %}

```cpp
// MyProcess implements Ice::Process
communicator->removeAdminFacet("Process");
communicator->addAdminFacet(std::make_shared<MyProcess>(communicator), "Process");
communicator->getAdmin();
```

{% /language-section %}
