---
id: getting-started-with-icegrid-gui
title: Getting Started with IceGrid GUI
---

This page describes how to launch the IceGrid GUI tool.

# System Requirements

IceGrid GUI is a Java application supported on a wide range of platforms, including Windows, Linux and macOS.

The minimum requirements for running IceGrid GUI are listed below:

- `icegridgui.jar`, usually installed in the `bin` or `lib` directory of your Ice installation
- Java SE Runtime Environment 17 or later

In order to use IceGrid GUI's [metrics graphs](../metrics-graph) feature, you will need the JavaFX Runtime Environment,
bundled with recent updates of the Oracle Java SE Runtime Environment on Windows, Linux and macOS.

You can download Oracle Java SE for most platforms from Oracle.

If you want to read IceGrid XML files from IceGrid GUI, you also need to have the
[icegridadmin](../icegridadmin-command-line-tool) command-line utility in your `PATH`.

# Starting IceGrid GUI

On Windows IceGrid GUI can be started by clicking the IceGrid GUI icon in the Start menu. On macOS IceGrid GUI can be
started by clicking the IceGrid GUI icon in Finder Applications folder:

On Linux, you can use the `icegridgui` script installed in `/usr/bin`:

```shell
icegridgui
```

On all platforms, you can also start IceGrid GUI from a terminal by typing:

```shell
java -jar path-to-icegridgui.jar
```

# Command Line Arguments

IceGrid GUI can be configured using Ice properties, and like with most Ice applications, these properties can be set
using command-line arguments or a configuration file (or both).

Since IceGrid GUI is an Ice application (a client to the IceGrid registry), setting regular Ice properties can be useful
as well. For example, you can set the `Ice.Trace.Network` property to get detailed information about network
communications sent to `stderr`.

```shell
icegridgui --Ice.Trace.Network=2
```

There are also a number of properties specific to IceGrid GUI itself, described in
[IceGridAdmin.*](../icegridadmin-properties).

If you need to set many properties, it is a good idea to write a configuration file and use the `--Ice.Config`
command-line argument to specify the location of this file. For example:

```shell
java -jar "C:\Program Files\ZeroC\Ice-3.8.0\bin\icegridgui.jar" --Ice.Config=icegridgui.cfg
```

# Main IceGrid GUI Window

The main IceGrid GUI window allows to navigate between your live deployment and the definitions of several applications.

## Tabs

The main IceGrid GUI window shows one or more tabs:

![image2017-4-3 11:52:48.png](/attachments/3.8/getting-started-with-icegrid-gui/image2017-4-3-11-52-48.png)

- The Live Deployment tab ![live deployment](/attachments/3.8/getting-started-with-icegrid-gui/live-deployment.jpeg)
  displays information about an IceGrid deployment you have logged into. There is always one and only one Live
  Deployment tab. When you are not connected to an IceGrid deployment, the corresponding pane is empty.
- A Live Application tab ![live application](/attachments/3.8/getting-started-with-icegrid-gui/live-application.jpeg)
  displays application definitions retrieved from the IceGrid registry you are connected to. As long as you do not
  change anything in the associated pane, IceGrid GUI will keep the information up-to-date. For example if another
  administrator adds a new server definition in this application definition, it will appear automatically and
  immediately in this pane.
- A File-Based Application tab
  ![file based application](/attachments/3.8/getting-started-with-icegrid-gui/file-based-application.jpeg) displays
  application definitions retrieved from an IceGrid XML file.
- An icon-less tab displays the definitions of an application that is not bound to an IceGrid registry or to a file,
  such as a brand new application. A live application with unsaved modifications also becomes icon-less if the
  connection to its IceGrid registry is lost.

IceGrid GUI may show any number of application tabs, including none at all.

## Status Bar

The status bar at the bottom of the main window shows information about operations performed by IceGrid GUI, or messages
received from the IceGrid registry.

![image2017-4-3 13:42:19.png](/attachments/3.8/getting-started-with-icegrid-gui/image2017-4-3-13-42-19.png)

##### See Also

- [IceGridAdmin.*](../icegridadmin-properties)
- [icegridadmin Command Line Tool](../icegridadmin-command-line-tool)
