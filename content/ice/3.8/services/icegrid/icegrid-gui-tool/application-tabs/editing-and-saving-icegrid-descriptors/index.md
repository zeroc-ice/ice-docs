---
title: Editing and Saving IceGrid Descriptors
---

# Editing

As soon as you make any update in a form, IceGrid GUI enables two buttons at the bottom of this form: Apply and Discard.

If you navigate to another node without pressing Apply or Discard, the default is Apply: your changes are applied to the
in-memory representation of the application definition. However these changes are not stored to the IceGrid registry or
XML file until you save the application definition (see below).

Editing a live application
![live application](/attachments/3.8/editing-and-saving-icegrid-descriptors/live-application.jpeg) also disconnects this
application from the IceGrid registry: updates made by other users are no longer propagated to the Application tab.

# Copy & Paste

Most descriptor sub-trees can be copied and later pasted. Copies are always deep-copies: for example if you copy a node,
all the servers on this code are copied, including all the the sub-elements of these servers (object adapters, services,
etc.).

![node-copied.png](/attachments/3.8/editing-and-saving-icegrid-descriptors/node-copied.png)

After pasting a sub-tree, you typically need to check and edit the new elements to avoid any duplicate server IDs,
adapter IDs etc.

# Error Checking

IceGrid GUI performs very little error checking while you are working on an application definition. For example, you may
temporarily keep several servers with the same ID, leave some parameters of a template instance unset, or use an
undefined variable. All such errors are only detected when you save your application to an IceGrid registry.

There are nonetheless two types of constraints enforced by IceGrid GUI at all times:

- two descriptor nodes in an application tab display cannot have the same name.
- some fields (such as Path to Executable for a server) cannot be empty.

If you violate such a constraint, IceGrid GUI prevents you from applying your change.

# Saving

You save an application definition to an IceGrid registry or an XML file with the menu item `File > Save`,
`File > Save to File,` `File > Save to Registry (Servers may restart)`, `File > Save to Registry (No Server restart)` or
with the corresponding toolbar buttons.

`Save` is equivalent to `Save to Registry (Servers may restart)` for a live application, and to `Save to File` for a
file-bound application.

Saving an application to the IceGrid registry causes the registry to distribute any relevant changes to the affected
nodes. In turn, each node applies those changes to its servers. If a server is running at the time of an update, the
node may need to stop and restart it, depending on the changes that you make. Consequently, saving to the registry could
cause a disruption in service to any clients that are actively using the affected servers.

The following application changes do _not_ require a restart:

- Adding, modifying, or removing a server's configuration properties
- Adding new servers

All other changes will require a restart. IceGrid GUI provides two versions of the `Save to Registry` command, one that
allows restarts and one that does not. To avoid accidentally causing any disruption in service, we recommend using the
`No server restart` option first; this command will fail if any of your updates require a restart. At that point, you
can decide whether to force the servers to restart using the other Save command.

{% callout type="info" %}

If you change a server's configuration properties with `Save to Registry (No Server restart)`, IceGrid updates the
stored properties of this server, and also the properties of your running server instance through its
[Properties Facet](../properties-facet). If these properties are only read by the server at start-up, this may not have
the desired effect. If you want to trigger a server restart even when only properties have changed, use
`Save to Registry (Servers may restart)`.

{% /callout %}

# Discarding Updates

You may discard all your updates by selecting `File > Discard Updates` or pressing the corresponding toolbar button.
`Discard Updates` simply reloads the application from the IceGrid registry or its associated XML file.

# Concurrent Updates to the same IceGrid Registry

If several administrators update the same application definition concurrently, the last save will silently overwrite
previous (concurrent) updates.

To avoid this situation, you can acquire an exclusive write access to the IceGrid registry with
`File > Acquire Exclusive Write Access`. After this exclusive write access is granted, any attempt by another session to
save to the IceGrid registry will result in an error:

![access-denied-exclusive-access.png](/attachments/3.8/editing-and-saving-icegrid-descriptors/access-denied-exclusive-access.png)
