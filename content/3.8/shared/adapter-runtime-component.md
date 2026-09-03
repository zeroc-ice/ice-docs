---
id: adapter-runtime-component
title: Adapter Runtime Component
---

An adapter represents an Ice object adapter described in the IceGrid registry that resides in a server or an IceBox service. Note that direct object adapters are not displayed since IceGrid knows nothing about them.

# States

An adapter can be either active ![adapter active](/attachments/3.8/adapter-runtime-component/adapter-active.jpeg) or inactive ![adapter inactive](/attachments/3.8/adapter-runtime-component/adapter-inactive.jpeg).

# Properties

The Adapter Properties panel shows first the Runtime Status of the object adapter, i.e. "live" values retrieved from the enclosing server or service:

- **Status**
  The status of this object adapter: Active or Inactive.
- **Published Endpoints**
  The endpoints that this object adapter has registered with the IceGrid registry. Blank when the adapter's status is Inactive.

The remaining Server Properties under Configuration come from the IceGrid descriptor that defined this object adapter:

- **Description**
  A free-text description of this adapter.
- **Adapter ID**
  This object adapter's ID. Adapter IDs are unique within an IceGrid deployment.
- **Replica Group**
  When this adapter belongs to a replica group, shows the replica group ID. Blank otherwise.
- **Priority**
  The adapter's priority. Used only when the adapter belongs to a replica group with the "Ordered" load balancing policy.

- **Endpoints**
  The Endpoints configuration property of this object adapter.
- **Published Endpoints**
  The PublishedEndpoints configuration property of this object adapter.
- **Server Lifetime**
  When the Server Lifetime checkbox is checked, IceGrid considers that this object adapter is activated when the server starts up and deactivated when the server shuts down. This allows IceGrid to detect when a server is fully activated (all its object adapters with a server-lifetime have registered) and when a server is shutting down (at least one object adapter with server-lifetime has unregistered).
- **Well-known Objects**
  The well-known objects defined by this object adapter.
- **Allocatable Objects**
  The allocatable objects defined by this object adapter.
