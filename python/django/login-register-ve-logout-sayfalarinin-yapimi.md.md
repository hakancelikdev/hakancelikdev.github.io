# Login, Register ve Logout Sayfalarının Yapımı

Bu yazımda sayfaların tasarımı için css yazmak yerine [Uikit](https://getuikit.com/)
adında front-end framework'u kullanacağım ve bu yazımda kullandığım kodlar
[Eatingword](https://github.com/hakancelik96/eatingword) adında Django bilgimi taze
tutmak ve yeni şeyler öğrenmek amacı ile geliştirmekte olduğum projemden alıyorum, şuan
için proje gizli durumda, hazır olduğu zaman
[MIT lisansı](https://en.wikipedia.org/wiki/MIT_License) ile paylaşacağım.

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

`UikitFormMixin` mixinine şöyle bir baktığınızda aslında ne amaç ile yazıldığını
anlayabilirsiniz, ben yinede kısaca bahsedeyim.

Bir form sınıfımıza bu sınıfı miras aldığınız zaman, önce form'u çalıştırıyor, sonra bu
çalışıyor ve bir önceki formda oluşan alanları for döngüsü ile alıp her birinin `widget`
inin tipine bakıyor daha sonra gelen tiplere uygun `uikit` sınıf atamalarını yapıyor ve
alan isimlerine göre de icon isimlerini atıyor daha sonra bu atamaları **\_\_form.html**
şablonumuzu kullanarak gelen her formu uikit tasarımına sahip bir forma dönüştürmüş
olacağız.

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
yazmıştım size bu yazımda bahsettiğim yöntemlerden biri olan `AbstractBaseUser` sınıfını
miras alıp kullanıcı modelinizi bu şekilde oluşturduysanız o modeli dönderir ,
oluşturmadıysanız zaten varsayılan olan `User` modelini dönderiyor. Bu sayede user
modeliniz nasıl olursa olsun uyumlu bir form çıkartmış oluyorsunuz.

Daha sonra zaten Django'da `UserCreationForm` hazır bir halde var, bu formu Django admin
sayfasında siz bir kullanıcı oluşturduğunuzda kullanıyor, bizde kendi kayıt ol sayfamızı
yazarken kullanacağız. Bu formun kodlarını inceleyin mutlaka ben sizlere link bırakayım
[UserCreationForm](https://github.com/django/django/blob/master/django/contrib/auth/forms.py#L82)

Sonra aynı şekilde kullanıcı giriş formu yine Django'da var biz aynı formu kullanacağız
ama uikit tasarımına uygun olması gerekiyor bu yüzden sadece `UikitFormMixin`' i miras
aldık ve bu kadar, formlarımız hazır. Yine aynı şekilde AuthenticationForm'un kodlarını
incelemeniz için link bırakıyorum
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

Bu sınıfımız ile de form işlemleri sonrası form başarılı şekilde geçerli olursa başarılı
mesajını, geçersiz olursa form geçersiz mesajını, vermek için kullanacağız.

Bu view'i kullanmak için ilgili sınıf tabanlı view'imize miras almamız yeterli
olacaktır, eğer isterseniz `success_message` niteliği ile başarılı mesajını kendiniz
belirleyebilirsiniz.

Djangoda başarılı mesajı için zaten `SuccessMessageMixin` adlı bir sınıf var ben
yukarıda bunu miras alarak hem onu hemde form geçersiz oldugunda mesaj iletsin diye
böyle bir sınıf yazdım.

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
    template_name = "registration/register.html" # get isteği sonrası render edilecek olan şablonumuz
    success_url = reverse_lazy("wordapp:index") # form geçerli olur ve herhangi bir sıkıntı çıkmaz ise bu adrese yönlenecek
    form_class = RegisterForm # form sınıfımız
    success_message = "You have successfully registered %(username)s" # form geçerli olursa tanımlı olan success_url'e yönlenmeden önce messages ile gönderilecek olan mesaj

    def form_valid(self, form):
        # tanımlı form_class'ımız post isteği sonrası geçerli olduğu zaman çalışacak olan fonksiyon
        response = super().form_valid(form) # formu kayıt edip yukarıda tanımlı olan success_url'e yönlenecek olan responsu alıyoruz.
        if user := authenticate( # self.object si super().form_valid(form) sırasında kayıt olan formun dönderdiği nesnedir yanı kayıt olan kullanıcımızdır.
            self.request,
            username=self.object.username,
            password=self.object.password,
        ): # burada başarılı bir kullanıcı girişi var ise bize o kullanıcıyı döndürecek, python 3.8 ile gelen := walrus operatürü ile bunu alıyoruz.
            login(self.request, user) # burada dönen kullanıcının giriş yapmasını sağlıyoruz.
        else:
            messages.error(self.request, "Could not login") # user false dönerse, mesaj gönderiyoruz
        return response # yukarıda bize dönen cevabı döndüyoruz, bu sayede kullanıcı success_url tanımlı adrese yönleniyor.


class LoginView(MessageMixin, auth_views.LoginView):
    form_class = AuthenticationForm
    success_message = "You have successfully logged in %(username)s"
```

Geldik viewlerimize

Kayıt olmak ve giriş yapmamızı sağlayan viewlerimiz yukarıda da gördüğünüz gibi oldukça
kısa, bir şeyler gereksizce uzun ise bir çok şeyi yanlış yapıyorsunuzdur.

Register view'imizın amacı yeni bir kullanıcı kayıt etmek olduğu için bunun
`generic.CreateView` kullanarak hızlı bir şekilde yapabiliriz.

Burada `generic.FormView`, `generic.View` veya fonksiyonel bazlı yazarakta yapabiliriz
ama bu yöntemlerden biri ile yazmayı tercih edersek gereksizce kod uzun, anlaşılması zor
olacaktır bu yüzden en doğru şekilde yapmaya çalışmak her zaman iyidir.

RegisterView'ı yorum satırları ile anlattım, kodlardan kontrol edebilirsiniz.

LoginView de ise çok bir şey yok, Djangoda zaten `LoginView` var bende onu kullanarak
kendi view'imi yazdım form_class'ımı verdim, birde mesajı verdim bu kadar, kodları
incelemek isterseniz
[LoginView](https://github.com/django/django/blob/master/django/contrib/auth/views.py#L40)

## Urls

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

Daha sonra urllerimiz tanımladık, çıkış işlemi için tekrardan bir view yazmadık cunku
Django'da var zaten,
[LogoutView](https://github.com/django/django/blob/master/django/contrib/auth/views.py#L107)

## Templates

Şimdi sıra geldi son adımlarımıza, templateler.

Form işlemleri sonrası Django messages framework'u ile mesaj yolluyorduk yukarıda, ben o
mesajları daha güzel göstermek adına [toastr](https://github.com/CodeSeven/toastr)
adında bir JS lib'i kullanıyorum, Django ile dönen mesajları **base.html** template'imin
head etiketi içine basıp daha sonra js ile çekip mesaj var ise gösteriyorum, ilgili
kodları aşağıda göreceksiniz.

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

Yukarıdaki kod ile DOM yüklendiği zaman toastr ayarlarını yapıp meta etiketine bakıyor
eğer Django mesaj basmış ise dönen uyarı tipine ( error, warning, vs ) göre bildirim
üretiyor.

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

Yukarıda **base.html** dosyasını görüyorsunuz, anlatacak çok bir şey yok aslında, title,
content, footer adında 3 blogum var, base.html dosyamı genişleteceğim zaman onları
kullanarak bir tasarım çıkartıyorum, JS, CSS linkleri vs var o kadar.

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

Geldik sevdiğim bir kısma **\_\_form.html** şablona bu şablon bütün formlarda
kullanacağım ortak bir şablondur, uikit'e göre biraz düzenledim.

Kullanımınıda en yukarıya yazmışım

```
{% include 'analyst/include/__form.html' with form_url_name='' form_id="formId" method="post" form=form' %}
```

Kullanımda da gördüğünüz gibi formun method'unu ( post, get ) varsayılan post,
değiştirebiliyorsunuz, varsayılan form olan form nesnenizi değiştirebiliyorsunuz, form
id'nizide değiştirebiliyorsunuz ve son olarak varsayılan olarak bulunduğunuz sayfa olan
form action'ı `form_url_name` ile belirleyebiliyorsunuz.

**templates/registration/register.html**

```
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

Kayıt ol şablonumuz burada base'i genişletip content kısmına form'u verip footer
kısmında eğer hesabı varsa login yapmasını söylemişim.

**templates/registration/login.html**

```
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

Login sayfasıda aynı şekilde.

Bu konuda anlatacaklarım bu kadar, anlaşılmayan bir bölüm var ise bana telegramdan
yazabilirsiniz bende bu yazıyı güncelleyerek o başlığı daha detaycı anlatmaya çalışırım,
okuduğunuz için teşekkürler.
