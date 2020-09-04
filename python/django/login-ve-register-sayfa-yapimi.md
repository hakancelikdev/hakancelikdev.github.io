Bu yazımda sayfaların tasarımı için css yazmak yerine [Uikit](https://getuikit.com/)
adında front-end framework'u kullanacağım ve bu yazımda kullandığım kodlar
[Eatingword](https://github.com/hakancelik96/eatingword) adında Django bilgimi taze
tutmak ve yeni şeyler öğrenmek amacı ile geliştirdiğim projeden alıyorum, şuan için
proje private, hazır olduğu zaman public yapacağım.

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

`UikitFormMixin` mixinine şöyle bir baktığınızda aslında ne amaç ile yazıldığını
anlayabilirsiniz, ben yinede kısaca bahsedeyim.

Bir form class'ınıza bu class'ı miras aldığınız zaman, önce form'u çalıştırıyor, sonra
bu çalışıyor ve bir önceki formda oluşan alanları ( field ) for döngüsü ile alıp her
birinin `widget` inin tipine ( type ) bakıyor daha sonra gelen tiplere uygun `uikit`
class atamalarını yapıyor ve field name'e gçre de icon isimlerini atıyor daha sonra bu
atamaları **\_\_form.html** dosyamızda kullanarak gelen her formu uikit tasarımına sahip
bir forma dönüştürmüş olacağız.

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

Bakın bu form classlarımda tanımlarken `UikitFormMixin` class'ımı miras aldım, o classs
oto bir şekilde form alanlarımı uikit için hazır hale getiriyor.

Burada neden direkt `from django.contrib.auth import User` böyle yapıp `User` modelini
almak yerine `from django.contrib.auth import get_user_model` `get_user_model` 'ını
alıp, onu kullandım ?

sebebi şu arkadaşlar
[User Modelini Genişletmek](python/django/user-modelini-genisletmek.md) adında bir yazı
yazmıştım siz bu yazımda bahsettiğim yöntemlerden biri olan `AbstractBaseUser` class'ını
miras ( inherit )'ını alıp user modelinizi bu şekilde oluşturduysanız o modeli almak
için, oluşturmadıysanız zaten `User` modelini dönderiyor. Bu sayede user modeliniz nasıl
olursa olsun uyumlu bir form çıkartmış oluyorsunuz.

Daha sonra zaten Django'da UserCreationForm hazır bir halde var, bu formu Django admin
sayfasında siz bir user create ederken kullanıyor, bizde kendi register sayfamız için
kullanacağız var olan bir şeyi baştan yazmamıza gerek yok. Bu formun kodlarını inceleyin
mutlaka ben sizlere link bırakayım
[UserCreationForm](https://github.com/django/django/blob/master/django/contrib/auth/forms.py#L82)

Sonra aynı şekilde kullanıcı giriş formu yine Django'da var biz aynı formu kullanacağız
ama uikit tasarımına uygun olması gerekiyor bu yüzden sadece `UikitFormMixin`' i miras
aldık ve bu kadar, formlarımız hazır.

Yine aynı şekilde AuthenticationForm'un kodlarını incelemeniz için link bırakıyorum
[AuthenticationForm](https://github.com/django/django/blob/master/django/contrib/auth/forms.py#L173)

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
    template_name = "registration/register.html"
    success_url = reverse_lazy("wordapp:index")
    form_class = RegisterForm
    success_message = "You have successfully registered %(username)s"

    def form_valid(self, form):
        response = super().form_valid(form)
        if user := authenticate(
            self.request,
            username=self.object.username,
            password=self.object.password,
        ):
            login(self.request, user)
        else:
            messages.error(self.request, "Could not login")
        return response


class LoginView(MessageMixin, auth_views.LoginView):
    form_class = AuthenticationForm
    success_message = "You have successfully logged in %(username)s"
```

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
    <meta name="message" data-tag="{{message.tags}}" content="{{ message }}" />
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
    <script src="{% static 'js/custom.js' %}"></script>
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
        <h3 class="uk-card-title">
          {% block title %}{% endblock title %}
        </h3>
      </div>
      <div class="uk-card-body">
        {% block content %}{% endblock content %}
      </div>
      <div class="uk-card-footer">
        {% block footer %}{% endblock footer %}
      </div>
    </div>
    <!-- end:: body -->
    <!-- start:: footer -->
    <!-- end:: footer -->
  </body>
</html>
```

**templates/include/\_\_form.html**

```
<!-- {% comment %}
        {% include 'analyst/include/__form.html' with form_url_name='' form_id="formId" method="post" form=form' %}
    {% endcomment %}
 -->
{% with button_id=form_id|add:'Button'|default:'formSubmitButton' %}
<form {% if url_name %}action="{% url form_url_name %}" {% endif %} method="{{ method|default:'POST' }}" id="{{ form_id|default:'formSubmitButton' }}" class="uk-form-horizontal">
  {{ form.media }}
  {% if method|lower != "get" %} {% csrf_token %} {% endif %}
  {{ form.non_field_errors }} {% for hidden_field in form.hidden_fields %} {{ hidden_field.errors }}
  {{ hidden_field }} {% endfor %} {% for field in form.visible_fields %}
  <div class="field" id="group_{{ field.html_name }}">
    {% if field.errors %}
    <ol>
      {% for error in field.errors %}
      <li><strong>{{ error|escape }}</strong></li>
      {% endfor %}
    </ol>
    {% endif %}
    <label class="{% for class in field.field.widget.label_classes %}{{ class }}{% endfor %}" for="{{ field.auto_id }}">
      {{ field.label }}
    </label>
    <div class="uk-inline">
      {% if field.field.widget.uk_icon %}
      <span class="uk-form-icon" uk-icon="{{ field.field.widget.uk_icon }}"></span>
      {% endif %} {{ field }}
    </div>
    <small class="uk-text-meta uk-text-background" id="{{ field.id_for_label }}Help">
    {{ field.help_text|safe }}
    </small>
  </div>
  {% endfor %}
  <button id="{{button_id}}" type="submit" class="uk-button uk-button-primary">
    {{ buttonText|default:"Submit" }}
  </button>
</form>
{% endwith %}
```

**templates/registration/register.html**

```
{% extends "base.html" %} {% block title %} Register {% endblock title %}
{% block content %} {% include 'include/__form.html' with buttonText="Register" %}
{% endblock content %} {% block footer %}
<div class="ui bottom attached warning message">
  <i class="icon help"></i>
  Already signed up? <a href="{% url 'login' %}">Login here</a> instead.
</div>
{% endblock footer %}
```

**templates/registration/login.html**

```
{% extends "base.html" %} {% block title %} Login {% endblock title %} {% block content
%} {% include 'include/__form.html' with buttonText="Login" %} {% endblock content %} {%
block footer %}
<div class="ui bottom attached warning message">
  <i class="icon help"></i>
  Do not have an account?
  <a href="{% url 'register' %}">Register Now</a>
</div>
{% endblock footer %}
```
