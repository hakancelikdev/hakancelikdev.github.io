---
publishDate: 2021-04-01T00:00:00Z
author: Hakan Çelik
title: "Some Sass Mixins I Use Frequently"
excerpt: "First, I want to start with my favorite Sass mixin — it makes the Sass/CSS code I write compatible with all browsers and lets me follow the principle of write once, run in all browsers."
category: CSS
image: ~/assets/images/blog/css.jpg
tags:
  - sass
  - css
---

# Some Sass Mixins I Use Frequently

### Prerequisites for Understanding This Topic

- css3
- scss structure

## Mixins Prefixed

First, I want to start with my favorite Sass mixin — it makes the Sass/CSS code I write
compatible with all browsers and lets me follow the write-once, run-everywhere principle.
For example:

```css
.flex {
  -webkit-display: flex;
  -moz-display: flex;
  -ms-display: flex;
  -o-display: flex;
  display: flex;
}

[border~="2"] {
  -webkit-border: 2px solid;
  -moz-border: 2px solid;
  -ms-border: 2px solid;
  -o-border: 2px solid;
  border: 2px solid;
}
```

As you can see in these two examples, if we want to write CSS code compatible with all
browsers, we can write the following code in Sass to achieve that:

```sass
@mixin prefixed($property, $value) {
    -webkit-#{$property}: #{$value};
    -moz-#{$property}: #{$value};
    -ms-#{$property}: #{$value};
    -o-#{$property}: #{$value};
    #{$property}: #{$value};
}
```

I actually explained how to use this in my previous article, but let me explain again
with an example — let's write the two examples above using Sass:

### Usage

```sass
.flex{
     @include prefixed(display,flex);
}

[border~="2"]{
     @include prefixed(border,2px solid);
}
```

Now let me show you some other mixins that use this mixin as an example — have a look:

```sass
@mixin text-shadow($string: 0 1px 3px rgba(0, 0, 0, 0.25)) {
    text-shadow: $string;
}
@mixin box-shadow($string) {
  @include prefixed(box-shadow, $string);
}
@mixin drop-shadow($x: 0, $y: 1px, $blur: 2px, $spread: 0, $alpha: 0.25) {
  @include prefixed(box-shadow, $x $y $blur $spread rgba(0, 0, 0, $alpha));
}
@mixin inner-shadow($x: 0, $y: 1px, $blur: 2px, $spread: 0, $alpha: 0.25) {
  @include prefixed(box-shadow, inset $x $y $blur $spread rgba(0, 0, 0, $alpha));
}
@mixin box-sizing($type: border-box) {
  @include prefixed(box-sizing, $type);
}
@mixin border($br){
  @include prefixed(border, $br);
}
@mixin opacity($opacity: 0.5) {
  @include prefixed(opacity, $opacity);
}
@mixin animation($name,$iteration-count: infinite) {
  @include prefixed(animation-name, $name);
  @include prefixed(animation-iteration-count, $iteration-count);
}
@mixin transition($transition) {
  @include prefixed(transition, $transition);
}
@mixin transform($string){
  @include prefixed(transform, $string);
}
@mixin scale($factor) {
  @include prefixed(transform, scale($factor));
}
@mixin rotate($deg) {
  @include prefixed(transform, rotate($deg));
}
@mixin skew($deg, $deg2) {
  @include prefixed(transform, skew($deg, $deg2));
}
@mixin translate($x, $y:0) {
  @include prefixed(transform, translate($x, $y));
}
@mixin translate3d($x, $y: 0, $z: 0) {
  @include prefixed(transform, translate3d($x, $y, $z));
}
@mixin perspective($value: 1000) {
  @include prefixed(perspective, $value);
}
@mixin transform-origin($x:center, $y:center) {
  @include prefixed(transform-origin, $x $y);
}
```

## Mixins Reprefixed

This prefix is needed in some situations where `prefixed` doesn't work — the opposite is
required. That's why I called it `reprefixed` — the exact opposite of the `prefixed`
mixin. Its use case is for CSS code structured like this:

For example:

