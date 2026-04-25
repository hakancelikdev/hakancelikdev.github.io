---
publishDate: 2021-08-01T00:00:00Z
author: Hakan Çelik
title: "insertAdjacentHTML"
excerpt: "The insertAdjacentHTML() method of the Element interface parses the specified text as HTML or XML and inserts the resulting nodes into the DOM tree at a specified position. It does not re-parse the elem"
category: JavaScript
image: ~/assets/images/blog/javascript.jpg
tags:
  - javascript
---

# insertAdjacentHTML

The `insertAdjacentHTML()` method of the `Element` interface parses the specified text
as HTML or XML and inserts the resulting nodes into the DOM tree at a specified position.
It does not re-parse the element it is being invoked on, and therefore does not corrupt
the existing elements inside it. This avoids the extra serialization step, making it
much faster than direct `innerHTML` manipulation.

## Syntax

```js
element.insertAdjacentHTML(position, text);
```

## Parameters

- position: A `DOMString` representing the position relative to the `Element`; the
  options are listed below.
  - `beforebegin`: Before the `Element` itself.
  - `afterbegin`: Just inside the `Element`, before its first child.
  - `beforeend`: Just inside the `Element`, after its last child.
  - `afterend`: After the `Element` itself.
- text: The string to be parsed as HTML or XML and inserted into the tree.

## Visualizing the Position Names

```html
<!-- beforebegin -->
<p>
  <!-- afterbegin -->
  foo
  <!-- beforeend -->
</p>
<!-- afterend -->
```

## Example

```js
// <div id="one">one</div>
var d1 = document.getElementById("one");
d1.insertAdjacentHTML("afterend", '<div id="two">two</div>');

// At this point, the new structure is:
// <div id="one">one</div><div id="two">two</div>
```

### Source

https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
