---
publishDate: 2021-04-15T00:00:00Z
author: Hakan Çelik
title: "Conditionals and Loops: @if, @else if, @else, @for, @while, @each"
excerpt: "Hello everyone. As you know, when I started the coogger project I also started a new CSS framework called coogger.css. While developing this framework, I use Sass, and over the past week I've been trying to add new features and improve existing ones."
category: CSS
image: ~/assets/images/blog/css.jpg
tags:
  - sass
  - css
---

# Conditionals and Loops

Hello everyone. As you know, when I started the coogger project I also started a new CSS
framework called [coogger.css](https://github.com/coogger/coogger.css). While developing
this framework I use Sass, and over the past week I've been trying to add new features and
improve existing ones. While doing this, I learned some new things in Sass that I didn't
know before. Even though they are not all the topic of this article, I will cover the
`if` / `else` structure and loops found in programming languages, which I recently learned
and found very useful. Additionally, when I looked at my old Sass articles I realized
they weren't explained very clearly or in detail — whenever I find time I will revise
those or share new, more detailed content about older topics.

Anyone who knows any programming language will quickly understand and grasp the topic of
this article.

## @if

We write the conditional execution code with the `if` keyword in Sass as shown below.
The part called **Boolean expression** works like this: the only thing that `@if`, `@else
if`, or `@else` conditions care about is whether the expression given as the condition is
true or false. If the given expression is true, the code inside the `@if`, `@else if`, or
`@else` block runs; if it is not, it doesn't run. Programming languages treat **0** and
**""** (empty string) as **false**, and everything else as **true**. This rule also
applies in Sass.

Syntax:

```sass
@if <Boolean expression> {
    <statements>
}
```

Let's write an example below:

```sass
$variable: 1; // I defined my variable
a{
   @if $variable == 1 { // if my variable equals 1
       color: blue; // color becomes blue
    }
   @if $variable != 1 { // if my variable does not equal 1
      color: red; // color becomes red
   }
}
```

We could also write this example like this:

```sass
$variable: 1; // I defined my variable
a{
   @if $variable == 1 { // if my variable equals 1
       color: blue; // color becomes blue
    }
   @else{ // if my variable does not equal 1
      color: red; // color becomes red
   }
}
```

The CSS output:

```css
a {
  color: blue;
}
```

> However many `@if` blocks your code has, Sass checks all of them and runs whichever
> condition is true. Even if you've written 10 different `@if` blocks and you know that
> exactly one of them will always run, the computer can't know that — so it checks all
> `@if` blocks. This is poorly written code and you should use the `@if`, `@else if`,
> `@else` structure instead.

Note example:

```sass
$variable: 1; // I defined my variable
a{
   @if $variable == 1 { // if my variable equals 1
       color: blue; // color becomes blue
   }
   @if $variable != 1{ // Even if the first if above is true (i.e., even if it runs), this if is also checked. You know that if the one above runs this won't — but the computer doesn't. To tell the computer, you need to use @else if.
      color: red;
   }
}
```

## @else if

The `@else if` condition is not much different from `@if`. It also takes a boolean value
and runs if the condition is true. The only difference is the situation explained in the
note example just above. If your code block has an `@if`, `@else if`, `@else if`
structure — meaning not every condition is an `@if` but some are `@else if` — then once
any condition is satisfied, the computer doesn't bother checking the other conditions.

```sass
$variable: 1; // I defined my variable
a{
   @if $variable == 1 { // if my variable equals 1
       color: blue; // color becomes blue
   }
   @else if $variable != 1{ // Since the condition above is true it runs, and the pc doesn't even look at this condition. It only looks if the if block above is false.
      color: red;
   }
   @else{ // if both @if and @else if are false (i.e., neither ran), this block runs.
    color:white;
   }
}
```

## @else

The `@else` condition runs when neither `@if` nor `@else if` ran. In other words, the
condition for `@else` is that all other conditions failed to run. That's why `@else` does
not take an additional condition (no boolean character) — it is written directly as
`@else{}`. We already have an example of this above.

## @for

The **for** loop is used for loops that run from one point to another — for example, from
1 to 100. Using `@for` instead of `@while` is more practical for such loops. The syntax
is given below.

Syntax:

```sass
@for <var> from <start> through <end> {
    <statements>
}
@for <var> from <start> to <end> { // or
    <statements>
}
```

Let's write a for loop that runs 6 times:

```sass
@for $i from 1 through 6 {
   .width-#{$i} {
      width: 0% * $i;
   }
}
```

Result:

```css
.width-1 {
  width: 1%;
}
.width-2 {
  width: 2%;
}
.width-3 {
  width: 3%;
}
.width-4 {
  width: 4%;
}
.width-5 {
  width: 5%;
}
```

## @while

The `@while` loop takes a boolean (`true` or `false`) value and keeps running as long as
that value is true.

```sass
$variable: 4;
@while $variable < 6 {
  .myclass-#{$variable} { // code block written for css
        color: red;
    }
    $variable : $variable + 1; // after the code block, I increment my variable by 1
    // otherwise the loop would want to run forever; when my variable becomes 6,
    // the condition $variable < 6 becomes false and the loop will stop.
}
```

## @each

Finally, the `@each` loop lets us iterate over list or map elements — this is just like
the `for` loop in Python.

Map data type: `$map: (key1: value1, key2: value2, key3: value3);`

Syntax:

```sass
@each <variables> in <list or map> {
   <statements>
}
```

Example:

```sass
@each $size in (10, 12, 14, 16) {
  .font-#{$size} {font-size: 0px+$size;}
}
```

Result:

```css
.font-10 {
  font-size: 10px;
}
.font-12 {
  font-size: 12px;
}
.font-14 {
  font-size: 14px;
}
.font-16 {
  font-size: 16px;
}
```

You can also pass a list inside a list:

```sass
@each $name, $style, $size, $color in ((normal, bold, 10px, red), (emphasis, bold, 15px, white)) {
   .text-#{$name} {
      font-weight: $style;
      text-size: $size;
      color:$color;
   }
}
```

Result:

```css
.text-normal {
  font-weight: bold;
  font-size: 10px;
  color: red;
}

.text-emphasis {
  font-weight: bold;
  font-size: 15px;
  color: white;
}
```

## Notes

- Inside your loops or conditionals you can write mixins you have coded, or include other
  CSS code using `@extend`.
- Inside your mixins you can include other mixins with `@include mixin_name($parameter);`,
  and you can also include other CSS code using `@extend`.
