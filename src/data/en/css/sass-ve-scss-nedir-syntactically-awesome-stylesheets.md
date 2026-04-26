---
publishDate: 2021-05-27T00:00:00Z
author: Hakan Çelik
title: "What Is Sass and Scss?"
excerpt: "Syntactically awesome stylesheets"
category: CSS
series: "Sass/SCSS Series"
seriesIndex: 5
image: ~/assets/images/blog/css.jpg
tags:
  - sass
  - css
---

Syntactically awesome stylesheets

# What Is Sass and Scss?

Sass/Scss is a template programming language that allows us to write faster, more
understandable, and more functional CSS. The project's website is
[http://sass-lang.com](http://sass-lang.com), where you can find all the information you
need.

Sass is a CSS extension that adds power and elegance to the base language. Sass provides
variables, nested rules, mixins (functions), import, and more — all with a syntax fully
compatible with CSS. Sass helps organize large style work and makes it quick to work with
small styles, especially with the Compass style library.

### Features

- Fully CSS compatible.
- Language extensions such as variables and mixins (can be called functions)
- Many useful functions for manipulating other values and colors
- Advanced features such as control directives for libraries
- Well-formatted and customizable output

## Syntax

There are two syntaxes: scss and sass. The first is what you know as scss (Sassy CSS),
a syntax that closely resembles CSS syntax and uses the `.scss` file extension. The
second is the older syntax known as sass, with the `.sass` file extension.

## Convert

A great feature is the convert operation. Whether you write in Sass or Scss syntax, the
convert operation allows these two syntaxes to be converted into each other, as follows:

### Convert Sass to SCSS

The convert operation transforms Sass into Scss: `$sass-convert style.sass style.scss`

### Convert SCSS to Sass

The convert operation transforms Scss into Sass: `$sass-convert style.scss style.sass`
I'll cover installation and further explanation in the next article, see you around.

### Convert SCSS to Css

The convert operation transforms Scss into CSS: `$sass-convert style.scss style.css`
I'll cover installation and further explanation in the next article, see you around.

### Convert Sass to CSS

The convert operation transforms Sass into CSS: `$sass-convert style.sass style.css`
