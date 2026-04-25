---
publishDate: 2022-05-24T00:00:00Z
author: Hakan Çelik
title: "How to Create Django Signals"
excerpt: "Signals let you intercept an action performed on a model or on requests (request, response) and react accordingly. For example, if you have a user model and want something to happen in your own model whenever a new user registers, you can do that using signals."
category: Django
image: ~/assets/images/blog/django.jpg
tags:
  - django
  - python
---

# How to Create Django Signals

## What Are They?

In short, signals let you intercept an action performed on a model or on requests
(request, response) and react accordingly. For example, if you have a user model and
you want your own model to record data whenever a new user registers, you can do that
using signals.

The relevant sections of Django's source code that make all signal events happen:

- [django/dispatch/dispatcher.py](https://github.com/django/django/blob/master/django/dispatch/dispatcher.py)
- [django/db/models/signals.py](https://github.com/django/django/blob/master/django/db/models/signals.py)
- [django/core/signals.py](https://github.com/django/django/blob/master/django/core/signals.py)

## Creating a Django Signal

[**django/dispatch/dispatcher.py**](https://github.com/django/django/blob/master/django/dispatch/dispatcher.py)

Below we can see Django signal usage, taken from the source addresses I provided above.

```python
"""
A decorator for connecting receivers to signals. Used by passing in the
signal (or list of signals) and keyword arguments to connect::
"""
@receiver(post_save, sender=MyModel)
def signal_receiver(sender, **kwargs):
    pass
@receiver([post_save, post_delete], sender=MyModel)
def signals_receiver(sender, **kwargs):
    pass
```

Let's examine the `receiver` decorator below.

```python
def receiver(signal, **kwargs):
    def _decorator(func):
        if isinstance(signal, (list, tuple)):
            for s in signal:
                s.connect(func, **kwargs)
        else:
            signal.connect(func, **kwargs)
        return func
    return
```

As we can see in the code above, if the **signal** parameter we provide —
`@receiver(post_save, sender=MyModel)` — where `post_save` is a signal and is the
first parameter — is not a list, it directly calls the **connect** function underneath it
with our function and its parameters (`signal.connect(func, **kwargs)` from the code above).
If a list is provided — as in `@receiver([post_save, post_delete], sender=MyModel)` —
it calls the **connect** function for each signal:

```python
for s in signal:
    s.connect(func, **kwargs)
```

passing the function and given parameters (`(func, **kwargs)`) and finally returns our
function. This is how signals are captured and executed.

In this subsection, we'll code new signals for models using Django's **built-in signals**.

The source code for **built-in** signals is at
[**django/db/models/signals.py**](https://github.com/django/django/blob/master/django/db/models/signals.py) —
built-in signals are signals that come bundled with Django.

As we can see in the source code, the names and parameters of model signals are:

- django.db.models.signals.**pre_init:** `(sender, *args, **kwargs)`
- django.db.models.signals.**post_init:** `(sender, instance)`
- django.db.models.signals.**pre_save:** `(sender, instance, raw, using, update_fields)`
- django.db.models.signals.**post_save:**
  `(sender, instance, created, raw, using, update_fields)` — a signal that fires
  immediately after a model's save method runs.
- django.db.models.signals.**pre_delete:** `(sender, instance, using)`
- django.db.models.signals.**post_delete:** `(sender, instance, using)`
- django.db.models.signals.**m2m_changed:**
  `(sender, instance, action, reverse, model, pk_set, using)`
- django.db.models.signals.**pre_migrate:**
  `(sender, app_config, verbosity, interactive, using, apps, plan)`
- django.db.models.signals.**post_migrate:**
  `(sender, app_config, verbosity, interactive, using, apps, plan)`

```python
from django.contrib.auth.models import User
from django.db.models.signals import post_save

def save_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(save_profile, sender=User)
```

In the code above you can see how to create a signal. Another way to create a Django
signal is to use the `@receiver` decorator — because if you look at the `@receiver`
decorator code I shared above, you can see it does `signal.connect(func, **kwargs)` under
the hood. This is the same as the first method — `post_save.connect(save_profile, sender=User)`.

```python
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()
```

## Using Signals in a Project

If you are going to use signals in a project, the best approach is to create a folder
called **signals** directly under your app directory, write your signal functions inside
Python files you create there, and follow the steps below. We can load our coded signals
after the application is fully loaded by using **apps.py**.

After completing the following steps, everything will be set up.

**/myapp/init.py**

`default_app_config = "myapp.apps.MyAppNameConfig"`

**/myapp/signals/init.py**

In this file, you must import all signal functions from all Python files you created
under the signals folder so they get loaded when called in **apps.py**.

If I have a Python file called **mysignal** with signal functions inside it, I import
them all like this:

```python
from .mysignal import *
```

**/myapp/apps.py**

```python
#django
from django.apps import AppConfig

class MyAppNameConfig(AppConfig):
    name = 'MyAppNameConfig'

    def ready(self): # When the application named MyAppName is ready
        from myapp.signals import *
        # This line will import all the signals I wrote
```

## Request/Response Signals

[**django/core/signals.py**](https://github.com/django/django/blob/master/django/core/signals.py)

- django.core.signals.**request_started**:

  `(sender, environ)`

- django.core.signals.**request_finished**:

  `(sender, environ)`

- django.core.signals.**got_request_exception**:

  `(sender, environ)`

## How to Create a New Django Signal

### What Is It?

This is about creating our own signals beyond the **Request/Response Signals** and
**Model** signals described above.

### How Is It Done?

The source code links I provided at the top are sufficient to understand this, but I'll
explain it with an example from another project.

The [django-contrib-comments](https://github.com/django/django-contrib-comments) project
has created new signals for its own purposes and made them available. Let's take a look.

The signal file is at
[/django_comments/signals.py](https://github.com/django/django-contrib-comments/blob/master/django_comments/signals.py).
As we can see, it first imports the Signal class with `from django.dispatch import Signal`
and defines 3 new signals: `comment_will_be_posted`, `comment_was_posted`, and
`comment_was_flagged`. The parameters these signals accept are visible in the code —
`comment_was_posted = Signal(providing_args=["comment", "request"])` — this signal takes
`comment` and `request` parameters, plus the default `sender` parameter.

Now, to send the signal when an action occurs, it's done inside the project view.

At the top of the file `from django_comments import signals` imports the signals module,
and right
[here — /views/comments.py#L123](https://github.com/django/django-contrib-comments/blob/master/django_comments/views/comments.py#L123)
after the `save()` method (because the signal name is `comment_was_posted`):

```python
signals.comment_was_posted.send(
    sender=comment.__class__,
    comment=comment,
    request=request
)
```

the signal is sent. You can create signals for your own purposes the same way.
