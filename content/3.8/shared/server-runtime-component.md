---
id: server-runtime-component
title: Server Runtime Component
---

A server represents an Ice server process. It can be either regular server (with typically a single Ice communicator) or an IceBox server hosting a number of IceBox services.

# States

A server is always in one of the following states (the first icon is for regular servers, the second for IceBox servers):

- Unknown ![server unknown](/attachments/3.8/server-runtime-component/server_unknown.png) ![icebox server unknown](/attachments/3.8/server-runtime-component/icebox_server_unknown.png)  
  this state is shown when the parent IceGrid node is down.
- Inactive ![server inactive](/attachments/3.8/server-runtime-component/server_inactive.png) ![icebox server inactive](/attachments/3.8/server-runtime-component/icebox_server_inactive.png)
  the server is not running.
- Activating ![server activating](/attachments/3.8/server-runtime-component/server_activating.png) ![icebox server activating](/attachments/3.8/server-runtime-component/icebox_server_activating.png)  
  the server is starting up. The IceGrid registry is waiting for the server to register all its object adapters with server lifetime.
- Active ![server active](/attachments/3.8/server-runtime-component/server_active.png) ![icebox server active](/attachments/3.8/server-runtime-component/icebox_server_active.png)  
  the server is running, and has registered all its object adapters with server lifetime with the IceGrid registry.
- Deactivating ![server deactivating](/attachments/3.8/server-runtime-component/server_deactivating.png) ![icebox server deactivating](/attachments/3.8/server-runtime-component/icebox_server_deactivating.png)  
  the server is shutting down. The IceGrid registry is waiting for the server process to exit.
- Destroyed ![server destroyed](/attachments/3.8/server-runtime-component/server-destroyed.jpeg) ![icebox destroyed](/attachments/3.8/server-runtime-component/icebox-destroyed.jpeg)  
  the server being removed of the IceGrid registry. This is a very transient state.

A server can also be either enabled or disabled; when disabled, the icons above are grayed-out. A disabled server cannot be started until it is re-enabled.

# Actions

A server provides the following actions, from its contextual menu, from the `Tools > Server` menu, and from buttons on the Server Properties panel:

- **Start**
  Instruct the IceGrid node to start the server.
- **Stop**
  Instruct the IceGrid node to shutdown the server.
- **Enable**
  Mark the server as "enabled".
- **Disable**
  Mark the server as "disabled". A [disabled server](../icegrid-troubleshooting) cannot be started; however an already running server can be marked "disabled".
- **Write Message**
  Open a dialog that allows you to write a message to the server's stdout or stderr.
- **Retrieve Ice log**
  Retrieve the log messages sent to the server's [logger](../logger-facility) into an [Ice Log Dialog](../ice-log-dialog). The Ice Log Dialog attaches a [remote logger](../the-logger-facet) to the server's logger.
- **Retrieve stdout**
  Retrieve the stdout log file of this server into a [Log File Dialog](../log-file-dialog). This retrieval succeeds only when the server's stdout output has been redirected to a file using the [Ice.StdOut](../ice-properties) property. This is usually achieved by setting the IceGrid.Node.Output property in the IceGrid node configuration file.
- **Retrieve stderr**
  Retrieve the stderr log file of this server into a [Log File Dialog](../log-file-dialog). This retrieval succeeds only when the server's stderr output has been redirected to a file using the [Ice.StdErr](../ice-properties) property. This is usually achieved by setting the IceGrid.Node.Output property in the IceGrid node configuration file.
- **Retrieve log file**
  Retrieve a log file of this server into a [Log File Dialog](../log-file-dialog).
- **Send Signal**
  Send a signal to a server, for example SIGQUIT. Available only for non-Windows servers.

# Properties

The Server Properties panel shows first the Runtime Status of the server, i.e. "live" values retrieved from the server:

- **State**
  The state of the server (Active, Deactivating, Inactive etc., see above)
- **Enabled**
  A checkbox that is checked when the server is enabled.
- **Process Id**
  The process ID of the server.
- **Build Id**
  The build Id of this server: this corresponds to the Ice property [BuildId](../icegrid-and-the-administrative-facility).
- **Properties**
  A table showing all the Ice properties currently set in this server. These properties are retrieved each time you select a new server in IceGrid GUI, and each time you click on the Refresh button next to the Build Id field.

The remaining Server Properties under Configuration come from the IceGrid descriptors associated with this server:

- **Application**
  
  ![link-to-application.png](/attachments/3.8/server-runtime-component/link-to-application.png)
  
  The name of the application containing this server's definition. The button on the right shows the server definition in an Application tab.
- **Description**
  A free-text description of this server.
- **Properties**
  A table showing all the Ice properties of this server. These properties may come from template definitions, property sets, server-instance properties etc. They are all combined in this table.
- **Path to Executable**
  The path to the server's executable, used by the IceGrid node to start the server.
- **Ice Version**
  The Ice version of this server.
- **Working Directory**
  The path to the server's working directory used by the IceGrid node when starting the server.
- **Command Arguments**
  The command-line arguments given to the server when started by IceGrid.
- **Run as**
  On Linux/Unix, a server may be started as a specific user when IceGrid node runs as root. Run as shows this username. When blank, the server runs as the IceGrid node user except if IceGrid node runs as root (on Linux/Unix); in this case, the server runs as nobody.
- **Environment Variables**
  A server started by IceGrid node gets these environment variables in addition to the environment variables inherited from the IceGrid node.
- **Activation Mode**
  The server's activation mode.
- **Activation Timeout**
  The server's activation timeout.
- **Deactivation Timeout**
  The server's deactivation timeout.
- **Allocatable**
  This checkbox Shows whether this server is allocatable or not.

# Children

A regular server node can have the following types of children:

- [Metrics View](../metrics-view-runtime-component)
- [Adapter](../adapter-runtime-component)

An IceBox server node can have the following types of children:

- [Metrics View](../metrics-view-runtime-component)
- [Service](../service-runtime-component)
