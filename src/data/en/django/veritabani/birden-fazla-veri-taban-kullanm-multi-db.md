---
publishDate: 2022-03-01T00:00:00Z
author: Hakan Çelik
title: "Using Multiple Databases"
excerpt: "To use multiple databases, we first need to define them in the project's settings.py file. The example below shows a settings.py configuration for a PostgreSQL and a MySQL database — you can use multiple databases of different types."
category: Django
subcategory: Database
image: ~/assets/images/blog/django.jpg
tags:
  - django
  - python
---

# Using Multiple Databases

To use multiple databases, we first need to define them by adding entries to the
project's settings.py file. The example below shows a settings.py configuration for a
PostgreSQL and a MySQL database — you can use multiple databases of different (mixed)
types.

```python
DATABASES = {
    'default': { # the database we set as the default
        'NAME': 'app_data', # database name
        'ENGINE': 'django.db.backends.postgresql', # database type
        'USER': 'postgres_user', # username
        'PASSWORD': 's3krit' # and password
    },
    'users': { # a database opened only to store users (named 'users' for access, called 'user_data')
        'NAME': 'user_data',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'mysql_user',
        'PASSWORD': 'priv4te'
    }
}
```

Of course, if you don't want to use a default database, you can skip it — just leave the
default section empty like this:

```python
DATABASES = {
    'default': {},
    'users': {
        'NAME': 'user_data',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'mysql_user',
        'PASSWORD': 'superS3cret'
    },
    'customers': {
        'NAME': 'customer_data',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'mysql_cust',
        'PASSWORD': 'veryPriv@ate'
    }
}
```

## Synchronizing Your Databases

The database synchronization command works on one database at a time. By default it
works on the default database, but you can tell it to synchronize a different database
by providing the `--database` option. So, to synchronize all models to all databases in
the first example above, you would do the following:

```bash
$ ./manage.py migrate # synchronizes the database set as default
$ ./manage.py migrate --database=users # synchronizes the database with access name 'users'
```

And this is another example where we left the default empty:

```bash
$ ./manage.py migrate --database=users
$ ./manage.py migrate --database=customers
```

## Using Other Management Commands

Most other `django-admin` commands that interact with the database work the same way —
they only operate on one database at a time; the database used is controlled with the
`--database` flag.

An exception to this rule is the `makemigrations` command. It validates the migration
history in databases (which can cause issues if the migration files are edited) before
creating new migrations. By default it only checks the default database, but it will also
inspect routers' `allow_migrate()` method if present.

## Automatic Database Routing

The easiest way to use multiple databases is to set up a database routing scheme. The
default routing scheme ensures that objects remain "sticky" to their original database
(i.e., an object retrieved from the `foo` database is saved back to that same database).
The default routing scheme ensures that if no database is specified, all queries fall back
to the default database.

You don't need to do anything to activate the default routing scheme — it is provided
"out of the box" in every Django project. However, if you want to implement more
interesting database allocation behaviors, you can define and install your own database
routers.

### Database Routers

A database router is a class that provides four methods. Don't worry too much about the
technical details here — the code examples further below will make things much clearer.

#### db_for_read(model, \*\*hints)

> for read operations

Suggest the database that should be used for read operations on objects of type Model.

If a database operation can provide any additional information that might help in
choosing a database, it will be provided in the **hints** dictionary. Details on valid
**hints** are provided below.

Returns **None** if there is no suggestion.

#### db_for_write(model, \*\*hints)

> for write operations

Suggest the database that should be used for writes of objects of type Model.

If a database operation can provide any additional information that might help in
choosing a database, it will be provided in the **hints** dictionary. Details on valid
hints are provided below.

Returns **None** if there is no suggestion.

#### allow_relation(obj1, obj2, \*\*hints)

> for relationships between objects in the database

Returns `True` if a relation between **obj1** and **obj2** should be allowed,

Returns `False` if the relation should be prevented, or `None` if there is no opinion.

This is purely a validation operation — it determines whether a relationship exists
between two objects for **foreign keys** and **many-to-many** relations.

#### allow_migrate(db, app_label, model_name=None, \*\*hints)

