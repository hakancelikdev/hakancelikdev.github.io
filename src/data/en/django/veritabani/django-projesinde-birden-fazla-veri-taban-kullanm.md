---
publishDate: 2022-05-10T00:00:00Z
author: Hakan Çelik
title: "Using Multiple Databases in a Django Project"
excerpt: "We'll learn how to use multiple databases with Django, how to create applications with Django, how to find the IP addresses of visitors, and how to use 'from django.db.models import F'."
category: Django
subcategory: Database
image: ~/assets/images/blog/django.jpg
tags:
  - django
  - python
---

# Using Multiple Databases in a Django Project

#### What will we learn?

- How to use multiple databases with Django
- How to create an application with Django
- How to find the IP addresses of visitors
- How to use **from django.db.models import F**

#### Requirements

- python3
- django 1.11
- Virtualenv

If you need information about Virtualenv, check out this address:
[Virtualenv](https://steemit.com/utopian-io/@tolgahanuzun/what-is-virtualenv-and-how-is-it-used-tr-virtualenv-nedir-ve-nasil-kullanilir)

Install Virtualenv and the required packages (requirements) from the address above.

\[===========\]

If you're wondering why you would ever need multiple databases, here's an example: on
[coogger.com](https://github.com/hakancelik96/blog/tree/a2daa68f9fcf2b6e6dae3f9d0e8b8bfc6369c349/django/www.coogger.com)
I store the number of times content has been read along with the visitor's IP address
and the relevant content's id number. If the person has already read it (i.e., if their
IP address and the current content's id are already recorded), I don't increment the view
count. Now, other data is also being recorded in the same database, and IP addresses
aren't that valuable compared to other data — like user information or shared content —
while being written very frequently. So to separate this useful and not-so-useful data,
I set up multiple databases. Let's do this together.

### First, what do we need?

You should already have a Django project with an application named `myapp` inside it.
Let's say the database settings section in your settings.py file looks like this:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'sqlite3'),
    },
}
```

That's correct. Now navigate to your application directory named `myapp` and open a
console to create a new application:

```python
python3 manage.py startapp multiapp
```

A new application has been created. Go back to settings.py and make the following
changes:

```python
INSTALLED_APPS = [
    "multiapp",
    "myapp",
.....
]
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'sqlite3'),
    },
    'multi': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'multidb'),
    },
}
DATABASE_APPS_MAPPING = {'multiapp': 'multi'}
```

We added our new application to INSTALLED_APPS and configured a second database.
**DATABASE_APPS_MAPPING** will help us choose which application uses which database.

**Go to multiapp/models.py** and write a model to store the IP addresses we'll collect
from visitors, like this:

```python
from django.db import models
from myapp.models import Blog

class Blogviews(models.Model):
    content = models.ForeignKey(Blog, on_delete=models.CASCADE)
    ip = models.GenericIPAddressField() # our field for IP addresses

    class Meta:
        app_label = 'multiapp'
```

You have a Blog model in your `myapp` application — we linked it to the Blog model with
a ForeignKey. **app_label = 'multiapp'** — this part tells Django which database to use
based on the name defined in **DATABASE_APPS_MAPPING**. We're saying: this model
belongs to the `multiapp` application and will use the `multidb` database.

Now let's get the IP address — go to **myapp/views.py** and write the following:

```python
from django.db.models import F
from multiapp.models import Blogviews

def up_blog_view(request, queryset):
    try:
        ip = request.META["HTTP_X_FORWARDED_FOR"].split(',')[-1].strip()
    except:
        ip = None
    if ip is None:
        return False
    if not Blogviews.objects.filter(blog=queryset, ip=ip).exists():
        Blogviews(content=queryset, ip=ip).save()
        queryset.views = F("views") + 1
        queryset.save()
```

We wrote a function called **up_blog_view** with two parameters: the incoming request and
the incoming queryset (the Blog data). With
`request.META["HTTP_X_FORWARDED_FOR"].split(',')[-1].strip()` we get the IP address from
the request. If it's not None, we check using **Blogviews** and **exists()** whether
this combination was previously recorded. If it wasn't, we create a new record and
increment the view count by one with `F("views") + 1`, then save it.

### How do we use this function?

Open myapp/views.py and write something like this:

```python
from multiapp.views import up_content_view
from models import Blog

def home(request, id):
    queryset = Blog.objects.filter(id=id)[0]
    up_content_view(request, queryset)
```

Usage is similar to the above. Note that you'll also need to add an integer field called
`views` to your Blog model to store the view count.

We're at the final stages. Everything is set — now we need to synchronize the databases.
The commands should be as follows:

```python
python3 manage.py migrate --database multi
python3 manage.py makemigrations multiapp
python3 manage.py migrate
python3 manage.py makemigrations myapp
```

## multiapp/admin.py

```python
from django.contrib.admin import ModelAdmin, site
from multiapp.models import Blogviews

class ViewsAdmin(ModelAdmin):
    list_ = ["content_id", "ip"]
    list_display = list_
    list_display_links = list_
    search_fields = list_

site.register(Blogviews, ViewsAdmin)
```

## Result?


