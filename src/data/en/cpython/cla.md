---
publishDate: 2022-07-01T00:00:00Z
author: Hakan Çelik
title: "CLA"
excerpt: "Before contributing to CPython, you need to sign the PSF Contributor Agreement. In this short post, I explain what the CLA is, how to sign it, and how the approval process works, step by step."
category: CPython
image: /images/posts/capture.png
tags:
  - python
  - cpython
  - open-source
---

# CLA

A CLA (Contributor License Agreement) is a document confirming that you agree your
contributions to CPython are legally owned by the Python Software Foundation (PSF).

## Why is it Required?

When contributing to open source projects, copyright becomes a concern. The PSF CLA
provides the legal basis needed for your contributions to be distributed under the
Python license (PSF License). Pull requests submitted without signing it will not be
accepted.

## How to Sign

To read and sign the agreement, go to the following address:

**[PSF Contributor Agreement](https://www.python.org/psf/contrib/contrib-form/)**

The form is entirely online — no separate document needs to be signed.

## Approval Process

After signing, the approval process takes place on **business days** and may take some
time. When you open your first PR to CPython, the
[the-knights-who-say-ni](https://github.com/the-knights-who-say-ni) bot will greet you
and leave a comment about your CLA status.

Your PR labels will change as follows:

- Before the CLA is signed: **CLA not signed**
- After the CLA is approved: **CLA signed**

![](/images/posts/capture-1.png)

## Recommendation

You do not need to wait for CLA approval before opening a PR. Sign the agreement as
soon as possible and continue your contribution work in parallel — the bot will
automatically update the label.

> **Tip:** If you run into any issues, you can ask for help through the issues in the
> [python/cpython](https://github.com/python/cpython) repository or on Python's Discord
> server.
