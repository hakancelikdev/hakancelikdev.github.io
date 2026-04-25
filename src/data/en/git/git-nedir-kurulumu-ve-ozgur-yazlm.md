---
publishDate: 2020-11-15T00:00:00Z
author: Hakan Çelik
title: "What Is Git, Installation and Free Software"
excerpt: "Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency."
category: Git
image: ~/assets/images/blog/git.jpg
tags:
  - git
---

# What Is Git, Installation and Free Software

## What Is Git?

Git is a free and open source distributed version control system designed to handle
everything from small to very large projects with speed and efficiency.

Git was written by [Linus Torvalds](https://www.google.com/search?q=linus+torvalds), the
author of the Linux kernel.

Here are a few links to get to know Linus Torvalds better:

- [GitHub Account](https://github.com/torvalds)
- [TED Talk | The mind behind Linux - Linus Torvalds](https://www.youtube.com/watch?v=o8NPllzkFhE)
- [Tech Talk: Linus Torvalds on git](https://www.youtube.com/watch?v=4XpnKHJAok8&t=2001s)

## What Is a Version Control System?

A version control system, or VCS, tracks the history of changes as people and teams
collaborate on projects together. As the project evolves, teams can run tests, fix bugs,
and contribute new code, with the confidence that any version can be recovered at any
time. Developers can review project history to find out:

- Which changes were made?
- Who made the changes?
- When were the changes made?
- Why were the changes needed?

## What Is a Distributed Version Control System?

In this abbreviation — **DVCS** — the key point is this: Git does not allow the files
related to a project to be stored in a single centralized place. People working with Git
keep the entire history without needing any connection, and they can synchronize it with
the help of a remote server. Because it is not centralized, this is called distributed.

## Why Git?

Git is not the only version control system — there are other version control systems
similar to Git, some centralized and some distributed.

According to [Stack Overflow](https://insights.stackoverflow.com/survey/2018#work-_-version-control)
data, 87.2% of developers use Git, making it the most widely used VCS.

## Why Do We Need It?

- Imagine you've just started at a company and you've been assigned to a project with 5
  people working on it. Not all the employees are even in the same city, yet you need to
  develop the same project without things getting mixed up — that's where Git comes in.
- You're working on a project by yourself and you're sure it's done. A few days later you
  notice a bug or something missing. So you take a backup somewhere to not lose the old
  project files and continue with the other one. This keeps going, and by the end of the
  day your working directory might look like this:

  - This is the final one
  - This time it's definitely done
  - All bugs fixed, process complete
  - I'm sure it's finished

  You could end up with a bunch of project backups with names like these — that's where
  Git comes in as well.

## Who Can Use It?

Even though Git is a technology well known and constantly used in the software industry,
it can be used by anyone who uses a computer — while taking notes, storing pictures,
saving data, drawing, and so on.

If you want to see the changes you've made, save, manage, and go back in time whenever
you want — you should use Git.

## The Importance of Open Source

### Who Is Richard Stallman?

Richard Matthew Stallman (widely known by the initialism **rms**; born March 16, 1953)
is an American free software activist, system expert, and software developer. He is the
founder of the [GNU Project](https://www.gnu.org/home.en.html) and the Free Software
Foundation.

- [TED | Free software, free society: Richard Stallman at TEDxGeneva 2014](https://www.youtube.com/watch?v=Ag1AKIl_2GM)

### Free Software

[What Is Free Software?](https://www.gnu.org/philosophy/free-sw.html)

I want to say a few things from my own perspective. There are some names that are
generally believed to have brought technology to great places and whom society admires.
These people have benefited from free software and from society, yet they have achieved
beautiful, sleek designs and founded companies without giving anything back to society.
Furthermore, they use these designs and companies to impress society, making people
respect them and aspire to be like them. Yet the real respect and admiration should go to
free software advocates — because they are the ones responsible for technology advancing
this fast and enabling people to learn things so quickly.

To give an example: if I asked you for a stone and a stick, and you gave them to me, and
I used them to make a wheel and then sold it — but never told anyone how I made it — and
sold beautifully designed, sleek, and useful tires, would technology in that society
advance? "Unity is strength" is not a phrase said in vain.

If you make your projects open source or free, other people can look at what you've done
and find inspiration, learn new things, contribute and help you grow, gain experience,
have references to put on your resume, and prove the technologies you claim to know. This
also makes your hiring process faster. That's why you should do it.

## Installation

### Installing on Mac OS X

There are several ways to install Git on Mac. In fact, if you installed **XCode** (or
Command Line Tools), Git may already be installed. To find out, open a terminal and type
`git --version`.

```bash
$ git --version
git version 2.7.0 (Apple Git-66)
```

If it's not installed:

- Download [Git for Mac from the latest release](https://sourceforge.net/projects/git-osx-installer/files/)
- Follow the instructions to complete the installation.
- Open Terminal and confirm that it was installed successfully with `git --version`.

```bash
$ git --version
git version 2.9.2
```

Then configure your settings using the example below as a reference:

```bash
$ git config --global user.name "Hakan Çelik"
$ git config --global user.email "hakancelik96@outlook.com"
```

### Installing on Windows

Download from [https://gitforwindows.org/](https://gitforwindows.org/). Complete the
installation with all settings at their recommended defaults. Search for git and open
**Git Bash**, then write the configuration:

```bash
$ git config --global user.name "Hakan Çelik"
$ git config --global user.email "hakancelik96@outlook.com"
```

### Installing on Linux

#### Debian / Ubuntu (apt-get)

Git packages are defined by apt. You can install it using `apt-get` from your shell:

```bash
$ sudo apt-get update
$ sudo apt-get install git
```

Verify the installation by typing `git --version` in your console:

```bash
$ git --version
git version 2.9.2
```

Then configure your settings:

```bash
$ git config --global user.name "Hakan Çelik"
$ git config --global user.email "hakancelik96@outlook.com"
```

#### Fedora (dnf/yum)

Git packages are defined in **yum** and **dnf**. You can install git using `dnf` from
your shell (or `yum` for older versions of Fedora):

```bash
sudo dnf install git
```

or

```bash
sudo yum install git
```

Let's verify the installation:

```bash
$ git --version
git version 2.9.2
```

Configure your settings:

```bash
$ git config --global user.name "Hakan Çelik"
$ git config --global user.email "hakancelik96@outlook.com"
```

## Additional Resources

- [https://www.atlassian.com/git/tutorials](https://www.atlassian.com/git/tutorials)
- [https://try.github.io/](https://try.github.io/)
- [https://www.youtube.com/watch?v=rWG70T7fePg&list=PLPrHLaayVkhnNstGIzQcxxnj6VYvsHBH](https://www.youtube.com/watch?v=rWG70T7fePg&list=PLPrHLaayVkhnNstGIzQcxxnj6VYvsHBH)
