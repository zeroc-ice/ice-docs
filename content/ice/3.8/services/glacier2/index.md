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

Glacier2 is a lightweight firewall traversal solution for Ice applications.

{% callout type="info" %}

We present many examples of client/server applications in this documentation, most of which assume that the client and
server programs are running either on the same host, or on multiple hosts with no network restrictions. We can justify
this assumption because this is an instructional text, but a real-world network environment is usually much more
complicated: client and server hosts with access to public networks often reside behind protective router-firewalls that
not only restrict incoming connections, but also allow the protected networks to run in a private address space using
Network Address Translation (NAT). These features, which are practically mandatory in today's hostile network
environments, also disrupt the ideal world in which our examples are running.

{% /callout %}
