---
publishDate: 2022-07-05T00:00:00Z
author: Hakan Çelik
title: "Using Dumpdata and Loaddata"
excerpt: "Main source | djangoproject.com/en/2.1/"
category: Django
subcategory: Database
image: ~/assets/images/blog/django.jpg
tags:
  - django
  - python
---

# Using Dumpdata and Loaddata

## Dumpdata

> [Main source \| djangoproject.com/en/2.1/](https://docs.djangoproject.com/en/2.1/ref/django-admin/#dumpdata)

**Dumpdata** is a command available among Django's default commands, accessible via
`python manage.py`. Its purpose is to create a backup (fixture) of your database in a
specified format. If you wish, you can use the **loaddata** command to write this backup
into a newly created database. Those curious about the source code of the **dumpdata**
command can click the link I provided to study it and get more detailed information
firsthand:
[dumpdata.py](https://github.com/django/django/blob/master/django/core/management/commands/dumpdata.py)

### Usage

General usage: `python manage.py dumpdata [app_label[.ModelName] [app_label[.ModelName] ...]]`

### Parameters

- `--all -a` When these parameters are used, Django uses the base manager to dump all
  models.
- `--format FORMAT` With the format parameter, you can specify which format to use when
  dumping. The default format is **json** and there are
  [three formats](https://docs.djangoproject.com/en/2.1/topics/serialization/#serialization-formats)
  available: **xml, json, yaml**.
- `--indent INDENT` Specifies the indentation level of the output. Default is JSON.
  Supported formats are listed in the serialization formats documentation.
- `--exclude EXCLUDE, -e EXCLUDE` During backup, there may be certain parts you don't
  want to back up — this parameter is for that purpose.
- `--database DATABASE` A helpful parameter for those using multiple databases — it
  specifies which database to use for the backup. Defaults to the **default** database.
- `--natural-foreign` Uses the `natural_key()` model method to serialize any foreign key
  and many-to-many relationships with objects that define this method. If you are
  dumping `contrib.auth` Permission objects or `contrib.contenttypes` ContentType
  objects, you should probably use this flag. For more details about this and the next
  option, see the documentation on
  [natural keys](https://docs.djangoproject.com/en/2.1/topics/serialization/#topics-serialization-natural-keys).
- `--natural-primary` Omits the primary key in the serialized data for this object, as
  it can be calculated during deserialization.
- `--pks PRIMARY_KEYS` Outputs only the objects specified by a comma-separated list of
  primary keys. This is only available when dumping one model. By default, all records
  for the model are output.
- `--output OUTPUT, -o OUTPUT` Specifies a file to write the serialized data to. By
  default, the data goes to standard output. Can also be used like `> output.json`.

### Example Usage

- `python manage.py dumpdata output.json --format json --database default` Without
  specifying a model name — dumps the entire selected database.
- `python manage.py dumpdata auth output.json --format json --database default` Dumps
  only the auth model.
- `python manage.py dumpdata auth.user output.json --format json --database default`
  Dumps only the user section within the auth model.
- `python manage.py dumpdata --exclude admin output.json --format json --database default`
  Dumps all data except admin.
- `python manage.py dumpdata mymodel output.json --format json --database myseconddb`
  Dumps the data from the model named `mymodel` in the database named `myseconddb`
  (my second database).

### Warning

If you get the `RelatedObjectDoesNotExist` error during the dumpdata command, check out
this address:
[https://code.djangoproject.com/ticket/28972](https://code.djangoproject.com/ticket/28972)
and use it as `python manage.py dumpdata -o output.json --format json` — the problem
will be resolved.

## Loaddata

The loaddata command lets us load the data created with dumpdata into a newly created
database. The source code address for loaddata is:
[loaddata.py](https://github.com/django/django/blob/master/django/core/management/commands/loaddata.py)

### Usage

General usage: `python manage.py loaddata fixture [fixture ...]` where **fixture** is the
file created with **dumpdata**.

### Parameters

- `--database DATABASE` Same as above — you can select a database. Defaults to the
  `default` database.
- `--ignorenonexistent, -i` Allows ignoring fields and models that don't exist.
- `--app APP_LABEL` Allows loading a specific app.
- `--format FORMAT` Enter the format of the file you created with dumpdata.
- `--exclude EXCLUDE, -e EXCLUDE` Same purpose — used to exclude applications or models
  during loading.

### Example Usage

- `python manage.py loaddata mydata.json --format json`
- `python manage.py loaddata mydata.json --database mydb`
- `python manage.py loaddata mydata.json --format xml --database default`
- `python manage.py loaddata mydata.json --exclude auth --database default`
