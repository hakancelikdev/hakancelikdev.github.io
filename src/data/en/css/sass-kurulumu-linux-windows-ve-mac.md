---
publishDate: 2021-04-29T00:00:00Z
author: Hakan Çelik
title: "Sass Installation?"
excerpt: "For more detailed installation info: http://sass-lang.com/install"
category: CSS
series: "Sass/SCSS Series"
seriesIndex: 3
image: ~/assets/images/blog/css.jpg
tags:
  - sass
  - css
---

# Sass Installation?

For more detailed information about installation:
[http://sass-lang.com/install](http://sass-lang.com/install)

## For Linux

If you are using a Linux distribution, you first need to install Ruby. You can install
Ruby using the apt package manager. Depending on your Linux distribution, you can find
appropriate instructions here:
[https://www.ruby-lang.org/en/documentation/installation/#package-management-systems](https://www.ruby-lang.org/en/documentation/installation/#package-management-systems)

For example, for Ubuntu:

```bash
sudo apt-get install ruby-full
```

Now let's install Sass:

```bash
sudo gem install sass --no-user-install
```

You should see output like this:

```markup
Fetching: sass-3.5.5.gem (100%)
Successfully installed sass-3.5.5
Parsing documentation for sass-3.5.5
Installing ri documentation for sass-3.5.5
Done installing documentation for sass after 3 seconds
1 gem installed
```

## For Windows

Again, we first need to install Ruby. For this, we can download the exe file and install
it by clicking next, next, next. Download from: [https://rubyinstaller.org/](https://rubyinstaller.org/)

## For Mac

Ruby is already pre-installed on Mac, so you don't need to install anything extra.

On both Windows and Mac, after Ruby is installed, open the console and type the following
to install Sass:

```bash
gem install sass
```

If permission is denied, run it with administrator privileges using the `sudo` prefix:

```bash
sudo gem install sass
```

To verify the installation, type:

```bash
sass -v
```

You will get the currently installed version as the response, for example: Sass 3.5.4.

See you in the next lesson..
