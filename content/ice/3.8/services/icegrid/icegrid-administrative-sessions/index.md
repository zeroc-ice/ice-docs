---
title: IceGrid Administrative Sessions
sidebarLabel: Administrative Sessions
---

To access IceGrid's administrative facilities from a program, you must first establish an administrative session. Once
done, a wide range of services are at your disposal, including the manipulation of IceGrid registries, nodes, and
servers; deployment of new components such as well-known objects; and dynamic monitoring of IceGrid events.

Note that, for [replicated registries](../registry-replication), an administrative client can establish a session with
either the master or a slave registry replica. A slave replica rejects operations that change the registry database,
such as deploying an application, but it can start and stop servers.

## Creating an Administrative Session

The `Registry` interface provides two operations for creating an administrative session:

```slice
module IceGrid
{
    exception PermissionDeniedException
    {
        string reason;
    }

    interface Registry
    {
        AdminSession* createAdminSession(string userId, string password)
            throws PermissionDeniedException;

        AdminSession* createAdminSessionFromSecureConnection()
            throws PermissionDeniedException;
    }
}
```

The `createAdminSession` operation expects a username and password and returns a session proxy if the client is allowed
to create a session. By default, IceGrid does not allow the creation of administrative sessions. You must define the
property
[IceGrid.Registry.AdminPermissionsVerifier](../../../property-reference/icegrid-properties#icegrid.registry.adminpermissionsverifier)
with the proxy of a permissions verifier object to enable session creation with `createAdminSession`. The verifier
object must implement the interface [Glacier2::PermissionsVerifier](../../glacier2/securing-a-glacier2-router).

The `createAdminSessionFromSecureConnection` operation does not require a username and password because it uses the
credentials supplied by an [SSL](../../../runtime/ssl-transport) connection to authenticate the client. As with
`createAdminSession`, you must configure the proxy of a permissions verifier object before clients can use
`createAdminSessionFromSecureConnection` to create a session. In this case, the
[IceGrid.Registry.AdminSSLPermissionsVerifier](../../../property-reference/icegrid-properties#icegrid.registry.adminsslpermissionsverifier)
property specifies the proxy of a verifier object that implements the interface
[Glacier2::SSLPermissionsVerifier](../../glacier2/securing-a-glacier2-router). `createAdminSessionFromSecureConnection`
requires a client certificate with a non-empty subject name.

As an example, the following code demonstrates how to obtain a proxy for the registry and invoke `createAdminSession`:

```cpp
IceGrid::RegistryPrx registry{communicator, "IceGrid/Registry"};
string username = ...;
string password = ...;
std::optional<IceGrid::AdminSessionPrx> session;
try
{
    session = registry.createAdminSession(username, password);
}
catch (const IceGrid::PermissionDeniedException& ex)
{
    cout << "permission denied:\n" << ex.reason << endl;
}
```

An administrative session ends when the connection that created it closes, or when the client calls `destroy` on the
session object. The client-side
[inactivity check](../../../runtime/connection-management/connection-closure#the-inactivity-check) closes a connection
that carries no invocations for
[Ice.Connection.Client.InactivityTimeout](../../../property-reference/ice-connection-properties#ice.connection.name.inactivitytimeout)
seconds, 300 by default; a client that holds a session idle for longer sets this property to `0`. A session created
through a Glacier2 router ends with the client's [router session](../../glacier2/glacier2-session-management).

The `AdminSession` interface provides operations for [accessing log files](#accessing-log-files-remotely) and
establishing [observers](#dynamic-monitoring-in-icegrid). Its `getAdmin` operation returns a proxy for the
`IceGrid::Admin` interface, which provides complete access to the registry's settings. For this reason, you must use
extreme caution when enabling administrative sessions.

## Accessing Log Files Remotely

IceGrid's `AdminSession` interface provides operations for remotely accessing the log files of a registry, node, or
server:

```slice
module IceGrid
{
    interface AdminSession extends Glacier2::Session
    {
        // ...
        FileIterator* openServerLog(string id, string path, int count)
            throws FileNotAvailableException, ServerNotExistException,
                   NodeUnreachableException, DeploymentException;
        FileIterator* openServerStdErr(string id, int count)
            throws FileNotAvailableException, ServerNotExistException,
                   NodeUnreachableException, DeploymentException;
        FileIterator* openServerStdOut(string id, int count)
            throws FileNotAvailableException, ServerNotExistException,
                   NodeUnreachableException, DeploymentException;
        FileIterator* openNodeStdErr(string name, int count)
            throws FileNotAvailableException, NodeNotExistException,
                   NodeUnreachableException;
        FileIterator* openNodeStdOut(string name, int count)
            throws FileNotAvailableException, NodeNotExistException,
                   NodeUnreachableException;
        FileIterator* openRegistryStdErr(string name, int count)
            throws FileNotAvailableException,
                   RegistryNotExistException,
                   RegistryUnreachableException;
        FileIterator * openRegistryStdOut(string name, int count)
            throws FileNotAvailableException,
                   RegistryNotExistException,
                   RegistryUnreachableException;
    }
}
```

In order to access the text of a program's standard output or standard error log, you must configure it using the
[Ice.StdOut](../../../property-reference/ice-properties#ice.stdout) and
[Ice.StdErr](../../../property-reference/ice-properties#ice.stderr) properties, respectively. For registries and nodes,
you must define these properties explicitly but, for servers, the node defines these properties automatically if the
property [IceGrid.Node.Output](../../../property-reference/icegrid-properties#icegrid.node.output) is defined, causing
the server's output to be logged in individual files.

If `IceGrid.Node.Output` is _not_ defined, the following rules apply:

- If the node is started from a console or shell, servers share the node's `stdout` and `stderr`. If `Ice.StdOut` and/or
  `Ice.StdErr` properties are defined for the node, the servers' output is redirected to the specified files as well.
- If the node is started as a daemon and `--noclose` is not used, the servers' output is lost, except if `Ice.StdOut`
  and/or `Ice.StdErr` properties are set for the node, in which case the servers' output is redirected to the specified
  files.
- If the node is started as a Windows service, the servers' output is lost even if `Ice.StdOut` and/or `Ice.StdErr` are
  set.

Log messages from the node itself are sent to `stderr` unless you set
[Ice.UseSyslog](../../../property-reference/ice-properties#ice.usesyslog) (Linux and macOS only). If the node is started
as a Windows service, its log messages always are sent to the Windows event log.

In the case of `openServerLog`, the value of the `path` argument must resolve to the same file as one of the server's
[log descriptors](../icegrid-xml-reference/log-descriptor-element). This security measure prevents a client from opening
an arbitrary file on the server's host.

All of the operations accept a `count` argument and return a proxy to a `FileIterator` object. The `count` argument
determines where to start reading the log file: if the value is negative, the iterator is positioned at the beginning of
the file, otherwise the iterator is positioned to return the last `count` lines of text.

The `FileIterator` interface is quite simple:

```slice
module IceGrid
{
    interface FileIterator
    {
        bool read(int size, out Ice::StringSeq lines)
            throws FileNotAvailableException;
        void destroy();
    }
}
```

A client may invoke the `read` operation as many times as necessary. The `size` argument specifies the maximum number of
bytes that `read` can return; the client must not use a size that would cause the reply to exceed the client's
configured [maximum message size](../../../property-reference/ice-properties).

If this is the client's first call to `read`, the `lines` argument holds whatever text was available from the iterator's
initial position, and the iterator is repositioned in preparation for the next call to `read`. The operation returns
false to indicate that more text is available and true if all available text has been read.

Line termination characters are removed from the contents of `lines`. When displaying the text, you must be aware that
the first and last elements of the sequence can be partial lines. For example, the last line of the sequence might be
incomplete if the limit specified by `size` is reached. The next call to `read` returns the remainder of that line as
the first element in the sequence.

As an example, the C++ code below displays the contents of a log file and waits for new text to become available:

```cpp
IceGrid::FileIteratorPrx iter = ...;
while (true)
{
    Ice::StringSeq lines;
    bool end = iter.read(10000, lines);
    if (!lines.empty())
    {
        // The first line might be a continuation from
        // the previous call to read.
        cout << lines[0];
        for (size_t i = 1; i < lines.size(); ++i)
        {
            cout << endl << lines[i];
        }
        cout << flush;
    }
    if (end)
    {
        sleep(1);
    }
}
```

Notice that the loop includes a delay in case `read` returns true, which prevents the client from entering a busy loop
when no data is currently available.

The client should call `destroy` when the iterator object is no longer required. At the time the client's session
terminates, IceGrid reclaims any iterators that were not explicitly destroyed.

Each file operation reads one file configured for the target program: the file named by its `Ice.StdOut` or `Ice.StdErr`
property or, for `openServerLog`, a file declared by one of the server's
[log descriptors](../icegrid-xml-reference/log-descriptor-element). The file can contain the output of the Ice
[logger](../../../administration/logger-facility) and any other text the program writes, and the `FileIterator` returns
it as lines of text with no further structure.

### Choosing a Log Retrieval Method

The `AdminSession` file operations and the
[Logger admin facet](../../../administration/administrative-facility/logger-facet) both give an administrative client
access to the log of a server, node, or registry.

- **AdminSession file operations** The client reads the text a program wrote to a file, including the files of a server
  that is not running, and polls for new text by calling `read` on the `FileIterator`.
- **Logger admin facet** The client attaches a remote logger to a running program, and the facet forwards each message
  sent to the program's Ice logger to this remote logger as a typed record, whether or not the logger writes it to a
  file.

## Dynamic Monitoring in IceGrid

IceGrid allows an application to monitor relevant state changes by registering callback objects. (The
[IceGrid GUI tool](../icegrid-gui-tool) uses these callback interfaces for its implementation.) The callback interfaces
are useful to, for example, automatically generate an email notification when a node goes down or some other state
change of interest occurs.

### Observer Interfaces

IceGrid offers a callback interface for each major component of the IceGrid architecture:

```slice
module IceGrid
{
    interface NodeObserver
    {
        void nodeInit(NodeDynamicInfoSeq nodes);
        void nodeUp(NodeDynamicInfo node);
        void nodeDown(string name);
        void updateServer(string node, ServerDynamicInfo updatedInfo);
        void updateAdapter(string node, AdapterDynamicInfo updatedInfo);
    }

    interface ApplicationObserver
    {
        void applicationInit(int serial, ApplicationInfoSeq applications);
        void applicationAdded(int serial, ApplicationInfo desc);
        void applicationRemoved(int serial, string name);
        void applicationUpdated(int serial, ApplicationUpdateInfo desc);
    }

    interface AdapterObserver
    {
        void adapterInit(AdapterInfoSeq adpts);
        void adapterAdded(AdapterInfo info);
        void adapterUpdated(AdapterInfo info);
        void adapterRemoved(string id);
    }

    interface ObjectObserver
    {
        void objectInit(ObjectInfoSeq objects);
        void objectAdded(ObjectInfo info);
        void objectUpdated(ObjectInfo info);
        void objectRemoved(Ice::Identity id);
    }

    interface RegistryObserver
    {
        void registryInit(RegistryInfoSeq registries);
        void registryUp(RegistryInfo node);
        void registryDown(string name);
    }
}
```

`AdapterObserver` reports the object adapters that register their endpoints dynamically, and `ObjectObserver` reports
the well-known objects added through the `Admin` interface and the registry's own well-known objects, such as
`IceGrid/Query` and `IceGrid/Locator`. `ApplicationObserver` reports the adapters and objects that an application's
descriptors define.

The next section describes how to install an observer.

### Registering Observers

The `AdminSession` interface provides two operations for registering your observers:

```slice
module IceGrid
{
    interface AdminSession extends Glacier2::Session
    {
        idempotent void setObservers(RegistryObserver* registryObs,
                                     NodeObserver* nodeObs,
                                     ApplicationObserver* appObs,
                                     AdapterObserver* adptObs,
                                     ObjectObserver* objObs)
            throws ObserverAlreadyRegisteredException;

        idempotent void setObserversByIdentity(Ice::Identity registryObs,
                                               Ice::Identity nodeObs,
                                               Ice::Identity appObs,
                                               Ice::Identity adptObs,
                                               Ice::Identity objObs)
            throws ObserverAlreadyRegisteredException;
        // ...
    }
}
```

You should invoke `setObservers` and supply proxies when it is possible for the registry to establish a separate
connection to the client to deliver its callbacks. If network restrictions such as firewalls prevent such a connection,
you should use the `setObserversByIdentity` operation, which creates a
[bidirectional connection](../../../runtime/connection-management/bidirectional-connections) instead.

You can pass a null proxy for any parameter to `setObservers`, or an empty identity for any parameter to
`setObserversByIdentity`, if you want to use only some of the observers. In addition, passing a null proxy or an empty
identity for an observer cancels a previous registration of that observer. The operations raise
`ObserverAlreadyRegisteredException` if you pass a proxy or identity that was registered in a previous call.

Once the observers are registered, operations corresponding to state changes will be invoked on the observers. (See the
Slice API Reference for details on the data passed to the observers. You can also look at the source code for the
IceGrid GUI implementation in the Ice for Java distribution to see how observers are used by the GUI.)

## Locking Application Updates

The registry provides an exclusive update lock. While an administrative session holds it, no other session can change
applications, so a tool can read the current application descriptors, edit them and save them without another tool
saving in between:

```slice
module IceGrid
{
    interface AdminSession extends Glacier2::Session
    {
        int startUpdate()
            throws AccessDeniedException;

        void finishUpdate()
            throws AccessDeniedException;
        // ...
    }
}
```

The registry numbers its application updates. `startUpdate` acquires the lock for the session and returns the serial
number of the latest update. While the session holds the lock, the registry throws `AccessDeniedException` when another
session calls `startUpdate` or an `Admin` operation that changes an application: `addApplication`, `syncApplication`,
`updateApplication`, `syncApplicationWithoutRestart`, `updateApplicationWithoutRestart`, `removeApplication`, or
`instantiateServer`.

`finishUpdate` releases the lock, and throws `AccessDeniedException` if the session does not hold it. IceGrid also
releases the lock when it destroys the session.

Each `ApplicationObserver` callback carries the serial number of the update it reports. A tool that mirrors the
applications with an application observer is up to date once its observer has received a callback with the serial number
`startUpdate` returned; it can then edit the applications and save its changes. The
[IceGrid GUI tool](../icegrid-gui-tool/application-tabs/editing-and-saving-icegrid-descriptors#concurrent-updates-to-the-same-icegrid-registry)
acquires this lock with `File > Acquire Exclusive Write Access`, and waits until it is up to date before it saves your
changes.

## See Also

- [Registry Replication](../registry-replication)
- [Securing a Glacier2 Router](../../glacier2/securing-a-glacier2-router)
- [Resource Allocation Using IceGrid Sessions](../resource-allocation-using-icegrid-sessions)
- [Log Descriptor Element](../icegrid-xml-reference/log-descriptor-element)
- [icegridadmin Command Line Tool](../icegridadmin-command-line-tool)
- [Bidirectional Connections](../../../runtime/connection-management/bidirectional-connections)
- [IceGrid.*](../../../property-reference/icegrid-properties)
- [Logger admin Facet](../../../administration/administrative-facility/logger-facet)