> for migration (migrate) operations

Determines whether the migration operation should run on the database with alias **db**.
Returns `True` if the operation should run, `False` if it should not, or `None` if the
router has no opinion.

The **app_label** positional argument is the label of the application being migrated.

> model_name is set by most migrations operations to the value of
> `model._meta.model_name` (the lowercase version of the model name) of the model
> being migrated.

Returns `None` for **RunPython** and **RunSQL** operations unless they use hints.

Hints are used by some operations to communicate additional information to the router.

When model_name is set, hints typically contains the model class under the 'model' key.
Note that it may be a historical model and therefore may not have any custom attributes,
methods, or managers. You should only rely on `_meta`.

This method can also be used to determine the availability of a model on a given
database.

`makemigrations` always generates migrations for model changes, but if `allow_migrate()`
returns False, any migration operations for model_name when running migrations for db
will be silently skipped. Changing `allow_migrate()` for models that already have
migrations can result in broken foreign keys, extra tables, or missing tables. When
`makemigrations` validates migration history, it skips databases where no apps are
allowed to migrate.

The router does not need to provide all these methods — it can omit one or more. If one
of the methods is omitted, Django will skip that router when performing the corresponding
check.

#### Hints

The hints received by the database router can be used to decide which database should
receive a particular request.

Currently, the only hint that can be provided is an object instance associated with the
read or write operation being performed. This might be the instance being saved, or an
instance being added in a many-to-many relationship. In some cases no instance hint will
be provided. The router checks for the existence of an instance hint and determines
whether that hint should be used to change routing behavior.

### Using Routers

Database routers are installed using the `DATABASE_ROUTERS` setting, which must be
configured in **settings.py**. This setting defines a list of class names, each
specifying a router to be used by the master router (`django.db.router`).

The master router is used by Django's database operations to allocate database usage.
Whenever a query needs to know which database to use, it calls the master router,
providing a model and a hint (if any). Django then tries each router in turn until a
database suggestion is found. If no suggestion is found, it tries the `_state.db` of the
hint instance. If no hint instance is provided, or the instance doesn't currently have a
database state, the master router will allocate the default database.

#### Settings.py

`DATABASE_ROUTERS = [] # should look like this`

Let's give an example and see how the database settings would look:

```python
DATABASES = {
    'default': {}, # we're not using a default database, so it's empty
    'auth_db': {
        'NAME': 'auth_db',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'mysql_user',
        'PASSWORD': 'swordfish',
    },
    'primary': {
        'NAME': 'primary',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'mysql_user',
        'PASSWORD': 'spam',
    },
    'replica1': {
        'NAME': 'replica1',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'mysql_user',
        'PASSWORD': 'eggs',
    },
    'replica2': {
        'NAME': 'replica2',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'mysql_user',
        'PASSWORD': 'bacon',
    },
}
```

Now we need to configure routing. First, we'll set up a router for **auth_db** that
knows to send queries for the auth application there:

```python
class AuthRouter(object):
# We'll configure the AuthRouter, a router only for the database we named auth_db
# That is, this is exclusively for the auth_db database
    """
     A router to control all database operations
     on models in the auth application.
    """
    def db_for_read(self, model, **hints):
        """
        Attempts to read auth models go to auth_db.
        """
        if model._meta.app_label == 'auth':
            return 'auth_db'
        return None
    def db_for_write(self, model, **hints):
        """
        Attempts to write auth models go to auth_db.
        """
        if model._meta.app_label == 'auth':
            return 'auth_db'
        return None
    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if a model in the auth app is involved.
        Allows the relation if both objects belong to auth.
        """
        if obj1._meta.app_label == 'auth' or \
           obj2._meta.app_label == 'auth':
           return True
        return None
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Make sure the auth app only appears in the 'auth_db' database.
        """
        if app_label == 'auth':
            return db == 'auth_db'
        return None
```

We also want a router that sends all other applications to a primary/replica
configuration, and randomly selects a replica for reads:

