---
title: AI Tools
---

AI coding agents and chat assistants can read these docs as Markdown from this site, or search them through Context7.

## Markdown Pages

Every page is available as Markdown at its URL with `.md` appended, such as
`https://docs.zeroc.com/ice/3.8/slice/operations.md`.

When a page's text differs by language mapping, its Markdown labels each part with the mappings it applies to and links
to one Markdown file per mapping, at `<page>/<language>.md`, such as
`https://docs.zeroc.com/ice/3.8/slice/operations/cpp.md`. The language is one of `cpp`, `csharp`, `java`, `js`,
`matlab`, `php`, `python`, `ruby`, or `swift`.

## llms.txt

`https://docs.zeroc.com/llms.txt` is an index of every page, by chapter, with a link to each page's Markdown.

## Context7

[Context7](https://context7.com) indexes these docs as `/zeroc-ice/ice-docs`. To use it, add the Context7 MCP server to
your agent, as [Context7's client setup](https://context7.com/docs/resources/all-clients) describes.

{% callout type="note" %}

Ice and IceRPC are separate frameworks. The IceRPC docs are at [docs.icerpc.dev](https://docs.icerpc.dev), and in
Context7 as `/icerpc/icerpc-docs`.

{% /callout %}
