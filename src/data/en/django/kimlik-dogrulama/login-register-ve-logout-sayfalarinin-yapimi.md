---
publishDate: 2022-07-19T00:00:00Z
author: Hakan Çelik
title: "Building Login, Register, and Logout Pages"
excerpt: "In this post, instead of writing CSS for the page design, I'll use a front-end framework called Uikit. The code I use here comes from a project called Eatingword that I'm developing to keep my Django skills fresh and learn new things."
category: Django
subcategory: Authentication
image: ~/assets/images/blog/django.jpg
tags:
  - django
  - python
---

# Building Login, Register, and Logout Pages

In this post, instead of writing CSS for the page design, I'll use the
[Uikit](https://getuikit.com/) front-end framework. The code I use here comes from a
project called [Eatingword](https://github.com/hakancelik96/eatingword) that I'm
developing to keep my Django knowledge fresh and learn new things. The project is
currently private, but when it's ready I'll share it under the
[MIT license](https://en.wikipedia.org/wiki/MIT_License).

## Form

**form_mixin.py**

```python
class UikitFormMixin:
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name in self.fields:
            widget = self.fields[field_name].widget
            while hasattr(widget, "widget"):
                widget = widget.widget
            if "nouikit" in widget.attrs:
                continue
            class_names = [widget.attrs.get("class", "")]
            if isinstance(widget, forms.Select):
                widget.attrs["title"] = (
                    "Select " + field_name.replace("_", " ").title()
                )
                class_names.extend(["uk-select"])
            elif isinstance(widget, forms.Textarea):
                class_names.extend(["uk-textarea"])
            class_names.extend(["uk-input", "uk-form-width-large"])
            widget.attrs["class"] = " ".join(class_names)
            widget.attrs.setdefault("autocomplete", "off")
            widget.attrs.setdefault(
                "placeholder", field_name.replace("_", " ").title()
            )
            uk_icons = {
                "username": "user",
                "password": "lock",
                "password1": "lock",
                "password2": "lock",
                "source": "arrow-right",
                "target": "pencil",
            }
            widget.uk_icon = uk_icons.get(field_name, None)
            widget.label_classes = ("uk-form-label",)
```

If you take a look at the `UikitFormMixin` mixin, you can probably understand its
purpose — but let me briefly explain.

When you inherit this class in a form class, it first runs the form, then this mixin runs
and iterates over the fields created in the previous form with a for loop, checks the
type of each field's `widget`, then assigns the appropriate `uikit` class names based on
the type, and also assigns icon names based on the field names. We'll then use the
**\_\_form.html** template to convert every form that comes in into a Uikit-styled form.

**forms.py**

```python
from django.contrib.auth import forms as auth_forms
from django.contrib.auth import get_user_model

from .form_mixin import UikitFormMixin

UserModel = get_user_model()

class RegisterForm(UikitFormMixin, auth_forms.UserCreationForm):
    class Meta(auth_forms.UserCreationForm.Meta):
        model = UserModel

class AuthenticationForm(UikitFormMixin, auth_forms.AuthenticationForm):
    pass
```

Notice that when defining these form classes, I inherited `UikitFormMixin` — that class
automatically prepares my form fields for Uikit.

Why did I use `from django.contrib.auth import get_user_model` and call `get_user_model()`
instead of directly doing `from django.contrib.auth import User`?

The reason is this: I wrote an article called
[Extending the User Model](user-modelini-genisletmek.md), and if you used one of the
methods described there — specifically inheriting from `AbstractBaseUser` to create your
user model — it will return that model; otherwise it returns the default `User` model.
This way your form will be compatible no matter how your user model is set up.

Django already has `UserCreationForm` ready to use — it's what Django uses when you
create a user in the admin panel. We'll use it for our own registration page. Be sure to
study its source code — here's the link:
[UserCreationForm](https://github.com/django/django/blob/master/django/contrib/auth/forms.py#L82)

Similarly, the login form already exists in Django. We'll use the same form but it needs
to follow the Uikit design, so we just inherited `UikitFormMixin` and that's all — our
forms are ready. Here's the link for AuthenticationForm as well:
[AuthenticationForm](https://github.com/django/django/blob/master/django/contrib/auth/forms.py#L173)

## View

**view_mixin.py**

```python
from django.contrib import messages
from django.contrib.messages.views import SuccessMessageMixin

class MessageMixin(SuccessMessageMixin):
    success_message = "Successfully Created/Updated"

    def form_invalid(self, form):
        messages.error(self.request, "Form Invalid")
        return super().form_invalid(form)
```

This class is used to send a success message when the form is valid and a form-invalid
message when it's not.

To use this view, simply inherit it in your class-based view. If you want, you can
customize the success message with the `success_message` attribute.

Django already has `SuccessMessageMixin` for success messages — I inherited from it and
wrote this class so it also sends a message when the form is invalid.

**views.py**

```python
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth import views as auth_views
from django.urls import reverse_lazy
from django.views import generic

from .forms import AuthenticationForm, RegisterForm
from .view_mixin import MessageMixin

class RegisterView(MessageMixin, generic.CreateView):
    template_name = "registration/register.html" # template rendered on GET request
    success_url = reverse_lazy("wordapp:index") # redirect here if form is valid and no issues arise
    form_class = RegisterForm # our form class
    success_message = "You have successfully registered %(username)s" # message sent via messages before redirecting to success_url when form is valid

    def form_valid(self, form):
        # function that runs when the defined form_class is valid after a POST request
        response = super().form_valid(form) # saves the form and gets the response that will redirect to success_url
        if user := authenticate( # self.object is the object returned by the saved form during super().form_valid(form), i.e. the registered user
            self.request,
            username=self.object.username,
            password=self.object.password,
        ): # if a successful login exists, it returns that user; we capture it using the := walrus operator introduced in Python 3.8
            login(self.request, user) # log the returned user in
        else:
            messages.error(self.request, "Could not login") # if user is False, send a message
        return response # return the response we got above, so the user is redirected to the success_url address

class LoginView(MessageMixin, auth_views.LoginView):
    form_class = AuthenticationForm
    success_message = "You have successfully logged in %(username)s"
```

Here are our views.

As you can see, the views that handle registration and login are quite short. If
something feels unnecessarily long, you're probably doing many things wrong.

Since the purpose of RegisterView is to register a new user, we can do it quickly with
`generic.CreateView`.

We could also write it using `generic.FormView`, `generic.View`, or a function-based
view, but those approaches would make the code unnecessarily long and harder to
understand — so it's always best to do things the right way.

I explained RegisterView with inline comments — check the code.

For LoginView, there's not much going on. Django already has `LoginView` built in — I
used it, provided my form_class, and added a message. That's it. Check its source if
you're interested:
[LoginView](https://github.com/django/django/blob/master/django/contrib/auth/views.py#L40)

## URLs

**urls.py**

```python
from django.contrib.auth.views import LogoutView
from django.urls import path

from apps.account.views import LoginView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
]
```

We then defined our URLs. We didn't write a separate view for logout because Django
already provides one:
[LogoutView](https://github.com/django/django/blob/master/django/contrib/auth/views.py#L107)

## Templates

Now it's time for the final steps — templates.

After form operations, we were sending messages via Django's messages framework above.
To display those messages more nicely, I use a JS library called
[toastr](https://github.com/CodeSeven/toastr). I print the messages returned by Django
into the `<head>` tag of my **base.html** template and then use JavaScript to pick them
up and display them if any exist. You'll see the relevant code below.

**custom.js**

```javascript
document.addEventListener(
  "DOMContentLoaded",
  function () {
    /* toasatr */
    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: true,
      progressBar: true,
      positionClass: "toast-bottom-right",
      preventDuplicates: false,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "5000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };
    let messages = document.head.querySelectorAll("meta[name=message]");
    for (let message of messages) {
      let tagName = message.dataset["tag"];
      let content = message.content;
      eval(`toastr.${tagName}`)(content);
    }
  },
  false
);
```

The code above sets up toastr options when the DOM loads, then looks for meta tags. If
Django has printed a message, it generates a notification based on the returned alert
type (error, warning, etc.).

**templates/base.html**

```html
{% load static %}
<!DOCTYPE html>
<html class="uk-background-muted">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"
    />
    <title>Learn Words</title>
    <meta name="description" content="Learn Word" />
    <meta name="keywords" content="english, turkish, word, learn" />
    <link rel="icon" href="{% static 'media/eating-word.svg' %}" />
    <!-- messages meta -->
    {% for message in messages %}
    <meta name="message" data-tag="" content="" />
    {% endfor %}
    <!-- jquery -->
    <script
      src="https://code.jquery.com/jquery-3.5.1.min.js"
      integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
      crossorigin="anonymous"
    ></script>
    <!-- UIkit CSS -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/uikit@3.5.6/dist/css/uikit.min.css"
    />
    <!-- UIkit JS -->
    <script src="https://cdn.jsdelivr.net/npm/uikit@3.5.6/dist/js/uikit.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/uikit@3.5.6/dist/js/uikit-icons.min.js"></script>
    <!-- toastr -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <link
      rel="stylesheet"
      type="text/css"
      href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"
    />
    <!-- custome js -->
    <script src="{% static 'custom.js' %}"></script>
  </head>
  <body class="uk-animation-scale-up uk-background-default">
    <!-- start:: header -->
    <nav class="uk-navbar-container uk-margin" uk-navbar>
      <div class="uk-navbar-left">
        <a class="uk-navbar-item uk-logo" href="#">
          <img width="60" src="{% static 'media/eating-word.svg' %}" />
        </a>
      </div>
      <div class="uk-navbar-right">
        <ul class="uk-navbar-nav">
          {% if user.is_authenticated %}
          <li class="uk-active"><a href="{% url 'logout' %}">Logout</a></li>
          {% endif %}
        </ul>
      </div>
    </nav>
    <!-- end:: header -->
    <!-- start:: body -->
    <div class="uk-card">
      <div class="uk-card-header">
        <h3 class="uk-card-title">{% block title %}{% endblock title %}</h3>
      </div>
      <div class="uk-card-body">{% block content %}{% endblock content %}</div>
      <div class="uk-card-footer">{% block footer %}{% endblock footer %}</div>
    </div>
    <!-- end:: body -->
    <!-- start:: footer -->
    <!-- end:: footer -->
  </body>
</html>
```

Above you can see **base.html**. There's not much to explain — it has 3 blocks: title,
content, and footer. When I extend base.html I use these blocks to produce a layout.
It also has JS and CSS links, and that's about it.

**templates/include/\_\_form.html**

```django
<!-- {% comment %}
        {% include 'analyst/include/__form.html' with form_url_name='' form_id="formId" method="post" form=form' %}
    {% endcomment %}
 -->
{% with button_id=form_id|add:'Button'|default:'formSubmitButton' %}
<form {% if url_name %}action="{% url form_url_name %}" {% endif %} method="" id="" class="uk-form-horizontal">
  
  {% if method|lower != "get" %} {% csrf_token %} {% endif %}
   {% for hidden_field in form.hidden_fields %} 
   {% endfor %} {% for field in form.visible_fields %}
  <div class="field" id="group_">
    {% if field.errors %}
    <ol>
      {% for error in field.errors %}
      <li><strong></strong></li>
      {% endfor %}
    </ol>
    {% endif %}
    <label class="{% for class in field.field.widget.label_classes %}{% endfor %}" for="">
      
    </label>
    <div class="uk-inline">
      {% if field.field.widget.uk_icon %}
      <span class="uk-form-icon" uk-icon=""></span>
      {% endif %} 
    </div>
    <small class="uk-text-meta uk-text-background" id="Help">
    
    </small>
  </div>
  {% endfor %}
  <button id="" type="submit" class="uk-button uk-button-primary">
    
  </button>
</form>
{% endwith %}
```

Here's a section I really like — the **\_\_form.html** template. This is a shared
template I use across all forms, slightly customized for Uikit.

The usage is written at the very top:

```django
{% include 'analyst/include/__form.html' with form_url_name='' form_id="formId" method="post" form=form' %}
```

As you can see from the usage, you can change the form's method (post, get — default is
post), swap out the default form object, change the form id, and finally specify the
form action URL with `form_url_name` (default is the current page).

**templates/registration/register.html**

```django
{% extends "base.html" %} {% block title %} Register {% endblock title %}
{% block content %}
  {% include 'include/__form.html' with buttonText="Register" %}
{% endblock content %}
{% block footer %}
<div class="ui bottom attached warning message">
  <i class="icon help"></i>
  Already signed up? <a href="{% url 'login' %}">Login here</a> instead.
</div>
{% endblock footer %}
```

The register template extends base, places the form in the content block, and tells the
user to log in if they already have an account in the footer block.

**templates/registration/login.html**

```django
{% extends "base.html" %} {% block title %} Login {% endblock title %}
{% block content %}
  {% include 'include/__form.html' with buttonText="Login" %}
{% endblock content %}
{% block footer %}
<div class="ui bottom attached warning message">
  <i class="icon help"></i>
  Do not have an account?
  <a href="{% url 'register' %}">Register Now</a>
</div>
{% endblock footer %}
```

The login page follows the same pattern.

That's all I have to cover in this topic. If there's a section you don't understand,
leave a comment and I'll update this post with a more detailed explanation. Thanks for
reading.