```python
import random
class PrimaryReplicaRouter(object):
    def db_for_read(self, model, **hints):
        """
        Reads go to a randomly-chosen replica.
        """
        return random.choice(['replica1', 'replica2'])
    def db_for_write(self, model, **hints):
        """
        Writes always go to primary.
        """
        return 'primary'
    def allow_relation(self, obj1, obj2, **hints):
        """
        Relations between objects are allowed if both objects are
        in the primary/replica pool.
        """
        db_list = ('primary', 'replica1', 'replica2')
        if obj1._state.db in db_list and obj2._state.db in db_list:
            return True
        return None
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        All non-auth models end up in this pool.
        """
        return True
```

Since we've now defined routers for the other databases, finally we can add the following
to the settings file (replacing the actual Python paths/dots to where the routers are
defined):

```python
DATABASE_ROUTERS = ['path.to.AuthRouter', 'path.to.PrimaryReplicaRouter']
```

We provide the class names — this is important because if entered incorrectly Django
won't find the class path. Write the actual Python path to where the routers are defined.

## Manually Selecting a Database

Django also provides an API that gives you full control over database usage in your code.
A manually specified database allocation takes priority over a database allocated by a
router.

### Manually Selecting a Database for a QuerySet

We'll use the `using()` function for this — for example:

```python
>>> # this code fetches objects from the database you set as default
>>> Author.objects.all()
>>> # and so does this
>>> Author.objects.using('default').all()
>>> # but this fetches data from the database set as 'other'
>>> Author.objects.using('other').all()
```

`using()` is also used to save new data to a specific database:

```python
my_object.save(using='legacy_users')
# this code saves the received data to the database named "legacy_users"
```

For delete operations, it's the same:

```python
u = User.objects.using('legacy_users').get(username='fred')
u.delete() # deletes the data in the `legacy_users` database
```

## Admin Interface Configuration for Multiple Databases

```python
class MultiDBModelAdmin(admin.ModelAdmin):
    # A handy constant for the name of the alternate database.
    using = 'other' # the database name to use
    def save_model(self, request, obj, form, change):
        # Tell Django to save objects to the 'other' database.
        obj.save(using=self.using)
    def delete_model(self, request, obj):
        # Tell Django to delete objects from the 'other' database
        obj.delete(using=self.using)
    def get_queryset(self, request):
        # Tell Django to look for objects on the 'other' database.
        return super(MultiDBModelAdmin, self).get_queryset(request).using(self.using)
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        # Tell Django to populate ForeignKey widgets using a query
        # on the 'other' database.
        return super(MultiDBModelAdmin, self).formfield_for_foreignkey(db_field, request, using=self.using, **kwargs)
    def formfield_for_manytomany(self, db_field, request, **kwargs):
        # Tell Django to populate ManyToMany widgets using a query
        # on the 'other' database.
        return super(MultiDBModelAdmin, self).formfield_for_manytomany(db_field, request, using=self.using, **kwargs)
```

```python
class MultiDBTabularInline(admin.TabularInline):
    using = 'other'
    def get_queryset(self, request):
        # Tell Django to look for inline objects on the 'other' database.
        return super(MultiDBTabularInline, self).get_queryset(request).using(self.using)
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        # Tell Django to populate ForeignKey widgets using a query
        # on the 'other' database.
        return super(MultiDBTabularInline, self).formfield_for_foreignkey(db_field, request, using=self.using, **kwargs)
    def formfield_for_manytomany(self, db_field, request, **kwargs):
        # Tell Django to populate ManyToMany widgets using a query
        # on the 'other' database.
        return super(MultiDBTabularInline, self).formfield_for_manytomany(db_field, request, using=self.using, **kwargs)
```

Again in admin.py we register the classes we created:

```python
from django.contrib import admin
# Customize multi-db admin objects for use with specific models
class BookInline(MultiDBTabularInline):
    model = Book
class PublisherAdmin(MultiDBModelAdmin):
    inlines = [BookInline]
admin.site.register(Author, MultiDBModelAdmin)
admin.site.register(Publisher, PublisherAdmin)
othersite = admin.AdminSite('othersite')
othersite.register(Publisher, MultiDBModelAdmin)
```

#### [Source](https://docs.djangoproject.com/en/1.11/topics/db/multi-db/)
