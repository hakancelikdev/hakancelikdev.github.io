---
publishDate: 2021-05-13T00:00:00Z
author: Hakan Çelik
title: "Sass Watch, Variables, Nesting, Import, Mixin, Include and Operators"
excerpt: "Hello everyone. In my Sass series, I'll be continuing with the Scss structure instead of Sass, as I think it is more similar to CSS and easier to learn quickly."
category: CSS
image: ~/assets/images/blog/css.jpg
tags:
  - sass
  - css
---

# Sass Watch, Variables, Nesting, Import, Mixin, Include and Operators

Hello everyone. In my [sass](https://www.coogger.com/sass/@hakancelik/) series, I'll be
continuing with the **Scss** structure instead of **Sass**, as I think it resembles the
**CSS** structure more and will be faster to learn. Maybe in the future, if I find the
time, I'll add the **Sass** syntax to these articles as well — everything else is the
same except the syntax.

## Sass Watch

If you want the code you write in Sass to be converted to CSS as you write it, and see
the result in your web project while running locally, you can do this with watch:

```sass
sass --watch input.scss output.css
```

Here, whenever you press Ctrl+S, the code in the `input.scss` file you have open gets
converted to CSS code immediately and saved to the `output.css` file. You can also use
watch with a folder path — for example, say you have two folders, one called `sass` and
one called `styles`. Your CSS code (files) will live in the `styles` folder. For this:

```sass
sass --watch sass:styles
```

With this watch command, whenever you create a file in your `sass` folder with a `.sass`
extension and write Sass code in it, files with the same name but a `.css` extension will
start appearing in your `styles` folder.

Every time you press Ctrl+S, changes are saved.

### Sass Variables

Variables are a way to store information that you want to reuse throughout your
stylesheet. You can store any CSS value you think you'll want to reuse. Sass uses the `$`
symbol to assign something as a variable. Using variables helps us minimize repetitive
code, which is why using variables is important.

```css
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

We have two variables here:

**\$font-stack** and **\$primary-color**. When we want to use the variables we defined,
we write them again with the `$` prefix — so `$primary-color` like this.

While these look this way in Sass, in CSS the variables are replaced with their actual
values, so the CSS output will look like this:

```css
body {
  font: 100% Helvetica, sans-serif;
  color: #333;
}
```

## Nesting

Our HTML code can have a specific hierarchy — something like
`footer > div > ul > li > a > span`. With Sass we can write code following this same
hierarchy:

```css
footer {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    li {
      display: inline-block;
    }
  }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
  span {
    display: flex;
  }
}
```

The CSS output will be:

```css
footer ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

footer ul li {
  display: inline-block;
}

footer a {
  display: block;
  padding: 6px 12px;
  text-decoration: none;
}

footer span {
  display: flex;
}
```

## The Import Function

You can write your Sass code in a modular way — for example, your `header.scss` code in
a separate file, your `body.scss` code in another file, and your `hover.scss` code in yet
another. You can include these files in your projects with the `@import` prefix, just like
in Python. With Sass, you can build a framework once and then include what you've done in
your project as needed, or you can import open-source Sass projects from GitHub into your
own project.

For example:

```sass
// _reset.scss

html,
body,
ul,
ol {
  margin:  0;
  padding: 0;
}

this is our _reset.scss file

// base.scss

@import 'reset';

// or

@import '_reset.scss'; // we could also import it this way

body {
  font: 100% Helvetica, sans-serif;
  background-color: #efefef;
}
```

With the `@import` prefix we included the `reset.scss` file located in the same directory
into our project.

When the watch command converts this to a CSS file, on the line where `@import reset;` is
written, the code from the reset file appears, followed by the code on the lines below it.
In other words, exactly like this:

```css
html,
body,
ul,
ol {
  margin: 0;
  padding: 0;
}

body {
  font: 100% Helvetica, sans-serif;
  background-color: #efefef;
}
```

## Mixins

One of the beauties of functions is that you write a function once and it does the rest of
the work for you :D. In other words, there is something that keeps repeating itself —
even if small things change in those repetitions, the general structure is always the
same. Instead of repeating that, you create a function with parameters for those changing
parts, and that's it. Let me give an example: say you're writing a `border-radius` code
in CSS and you want it to work in both Firefox and Safari. You'd need to write code like
this:

```css
.border {
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -ms-border-radius: 3px;
  border-radius: 3px;
}
```

Looking at this, **-webkit-border-radius:**, **-moz-border-radius:**,
**-ms-border-radius:**, **border-radius:** — these parts don't change. What changes are
the values they receive. If I'm going to use multiple border radii with different values,
instead of repeating them over and over, I can do something like this:

```sass
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
     -moz-border-radius: $radius;
      -ms-border-radius: $radius;
          border-radius: $radius;
}

.box { @include border-radius(10px); }
```

Here, using the `@mixin` prefix, I've defined my mixin named `border-radius` which takes
a `$radius` variable — remember, variables are defined with the `$` prefix. Then, to use
the function I wrote, I use the `@include` prefix followed by the function name and its
parameter inside parentheses.

So you'd use it like this:

```css
.box {
  @include border-radius(1px);
}

.box {
  @include border-radius(2px);
}

.box {
  @include border-radius(3px);
}

.box {
  @include border-radius(10px);
}
```

Let's take it even further. There are actually 3 things that stay constant here — the
`-webkit-`, `-moz-`, and `-ms-` prefixes. If I want all the code I write to be compatible
with every browser and avoid repetition, I should write it like this:

```sass
@mixin prefixed($property, $value) {
    -webkit-#{$property}: #{$value};
    -moz-#{$property}: #{$value};
    -ms-#{$property}: #{$value};
    -o-#{$property}: #{$value};
    #{$property}: #{$value};
}
```

Now I can use it like this:

```sass
@include prefixed(border-radius, 4px)

@include prefixed(border, 4px)

@include prefixed(border, 4px)

@include prefixed(border-color, red);
```

Look — with one mixin we wrote code compatible with every browser. Very simple. By the
way, to access the CSS property name stored in the `$property` variable, you have to use
`#{$property}` — you can't access it directly with `$property` since we assigned CSS
property names to the variable.

As output they produce normal CSS code, for example:

```css
.box {
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  -ms-border-radius: 10px;
  border-radius: 10px;
}
```

## Operators

We can perform operations like this, for example:

```css
width: 300px / 960px * 100%;
width: 600px / 960px * 100%;
```

The operators we use are:

`/,*,-,+,%`

That's all for Sass lessons, everyone. I'll add more if I learn new things. Best of luck
to everyone, easy does it — see you around.
