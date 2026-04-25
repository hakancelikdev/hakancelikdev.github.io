---
publishDate: 2022-05-29T00:00:00Z
author: Hakan Çelik
title: "What is a Clickjacking Attack?"
excerpt: "This type of attack occurs when a malicious site tricks a user into clicking on a hidden element of another site that has been loaded into a hidden frame or iframe."
category: Security
image: ~/assets/images/blog/guvenlik.jpg
tags:
  - security
  - web
---

# What is a Clickjacking Attack?

This type of attack occurs when a malicious site tricks a user into clicking on a hidden
element of another site that has been loaded into a hidden **iframe** or frame.

## An Example of a Clickjacking Attack

Imagine an online store (for example, a food delivery site) has a page where a logged-in
user can click a **Buy Now** button to purchase an item. A user prefers to stay logged
into the store at all times for convenience. An attacker's site could create a button on
one of their own pages that says something like **You won a car, click here!** or
something seemingly meaningless, and embed the store's page inside a transparent iframe
positioned so that the **Buy Now** button is hidden directly beneath the **You won a
car, click here!** button. If a user visits the attacker's site and clicks something
like **You won a car**, they end up accidentally clicking the **Buy Now** button,
triggering an unintended purchase without their knowledge.
