# Özel Yönetim Komutları Nasıl Yapılır

## Giriş

Django'nun bu bölümünü kullanmayan yoktur, django'yu hiç bilmeyenler ve öğrenmeye yeni başlayanlar bile ilk kullandıkları alan burasıdır proje dizininden konsolu açar ve yeni projesini kodlamaya başlamak için hemen bir proje açar `django-admin startproject mysite` ve daha sonra en sık kullanılan ilk uygulamasını komutunu kullanarak inşa eder `python manage.py startapp polls` uygulamasını biraz düzenler ve komutu ile test yayınına alır`python manage.py runserver`.

Bu içerikte, benim de henüz yeni öğrendiğim, özel yönetim komutlarının nasıl yapılacağıdır. Kendi uygulamamız için nasıl komutlar gerekiyorsa onu insa edip kullanacağız.

Aşağıda klasik bir django proje hiyerarşi'si görünmektedir

```text
mysite/
 |-- myapp/
 | |-- management/ <-- management adında dosya açıyoruz
 | | +-- commands/ <-- commands adında bir dosya açıyoruz
 | | +-- my_custom_command.py <-- çalışacak olan özel komut modülünüz
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

Yukarıdaki **my\_custom\_command** adlı django uygulamamızda özel komutumuzun çalışacak olan modüldür, dikkat ettiyseniz projede açmış olduğumuz `myapp` isimli uygulama dizini içerisindedir, django her komut'da `settings.py` dosyası içine yazdığımız apps kısmında ki uygulamaların dizinini tarar ve eğer varsa onlarında komutlarını çalıştırır, yani özel komutlarınız açmış olduğunuz django uygulamalarının içinde olmalıdır.

Burada `my_custom_command` adlı özel komutumu şu şekilde çalıştırabiliyoruz, `python manage.py my_custom_command` başka ek bir ayar yapmanız gerekmiyor.

## Örnek

Bu bölümde olayı anlamanız için ufak bir örnek yapacağız, **get\_user** isimli bir özel komut açacağım ve bu komutu yazdığımızda bize sadece 10 tane kullanıcıyı ekranda gösterecek, hepsini değil.

kullanımı `python manage.py get_user` şeklinde olacak bildiğiniz gibi

**/management/commands/get\_user.py**

```python
# django
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

# BaseCommand sınıfıni miras alarak kendi özel komutumuzu yapıcağız.
# User sınıfı zaten bildiğiniz gibi django'da bulunan varsayılan olarak gelen user modelidir.


class Command(BaseCommand): # sınıf ismimiz Command olmalı
 help = "Use and get 10 users"

 def handle(self, *args, **kwargs):
 for user in User.objects.all()[:10]:
        self.stdout.write(user)
```

Sınıf izmimiz **Command** olmalı ve **BaseCommand** sınıfını miras almalıyız ve **handle** fonksiyonunda komutumuzun çıktısı tamamlanmalı, **self.stdout.write** ile de çıktılarımızı yolluyoruz farklı renklerde mevcut, ilerde değineceğim.

Çalıştırıp sonucu görelim

![django-manage-command.png](https://www.coogger.com/media/images/django-manage-command.png?style=center)

## Komutumuza Argüman Ekleyelim

Django Python'un standart kütüphanesi olan [argparse](https://docs.python.org/3/library/argparse.html) 'yi kullanıyor yani komutlarımıza argüman eklemek için bu kütüphanenin özelliklerini kullanmalıyız ve bunu sınıfımıza `add_arguments` adlı bir fonksiyon ekleyerek yapacağız.

Geçen örnekte kendisi 10 tane kullanıcı veriyordu ama şimdi bizim argüman olarak girdiğimiz sayı kadar çıktı vermesini sağlayacağız.

**/management/commands/get\_user.py**

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

Kullanımı `python manage.py get_user 2` çıktı;

![django-manage-command.png](https://www.coogger.com/media/images/django-manage-command_1.png?style=center)

## İsteğe Bağlı Argümanlar

Yine aynı örnek üzerinden devam edelim ve isteğe göre argümanları anlayalım.

**/management/commands/get\_user.py**

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

Kullanımı;

* `python manage.py get_user --hmany 3`
* `python manage.py get_user` veya isterseniz kullanmayabilirsiniz

istegöre argümanları sadece `--` bu işareti yazarak yaptık, ben hem 1 argüman ekledim fakat siz isterseniz birden fazla argüman ekleyebilirsiniz veya **/management/commands/** bu adres altına diğer özel kod modülünüzü yazabilirsiniz.

> Not; Daha güzel kullanımlar için argparse kütüphanesini incelemeyi unutmayın.

## Yönetim Komutlarında Tanımlı Sitilleri

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

## İncele

* [Django'nun özel yönetim komutları](https://github.com/django/django/tree/master/django/core/management/commands)
* [Django Döküman - custom-management-commands](https://docs.djangoproject.com/en/2.1/howto/custom-management-commands/)

