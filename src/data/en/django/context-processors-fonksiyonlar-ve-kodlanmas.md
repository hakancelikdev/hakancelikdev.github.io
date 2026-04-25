---
publishDate: 2022-03-15T00:00:00Z
author: Hakan Çelik
title: "Context Processor Functions and How to Write Them"
excerpt: "context_processors is a list of callable Python paths used to populate the context when a template is rendered. These callables take the request object as an argument and return a dict of items to be merged into the context."
category: Django
image: ~/assets/images/blog/django.jpg
tags:
  - django
  - python
---

# Context Processor Functions and How to Write Them

## What is it?

**context_processors** is a list of callable Python paths used to populate the
context when a template is rendered. These callables take the _request_ object as
an argument and return a dict of items to be merged into the context.

## Context Processors in settings.py

**Inside /settings.py**

```python
context_processors=[
    'django.template.context_processors.debug',
    'django.template.context_processors.request',
    'django.contrib.auth.context_processors.auth',
    'django.contrib.messages.context_processors.messages',
],
```

There are 4 **context_processors** shown above. Let's briefly talk about what they do —
anyone who has coded in Django has certainly used these **context_processors** before
and already knows what they do, so we'll cover them briefly and then write one of our
own.

### Request

Returns information about the current request; it is an HttpRequest object.

Every **RequestContext** already contains the `request` variable, which is the current
**HttpRequest** object.

### Debug

Returns helper context variables for debugging; only works when `DEBUG = TRUE`.

### Auth

Allows us to access user information inside a template, for example:

```markup

```

If the user is an unknown user, it returns `AnonymousUser`.

### Messages

This is a list of messages sent via Django's messages framework.

It lets us send messages to users by doing the following:

```python
from django.contrib import messages
messages.add_message(request, messages.INFO, 'Hello world.')

messages.debug(request, '%s SQL statements were executed.' % count)
messages.info(request, 'Three credits remain in your account.')
messages.success(request, 'Profile details updated.')
messages.warning(request, 'Your account expires in three days.')
messages.error(request, 'Document deleted.')
```

**Inside a template**

```markup
{% if messages %}
<ul class="messages">
    {% for message in messages %}
    <li{% if message.tags %} class=""{% endif %}></li>
    {% endfor %}
</ul>
{% endif %}
```

Related documentation:
[https://docs.djangoproject.com/en/2.2/ref/contrib/messages/](https://docs.djangoproject.com/en/2.2/ref/contrib/messages/)

## Context Processor Source Code

Let's look at the source code for two of the **context_processors** above: _debug_ and
_request_.

**Source code of django.template.context_processors**

```python
import itertools
from django.conf import settings

def debug(request):
    """
    Return context variables helpful for debugging.
    """
    context_extras = {}
    if settings.DEBUG and request.META.get('REMOTE_ADDR') in settings.INTERNAL_IPS:
        context_extras['debug'] = True
        from django.db import connections
        # Return a lazy reference that computes connection.queries on access,
        # to ensure it contains queries triggered after this function runs.
        context_extras['sql_queries'] = lazy(
            lambda: list(itertools.chain.from_iterable(connections[x].queries for x in connections)),
            list
        )
    return context_extras

def request(request):
    return {'request': request}
```

As you can see, there are two _context_processors_ functions above — these are some of
Django's own built-in _context_processors_. Looking at the code, we can see how a
_context_processors_ is written: it's just a normal function that takes only the request
(HttpRequest) object as a parameter and returns a dict. You then add the path of your
_context_processors_ to the _context_processors_ list in **settings.py** and that's it —
you can now access your _context_processors_ from anywhere.

## Writing Our Own Context Processor Function

**/myapp/contenxt_processors/hello.py**

```python
def say_hello(request):
    return dict(hello="hello")
```

We wrote a simple function — now we need to add its path to **settings.py**.

**Inside /settings.py**

```python
context_processors=[
    'django.template.context_processors.debug',
    'django.template.context_processors.request',
    'django.contrib.auth.context_processors.auth',
    'django.contrib.messages.context_processors.messages',
    "myapp.contenxt_processors.hello.say_hello"
],
```

That's all — now we can display it in any of our templates like this:

```markup

```
