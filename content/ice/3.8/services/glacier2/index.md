---
title: Glacier2
pages:
  - common-firewall-traversal-issues
  - about-glacier2
  - how-glacier2-works
  - getting-started-with-glacier2
  - callbacks-through-glacier2
  - securing-a-glacier2-router
  - glacier2-session-management
  - dynamic-request-filtering-with-glacier2
  - how-glacier2-uses-request-contexts
  - configuring-glacier2-behind-an-external-firewall
  - advanced-glacier2-client-configurations
  - icegrid-and-glacier2-integration
  - glacier2-metrics
---

Glacier2 is a router that forwards client requests to servers on another network, typically behind a firewall. It also
forwards server callbacks to clients over their existing connections. A client authenticates with the router by creating
a session, and the router forwards the requests of this client for the duration of the session.
