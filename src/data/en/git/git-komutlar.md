---
publishDate: 2020-11-01T00:00:00Z
author: Hakan Çelik
title: "Git Commands"
excerpt: "We installed Git and configured our settings — now it's time to learn Git commands."
category: Git
image: ~/assets/images/blog/git.jpg
tags:
  - git
---

# Git Commands

We installed Git and configured our settings — now it's time to learn Git commands.

**Reminder**

Configure user information for all local repositories:

```bash
git config --global user.name "name"
```

Configure the email address for all local repositories:

```bash
git config --global user.email "email address"
```

This information is stored by Git along with every change you make and its timestamp.

## Init

Use the `init` command to create a new repository.

```bash
git init
```

or

```bash
git init project-name
```

## Clone

Use the `clone` command to download a project and its entire version history from a
remote Git server.

```bash
git clone remote_repo_url
```

**Example for GitHub:**

```bash
git clone https://github.com/{your_username}/{your_repo_name}.git
```

## Add

https://git-scm.com/docs/git-add

Moves the files you've changed to the staged area.

You can provide the first argument `pathspec` as a file path or glob:

```bash
git add foo/bar/file.ex
```

```bash
git add *.py
```

By writing it this way you can move all the changes you made in Python files to the
staged area. If you give `.` as the `pathspec` argument, it takes all changed files.

```bash
git add -p
```

Shows you the diff of your changes and moves a change to the staged area after your
confirmation.

## Commit

https://git-scm.com/docs/git-commit

Saves the changes in the staged area together with a message.

`git commit -m "your_commit_message"`

If you want to write over the previous commit (actually it doesn't overwrite — it creates
a new commit):

`git commit --amend`

When you use the `--amend` argument without `-m`, it takes the previous commit message as
is. If you use `-m` and enter a commit message, you theoretically edit the previous commit
message.

`git commit --amend -m "messages"`

If you're using [git-hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
(or a technology that uses git-hooks, such as [pre-commit](https://pre-commit.com/)):

The `--no-verify` argument lets you commit while skipping hooks.

## Status

For a status check, this shows you your current state — from here you can tell whether
you need to run `add` or `commit` next, and it also lists the changed files.

```bash
git status
```

## Log

Used to list and review all changes made so far.

```bash
git log
```

The output for each commit includes:

- Who made the commit
- When it was made
- The commit message
- The commit hash value

## Reset

Used to revert to an older version when something goes wrong. After `git log`, copy the
commit hash value of the version you want to go back to and use reset to go to that
version.

```bash
git reset commit_hash_value
```

Undoes all commits made after the given one, while preserving changes locally.

```bash
git reset --hard commit_hash_value
```

Discards all history and reverts to the state of the specified commit.

## Branch

Used to list branches, create new ones, and delete them.

### List Branches

```bash
git branch
```

### Create a New Branch

```bash
git branch new_branch_name
```

### Create a New Branch and Switch to It

```bash
git checkout -b new_branch_name
```

### Delete a Branch

```bash
git branch -d branch_name
```

## Checkout

Allows you to switch from one branch to another. If you're on the master branch and have
a branch called `new_branch` that you want to switch to:

```bash
git checkout new_branch
```

## Merge

If you want to merge the changes you made in **new_branch** with the master branch:

```bash
git checkout master
```

Switched to master branch.

```bash
git merge new_branch
```

Merged the changes from **new_branch** into master.

Or:

```bash
git pull origin master
```

You can use this to pull the changes from the master branch into your current branch.

## Pull

Fetches (synchronizes) changes from the repository on the remote server.

```bash
git pull
```

or

```bash
git pull origin master
```

## Push

Sends the changes you made locally (on your computer) to the repository on the remote
server.

```bash
git push
```

If your changes conflict with what's on the remote server, Git will warn you that you
need to pull before pushing. If you still want to send your changes — even if it deletes
what's on the remote server — you can use:

```bash
git push -f
```

The **-f** here stands for **force**.

## Remote

https://git-scm.com/docs/git-remote

Lets you manage other repositories connected to your Git repo.

This means you can work connected to more than one Git repository — one of them can be
the original repo and the other an upstream repo. The upstream repo is the one you forked
from. This way you can pull new updates from the original repo into your own fork and
continue developing with an up-to-date codebase.

Type `git remote -v` to see the names and addresses of the repositories connected to your
Git repo.

`git remote add {remote name} {repo address}` — for example:
`git remote add upstream https://github.com/user/repo.git`

`git remote remove {remote name}` to delete an added repository.

## Rebase

https://git-scm.com/docs/git-rebase

Allows you to move a previously made commit to the top by editing the Git history.

`git rebase` moves the most recent commit you made on your current branch to the top. When
might you use this? After a `git pull` that brings new commits into your repo, you can
use it to move your unpushed changes to the top.

## The Gitignore File

There may be some files we don't want Git to track. We tell Git about these files using
the **.gitignore** file.

There are gitignore files available for various programming languages at the address
below. Depending on which language you use in your project, you can draw inspiration from
this address to create your gitignore file and keep the files you don't want Git to track
under control.

[https://github.com/github/gitignore](https://github.com/github/gitignore)
