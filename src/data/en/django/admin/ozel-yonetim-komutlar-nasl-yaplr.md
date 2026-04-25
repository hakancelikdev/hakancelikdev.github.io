---
publishDate: 2022-08-02T00:00:00Z
author: Hakan Çelik
title: "How to Create Custom Management Commands"
excerpt: "Everyone uses this part of Django. Even those who have never used Django and are just starting to learn it use this area first — they open a console from the project directory and immediately start a new project to begin coding."
category: Django
subcategory: Admin
image: ~/assets/images/blog/django.jpg
tags:
  - django
  - python
---

# How to Create Custom Management Commands

## Introduction

Everyone uses this part of Django. Even those who have never used Django and are just
starting to learn it use this area first — they open a console from the project directory
and create a new project to begin coding with
`django-admin startproject mysite`, then create their first app using
`python manage.py startapp polls`, tweak it a bit, and run it with `python manage.py runserver`.

In this article, we'll cover something I've recently learned myself: how to create
custom management commands. We'll build and use commands that are needed for our own
application.

Below is a classic Django project hierarchy:

```bash
mysite/
 |-- myapp/
 | |-- management/ <-- we create a folder called management
 | | +-- commands/ <-- we create a folder called commands
 | | +-- my_custom_command.py <-- your custom command module that will run
 | |-- migrations/
 | | +-- __init__.py
 | |-- __init__.py
 | |-- admin.py
 | |-- apps.py
 | |-- models.py
 | |-- tests.py
 | +-- views.py
 |-- mysite/
 | |-- __init__.py
 | |-- settings.py
 | |-- urls.py
 | |-- wsgi.py
 +-- manage.py
```

The module named **my_custom_command** above is where our custom command will run inside
our Django app directory. Notice that it's inside the `myapp` application directory we
created — Django scans the application directories listed in the apps section of
`settings.py` with every command and, if present, runs their commands too. This means
your custom commands must be inside your Django application directories.

You can run the custom command named `my_custom_command` like this:
`python manage.py my_custom_command` — no additional configuration is needed.

## Example

In this section, we'll build a small example to understand the concept. I'll create a
custom command called **get_user** that, when run, will display only 10 users on the
screen — not all of them.

Usage will be `python manage.py get_user` as you'd expect.

**/management/commands/get_user.py**

```python
# django
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

# We'll create our custom command by inheriting from BaseCommand.
# User is Django's built-in default user model, as you already know.

class Command(BaseCommand): # the class name must be Command
    help = "Use and get 10 users"

    def handle(self, *args, **kwargs):
        for user in User.objects.all()[:10]:
            self.stdout.write(user)
```

Our class name must be **Command** and it must inherit from **BaseCommand**. The output
of our command must be completed in the **handle** function. We send output via
**self.stdout.write**. Different colors are available — I'll cover that later.

Let's run it and see the result.

### Adding Arguments to Our Command

Django uses Python's standard library
[argparse](https://docs.python.org/3/library/argparse.html), so to add arguments to our
commands we must use this library's features. We'll do this by adding a function called
`add_arguments` to our class.

In the previous example it always returned 10 users, but now we'll make it output as
many users as the number we pass as an argument.

**/management/commands/get_user.py**

```python
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Use and get 10 users"

    def add_arguments(self, parser):
        parser.add_argument("hmany", type=int, help="write how many users will you get")

    def handle(self, *args, **kwargs):
        hmany = kwargs.get("hmany")
        for user in User.objects.all()[:hmany]:
            self.stdout.write(user.username)
```

Usage: `python manage.py get_user 2`

## Optional Arguments

Let's continue with the same example and understand optional arguments.

**/management/commands/get_user.py**

```python
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Use and get 10 users"

    def add_arguments(self, parser):
        parser.add_argument("--hmany", type=int, help="write how many users will you get")

    def handle(self, *args, **kwargs):
        hmany = kwargs.get("hmany")
        if hmany:
            for user in User.objects.all()[:hmany]:
                self.stdout.write(user.username)
         else:
             for user in User.objects.all()[:10]:
                 self.stdout.write(user.username)
```

Usage:

- `python manage.py get_user --hmany 3`
- `python manage.py get_user` — or you can choose not to use it

We made an argument optional simply by prefixing it with `--`. I added just 1 argument
here, but you can add multiple arguments or write additional custom command modules under
**/management/commands/**.

> Note: Don't forget to study the argparse library for more advanced usage.

## Built-in Styles in Management Commands

```python
from django.core.management.base import BaseCommand

class Command(BaseCommand):
     help = 'Show all available styles'

     def handle(self, *args, **kwargs):
          self.stdout.write(self.style.ERROR('error - A major error.'))
          self.stdout.write(self.style.NOTICE('notice - A minor error.'))
          self.stdout.write(self.style.SUCCESS('success - A success.'))
          self.stdout.write(self.style.WARNING('warning - A warning.'))
          self.stdout.write(self.style.SQL_FIELD('sql_field - The name of a model field in SQL.'))
          self.stdout.write(self.style.SQL_COLTYPE('sql_coltype - The type of a model field in SQL.'))
          self.stdout.write(self.style.SQL_KEYWORD('sql_keyword - An SQL keyword.'))
          self.stdout.write(self.style.SQL_TABLE('sql_table - The name of a model in SQL.'))
          self.stdout.write(self.style.HTTP_INFO('http_info - A 1XX HTTP Informational server response.'))
          self.stdout.write(self.style.HTTP_SUCCESS('http_success - A 2XX HTTP Success server response.'))
          self.stdout.write(self.style.HTTP_NOT_MODIFIED('http_not_modified - A 304 HTTP Not Modified server response.'))
          self.stdout.write(self.style.HTTP_REDIRECT('http_redirect - A 3XX HTTP Redirect server response other than 304.'))
          self.stdout.write(self.style.HTTP_NOT_FOUND('http_not_found - A 404 HTTP Not Found server response.'))
          self.stdout.write(self.style.HTTP_BAD_REQUEST('http_bad_request - A 4XX HTTP Bad Request server response other than 404.'))
          self.stdout.write(self.style.HTTP_SERVER_ERROR('http_server_error - A 5XX HTTP Server Error response.'))
          self.stdout.write(self.style.MIGRATE_HEADING('migrate_heading - A heading in a migrations management command.'))
          self.stdout.write(self.style.MIGRATE_LABEL('migrate_label - A migration name.'))
```

## See Also

- [Django's custom management commands](https://github.com/django/django/tree/master/django/core/management/commands)
- [Django Docs - custom-management-commands](https://docs.djangoproject.com/en/3.0/howto/custom-management-commands/)
