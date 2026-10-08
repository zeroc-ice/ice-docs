---
title: Editing and Saving IceGrid Descriptors
---

## Editing

As soon as you make any update in a form, IceGrid GUI enables two buttons at the bottom of this form: Apply and Discard.

If you navigate to another node without pressing Apply or Discard, the default is Apply: your changes are applied to the
in-memory representation of the application definition. However these changes are not stored to the IceGrid registry or
XML file until you save the application definition (see below).

Editing a live application
![live application](/images/ice/3.8/editing-and-saving-icegrid-descriptors/live-application.jpeg) also disconnects this
application from the IceGrid registry: updates made by other users are no longer propagated to the Application tab.

## Copy & Paste

Most descriptor sub-trees can be copied and later pasted. Copies are always deep-copies: for example if you copy a node,
all the servers on this code are copied, including all the the sub-elements of these servers (object adapters, services,
etc.).

![node-copied.png](/images/ice/3.8/editing-and-saving-icegrid-descriptors/node-copied.png)

After pasting a sub-tree, you typically need to check and edit the new elements to avoid any duplicate server IDs,
adapter IDs etc.

## Error Checking

IceGrid GUI performs very little error checking while you are working on an application definition. For example, you may
temporarily keep several servers with the same ID, leave some parameters of a template instance unset, or use an
undefined variable. All such errors are only detected when you save your application to an IceGrid registry.

There are nonetheless two types of constraints enforced by IceGrid GUI at all times:

- two descriptor nodes in an application tab display cannot have the same name.
- some fields (such as Path to Executable for a server) cannot be empty.

If you violate such a constraint, IceGrid GUI prevents you from applying your change.

## Saving

You save an application definition to an IceGrid registry or an XML file with the menu item `File > Save`,
`File > Save to File,` `File > Save to Registry (Servers may restart)`, `File > Save to Registry (No Server restart)` or
with the corresponding toolbar buttons.

`Save` is equivalent to `Save to Registry (Servers may restart)` for a live application, and to `Save to File` for a
file-bound application.

Saving an application to the IceGrid registry causes the registry to distribute any relevant changes to the affected
nodes. In turn, each node applies those changes to its servers. If a server is running at the time of an update, the
node may need to stop and restart it, depending on the changes that you make. Consequently, saving to the registry could
cause a disruption in service to any clients that are actively using the affected servers.

IceGrid GUI provides two versions of the `Save to Registry` command:

- `Save to Registry (Servers may restart)`: the node stops and restarts a running server whose descriptor changed,
  including a change to its configuration properties. A change to descriptions or to well-known or allocatable objects
  leaves the server running.
- `Save to Registry (No Server restart)`: IceGrid rejects the update unless it changes only the configuration properties
  of servers; a change to `Ice.Admin.Enabled` or `Ice.Admin.Endpoints` that enables or disables the Admin object counts
  as more than a property change. The node applies the new properties to a running server through its
  [Properties Facet](../../../../../administration/administrative-facility/properties-facet). The Ice runtime reads most
  of its properties at start-up, so a change to these properties takes effect when you restart the server, at a time of
  your choosing.

To avoid accidentally causing any disruption in service, we recommend using the `No server restart` option first. If
IceGrid rejects it, you can decide whether to force the servers to restart using the other Save command.

## Discarding Updates

You may discard all your updates by selecting `File > Discard Updates` or pressing the corresponding toolbar button.
`Discard Updates` simply reloads the application from the IceGrid registry or its associated XML file.

## Concurrent Updates to the Same IceGrid Registry

If several administrators update the same application definition concurrently, the last save will silently overwrite
previous (concurrent) updates.

To avoid this situation, you can acquire an exclusive write access to the IceGrid registry with
`File > Acquire Exclusive Write Access`. After this exclusive write access is granted, any attempt by another session to
save to the IceGrid registry will result in an error:

![access-denied-exclusive-access.png](/images/ice/3.8/editing-and-saving-icegrid-descriptors/access-denied-exclusive-access.png)
