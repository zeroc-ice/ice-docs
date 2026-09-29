---
title: Metrics Graph
---

A Metrics Graph displays metrics retrieved from one or more Ice servers or IceBox services.

![image2017-4-3 14:28:32.png](/attachments/3.8/metrics-graph/image2017-4-3-14-28-32.png)

The horizontal axis corresponds to the time, while the vertical axis plots the corresponding metrics values.

# Creating a New Metrics Graph

You can create a new Metrics Graph window with the `File > New > Metrics Graph` menu, or with a contextual menu over a
metric in a [Metrics View](../metrics-view-runtime-component), for example:

![image2017-4-3 14:31:14.png](/attachments/3.8/metrics-graph/image2017-4-3-14-31-14.png)

# Adding and Removing Metrics

A metric is added to a Metrics Graph with drag & drop, or through a contextual menu over this metric.

To remove a metric from a Metrics Graph, select this metric and press Delete or the
![delete cross](/attachments/3.8/metrics-graph/delete-cross.jpeg) button.

# Adjusting Scale and Color

You can display metrics with different scales on the same graph by adjusting the scale factor of each metric. The values
plotted are the metric's values times the scale factor; the default scale factor is 1.0.

![metrics-scale-factor.png](/attachments/3.8/metrics-graph/metrics-scale-factor.png)

You can also change the color used to display a metric's line by clicking on the Color cell of the metric.

# Metrics Graph Preferences

The `File > Preferences` menu of a Metrics Graph window opens a dialog that allows you to configure several properties
of your Metrics Graph:

![image2017-4-3 14:34:10.png](/attachments/3.8/metrics-graph/image2017-4-3-14-34-10.png)

For each metric plotted in a Metrics Graph, IceGrid GUI retrieves the corresponding value every `Sample interval`
seconds (by default every 5 seconds), and displays `n` values (`n` = 120 by default). `Sample interval` times
`Samples displayed` correspond to the time period represented on a graph; by default, it is 5s * 120 = 10 minutes.
