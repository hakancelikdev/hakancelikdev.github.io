---
publishDate: 2022-05-15T00:00:00Z
author: Hakan Çelik
title: "Blocking a Clickjacking Attack"
excerpt: "To configure Apache to send the X-Frame-Options header to all pages, add the following to your site's configuration:"
category: Security
image: ~/assets/images/blog/guvenlik.jpg
tags:
  - security
  - web
---

# Blocking a Clickjacking Attack

## Apache Configuration

To configure Apache to send the X-Frame-Options header to all pages, add the following
to your site's configuration:

- `Header always set X-Frame-Options "sameorigin"`
- `Header set X-Frame-Options "deny"`
- `Header set X-Frame-Options "allow-from https://example.com/"`

## Nginx Configuration

To configure Nginx to send the X-Frame-Options header, add the following to your http,
server, or location configuration:

`add_header X-Frame-Options sameorigin`

## IIS Configuration

To configure IIS to send the X-Frame-Options header, add the following to your site's
Web.config file:

```markup
<system.webServer>
  ...

  <httpProtocol>
    <customHeaders>
      <add name="X-Frame-Options" value="sameorigin" />
    </customHeaders>
  </httpProtocol>

  ...
</system.webServer>
```

## HAProxy Configuration

To configure HAProxy to send the X-Frame-Options header, add the following to your
front-end, listen, or back-end configuration:

- `rspadd X-Frame-Options:\ sameorigin`

Alternatively, in newer versions:

- `http-response set-header X-Frame-Options sameorigin`

For a related post on how to apply this protection using the Django framework, check out
[Django Clickjacking Protection and Control - XFrameOptionsMiddleware](../../django/djangoda-clickjack-tuzagnn-engeli-ve-kontrolu-xframeoptionsmiddleware.md).
