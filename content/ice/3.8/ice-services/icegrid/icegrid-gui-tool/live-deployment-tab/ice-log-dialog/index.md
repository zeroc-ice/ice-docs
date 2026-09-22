---
id: ice-log-dialog
title: Ice Log Dialog
---

The Ice Log dialog shows the Ice log messages of a server, service, node or registry retrieved through IceGrid. The
monitored Ice application sends these log messages to a [remote logger](../the-logger-facet) implemented by the Ice Log
dialog.

![image2017-4-3 14:21:22.png](/attachments/3.8/ice-log-dialog/image2017-4-3-14-21-22.png)

# States

An Ice log dialog is always in one of the following states:

- **Running** The dialog is attached to the monitored application's logger: it displays new log messages as soon as it
  receives them.
- **Paused** The dialog is attached to the monitored application's logger: it queues new log messages, but does not
  display them.

- **Stopped** The dialog is no longer attached to the monitored application's logger.

When an Ice log dialog is running or paused, and the target server, node or registry is stopped, the Ice log dialog
automatically transitions to the Stopped state. However, when an Ice log dialog is attached to an IceBox service, the
Ice log dialog's state does not change when only the service is stopped, because stopping a service does not shutdown or
destroy the associated communicator.

# Preferences

Use the `Edit > Preferences...` menu to open the Preferences dialog. These preferences apply to the current dialog and
to any Ice Log dialog opened later on.

![image2017-4-3 14:21:53.png](/attachments/3.8/ice-log-dialog/image2017-4-3-14-21-53.png)

This dialog allows you to view and update the following settings:

- **Max log messages in buffer** The maximum number of lines displayed in the Ice log dialog.
- **Number of log messages retrieved initially** When a new dialog is opened, or when restarting a stopped dialog, the
  dialog retrieves and displays up to this number of lines.

# Filter

Use the `Edit > Filter...` menu to open the Filter dialog. This filter applies only to the current Ice Log dialog.

![image2017-4-3 14:22:25.png](/attachments/3.8/ice-log-dialog/image2017-4-3-14-22-25.png)

This dialog allows you to filter the log messages sent by the monitored Ice applications. All the filtering is done in
this remote Ice application.

- **Error, Warning, Print and Trace Check Boxes** Check the type of log messages you want to receive.
- **Trace Categories** Enter the list of trace categories you want to receive, or leave empty to receive trace messages
  with any trace category.
