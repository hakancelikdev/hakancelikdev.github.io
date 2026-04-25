---
publishDate: 2022-08-16T00:00:00Z
author: Hakan Çelik
title: "Extending the User Model"
excerpt: "As you know, Django comes with a user model that has certain properties — name, last name, email, password, etc. While these fields save the day in most cases, sometimes they're not enough. Depending on the project you're building, users may need to have more properties. That's what we'll achieve by extending the user model."
category: Django
subcategory: Authentication
image: ~/assets/images/blog/django.jpg
tags:
  - django
  - python
---

# Extending the User Model

As you know, Django comes with a user model that has certain properties — name, last
name, email, password, etc. While these fields save the day in most cases, sometimes
they're not enough. Depending on the project you're building, users may need to have
more properties. We'll achieve this by extending the user model — this is called
extending.

### What Is It?

Extending means adding new properties to Django's default user model.

### How to Extend the User Model

There are actually 4 options available — let's briefly go over what they are and then
move on to what we'll cover today.

- Using a Proxy model

> Using a proxy model means inheriting a model without creating a new table in the
> database. It is used to change the behavior of an existing model without affecting the
> existing database schema.

- Creating a One-To-One relationship with the User model

> The working principle is: it has its own data table and is connected one-to-one with
> a different model.

For example, it takes the user id from the user model and adds it as user_id to the
new table we created. Information is then added to the new table under that id. For
instance, it stores the phone number of the user with user_id 4 in the relevant column.
When we want to retrieve the data, we first get the value from user_id and find which
user in the User model it corresponds to.

- Creating a Custom User model that extends AbstractBaseUser

> This is an entirely new User model inherited from AbstractBaseUser. It requires a few
> changes in settings.py and should be done at the start of the project, because it
> will significantly affect the database schema. To avoid errors, it is recommended to
> do this before starting the project.

- Creating a new custom User model by extending AbstractUser

> Everything I said just above applies here too, so I'll skip straight to it. Wait —
> which one are you going to explain?

I'll explain the easy-to-grasp one-to-one approach. First, if you haven't already added
it to your project, let's include the **User** model in **models.py**:

```python
from django.contrib.auth.models import User
```

This is Django's ready-made user model. Now shape and add the other user information
that needs to be added to this user model according to your project.

```python
class UserProfile(models.Model): # other user information
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    pp = models.BooleanField(default=False, verbose_name="profile picture")
    is_author = models.BooleanField(default=True, verbose_name="accept as author")
    author = models.BooleanField(default=True, verbose_name="author application")
    about = RichTextField(null=True, blank=True, verbose_name="about person")
    following = models.IntegerField(default=0)
    followers = models.IntegerField(default=0)
    hmanycontent = models.IntegerField(default=0)
```

Let's explain this UserProfile model we created.

- `user = models.OneToOneField` — here we linked the user in our model to Django's own
  model. After this link, the user field in the UserProfile table in the database will
  contain the relevant user's id number — not the username directly.
- `models.CASCADE` means "if the linked object is deleted, delete this too" — this is
  how we inform Django of that behavior.

The other fields are ones I needed for my own project: pp — has the user uploaded a
profile picture, followers — how many people follow them, following — how many people
they follow, etc.

In short, after this operation the database will look like this:

| id  | user_id | pp  |
| :-- | :------ | :-- |
| 0   | 3       | 1   |
| 1   | 4       | 0   |
| 2   | 5       | 0   |

## Admin Side

```python
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
# then let's include the model we extended — mine is as follows:
from models import UserProfile

class UserProfileAdmin(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = "Other user information"

# With **verbose_name_plural** you write the name displayed on the admin page.
# With **model** we specify which model class to use.

# And to include our new model, we write the following:

class UserAdmin(UserAdmin):
    inlines = (UserProfileAdmin, )
    """here we write the class we just created in admin.py —
    don't forget the comma, it will cause an error"""
```

If you make multiple extensions, you again define them like
**class UserProfileAdmin(admin.StackedInline):** and fill in the required fields,
then add your class to **inlines** inside **class UserAdmin(UserAdmin):** with a
trailing comma.

Then I inform Django like this so it forgets the classic user model and stops working
with it:

```python
admin.site.unregister(User)
```

Here we unregister the default User model. Finally, we register the new features:

```python
admin.site.register(User, UserAdmin)
```

Lastly, since we made changes in models.py, we need to run the necessary commands to
apply them to the database:

```python
python manage.py migrate
python manage.py makemigrations myapp # (myapp is the name of the application you created — mine is cooggerapp)
```

After running these commands and applying them to the database, everything is ready.

### Using It in a Template?

My favorite part of extending is that we can immediately use the new properties we added
in our templates without any extra work — no dealing with views. Let me give a few
examples and wrap up the topic. For instance, if you need to check in a template whether
the user has uploaded a photo or not, with my model you'd do it like this in the
**template**:

```markup
  {% if request.user.userprofile.pp %}
      <img  src="/media/users/.jpg">
  {% else %}
      <img src="/static/media/profil.png" >
  {% endif %}
```

Here in the template, with `request.user.userprofile.pp` we checked whether the
incoming user (i.e., `request.user`) has uploaded a profile picture. If True, we show
their own picture; if False, we show the default picture.

```markup
following   
followers  
```

### Signals

You've extended your User model and now you want to capture new user registrations and
have them recorded in your new model too. In that case, you need to learn about **Django
signals**.

[How to Create Django Signals](django-sinyalleri-nasl-olusturulur-django-signals.md)
