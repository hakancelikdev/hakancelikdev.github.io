---
publishDate: 2022-05-01T00:00:00Z
author: Hakan Çelik
title: "How to Prevent a Clickjacking Attack"
excerpt: "While researching this vulnerability, I found that it can also be blocked with a few lines of JavaScript code — though that approach is not considered reliable."
category: Security
image: ~/assets/images/blog/guvenlik.jpg
tags:
  - security
  - web
---

# How to Prevent a Clickjacking Attack

While researching this vulnerability, I found that it can also be blocked with a few
lines of JavaScript code — though that approach is not considered reliable.

## What is X-Frame-Options?

**X-Frame-Options** is an HTTP response header that can be used to indicate whether a
browser should be allowed to render a page inside a `<frame>`, `<iframe>`, `<embed>`,
or `<object>` element. Sites use this to prevent clickjacking attacks by ensuring their
content cannot be embedded in other sites. In short, the way to block this trap goes
through **X-Frame-Options** — but how exactly?

There are 3 possible values for **X-Frame-Options**:

```markup
X-Frame-Options: deny
X-Frame-Options: sameorigin
X-Frame-Options: allow-from https://example.com/
```

- **deny** blocks all domains from embedding the page
- **sameorigin** only allows embedding when the page is in a frame on the same origin as
  the page itself. For this reason, it is not particularly recommended — you may
  unintentionally allow multiple sites.
- **allow-from** [https://example.com/](https://example.com/) only allows the example.com
  site.

> Note: Adding `<meta http-equiv="X-Frame-Options" content="deny">` between the
> `<head> </head>` tags in your HTML file will NOT block clickjacking.

For an example of this, you can see a developer's frustration on Stack Overflow:
[x-frame-options-is-not-working-in-meta-tag](https://stackoverflow.com/questions/45454390/x-frame-options-is-not-working-in-meta-tag)