```css
[width~="wmax"] {
  width: -webkit-max-content;
  width: -moz-max-content;
  width: -ms-max-content;
  width: -o-max-content;
  width: max-content;
}
```

Now, `prefixed` doesn't work for CSS max-width that needs to run in all browsers like
this, so a `reprefixed` like this will do the job:

```sass
@mixin reprefixed($property, $value) {
    #{$property}: -webkit-#{$value};
    #{$property}: -moz-#{$value};
    #{$property}: -ms-#{$value};
    #{$property}: -o-#{$value};
    #{$property}: #{$value};
}
```

### Usage:

```sass
[width~="wmax"] {
     @include reprefixed(width,max-content);
}
```

That's all there is to it.

## Mixins Gradient Operations

```sass
@mixin gradient($startColor: #eee, $endColor: white) {
    background-color: $startColor;
    background: -webkit-gradient(linear, left top, left bottom, from($startColor), to($endColor));
    @include prefixed(background,linear-gradient(top, $startColor, $endColor));
}
@mixin horizontal-gradient($startColor: #eee, $endColor: white) {
     background-color: $startColor;
    background-image: -webkit-gradient(linear, left top, right top, from($startColor), to($endColor));
    @include prefixed(background-image,linear-gradient(left, $startColor, $endColor))
}
```

## Hover Operations

By writing the following code you can set a hover effect on any element. When using the
hover feature, if you also use properties like `hover`, `active`, and `focus`, you ensure
the same behavior across all browsers. For example, while hover works directly in Chrome,
it doesn't work in Safari without focus — so it's a good idea to use all of them. Here is
an example:

```sass
@mixin hover($name, $property, $value){
  [hover~="#{$name}"]{
    &:hover,&:focus,&:active
    {#{$property}:$value;}
  }
}
```

For example, with this Sass code you can handle simple hover effects. But some hover
behaviors don't work the same across all browsers, in which case we will need code like
this:

```sass
@mixin hover-prefixed($name,$property, $value){
  [hover~="#{$name}"]{
    &:hover,&:focus,&:active{
      @include prefixed($property, $value);
    }
  }
}
```

With this code, all our hover effects will now work the same across all browsers. You'll
understand this better through a few examples.

Examples:

```sass
@include hover(txt-xl,font-size, 24px);
/*in html write it like this: <div hover="txt-xl">hover xl</div> and when the mouse hovers over it, the hover effect will be applied.*/

/* the usage of the examples below is the same — the first written parameter is the trigger */

/* color setting */
@include hover(c-muted,color,#f1f1f1);
/* for example here <div hover="c-muted"></div>

/* background color settings */
@include hover(bg-muted,background-color, $c-muted);

/* opacity */
@include hover(o-0,opacity,0);
@include hover(o,opacity,1);

/* border-radius setting */
@include hover-prefixed(br-circle,border-radius, 50%);
/* these properties require prefixed. That's why we used it this way.

/* border color property */
@include hover-prefixed(brc-white,border-color, $c-white);
```

## Finally, Let's Look at the Media Class I Use Frequently

It's not a mixin, but you can turn it into one. Since I use `display: flex` in my CSS
code, I don't need many media tags — the flex structure becomes mobile-friendly on its
own as long as you're a bit careful while writing it, so you don't need to write
separate code for mobile. But sometimes it is necessary, and for those cases I use this:

```css
.media {
  /* overflow and margin settings to prevent overflow */
  overflow-x: auto;
  width: 50%; /* width setting for screens larger than the ones below */
  margin: auto;
  @media screen and (max-width: 900px) {
    /* for tablet and pc */
    width: 80%;
  }
  @media screen and (max-width: 700px) {
    /* for tablets, mobile or pc at this screen size */
    width: 90%;
  }
  @media screen and (max-width: 500px) {
    /* for mobile and smaller */
        width: 96%;
    }
    @media screen and (max-width: 300px) { /* for smaller mobile screens and below */
    width: 98%;
  }
}
```

With this code I can write CSS that is both responsive and works in all browsers.

Thanks for reading, see you around :)
