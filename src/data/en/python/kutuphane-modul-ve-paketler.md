---
publishDate: 2021-08-10T00:00:00Z
author: Hakan Çelik
title: "Libraries, Modules, and Packages"
excerpt: "pip is a package manager for Python."
category: Python
image: ~/assets/images/blog/python.jpg
tags:
  - python
---

# Libraries, Modules, and Packages

## What Is pip?

pip is a package manager for Python.

### Installing pip on Linux

```bash
$ sudo apt-get install python3.8-pip
```

### Installing pip on Windows

Create a Python file named **get_pip.py** on your Desktop.

> Note: If your file extensions are not visible, type "folder" in the Windows search bar,
> then in the window that appears uncheck the option `Hide extensions for known file types`
> (it's usually the second item in the list) and save.

Then click this link
[https://bootstrap.pypa.io/get-pip.py](https://bootstrap.pypa.io/get-pip.py), copy the
code that appears into the get_pip.py file you created, save and close it, and open a
shell command line (or cmd) by doing **shift + (right-click)** on the Desktop.

Typing `python get_pip.py` will complete the pip installation.
