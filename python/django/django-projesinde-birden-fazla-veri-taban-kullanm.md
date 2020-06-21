# Django Projesinde Birden Fazla Veri Tabanı Kullanımı

#### Neler öğreneceğiz ?

- django ile birden fazla veri tabanı kullanımını
- django ile uygulama oluşturmayı
- ziyaretçilerin ip adreslerini bulmayı öğreneceğiz
- **from django.db.models import F** kullanımını öğreneceğiz.

#### Gerekenler

- python3
- django 1.11
- Virtualenv

Virtualenv için bilgiye ihtiyacınız varsa şu adresi inceliyebilirsiniz.
[Virtualenv](https://steemit.com/utopian-io/@tolgahanuzun/what-is-virtualenv-and-how-is-it-used-tr-virtualenv-nedir-ve-nasil-kullanilir)

Yukarıda verdiğim adresten Virtualenv kurulumunu ve gerekli paketleri requirements'leri
kurun.

\[===========\]

Neden birden fazla veri tabanı kullanımı yapayım diye soruyor iseniz size şöyle bir
örnekle açıklayabirim, ben
[coogger.com](https://github.com/hakancelik96/blog/tree/a2daa68f9fcf2b6e6dae3f9d0e8b8bfc6369c349/django/www.coogger.com)
'da içeriklerin okunma sayısını ziyaretçilerden gelen ip adresleri ilgili içeriğin id
numarasi ile birlikte kayıt ediyorum ve kişi daha önceden okumuş ise yani şuan okuduğu
içeriğin id numarası ve o kişinin ip adresi daha önceden kayıt edilmiş ise okuma
sayısını 1 arttırmıyorum şimdi birde diğer veriler bu veri tabanına kayıt oluyor ve ip
adresler bana çokta lazım değil diğer verilerin yanında örneğin kullanıcı bilgileri
paylaşılan içerikler yararlı fakat ip adresler yararlı değil hemde çok fazla kayıt
gerçekleşiyor işte bu iki yararlı ve yararsız verileri bir birinden ayırmak için birden
fazla veri tabanı ayarladım şimdi bunu yapalım hep birlikte.

### Öncelikle neye ihtiyacımız var ?

Şimdi sizin zaten bir tane django projeniz hali hazırda olması gerek içinde myapp olarak
bir tane uygulamanız var diyelim settings.py dosyanızda ki veri tabanı ayarı kısmı şu
şekildedir.

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'sqlite3'),
    },
}
```

doğrumu doğru. şimdi myapp adındaki uygulama dizinize gelin ve yeni bir uygulama
oluşturmak için konsolu açıp şunu yazın.

```python
python3 manage.py startapp multiapp
```

şimdi yeni bir uygulamamız oluştu. Tekrar settings.py adresine gelin ve şöyle yapın.

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

oluşturduğumuz yeni uygulamamızı INSTALLED_APPS bölümüne ekledik ve ikinci veri
tabanımızı ayarladık. **DATABASE_APPS_MAPPING** bu kısım hangi uygulamanın hangi veri
tabanını kullanacagını seçmemizde bize yardımcı olacak.

**multiapp/models.py adresine gidin** ve ziyaratçilerden alacağımız ip adreslerin kaydı
için bir model yazalım tıpkı şöyle.

```python
from django.db import models
from myapp.models import Blog

class Blogviews(models.Model):
    content = models.ForeignKey(Blog ,on_delete=models.CASCADE)
    ip = models.GenericIPAddressField() # ve ip adres için olan alanımız

    class Meta:
        app_label = 'multiapp'
```

myapp adındakı uygulamanızda blog adında bir modeliniz var foreignkey ile bunu blog
modelinize bagladık **app_label = 'multiapp'** işte bu kısım ayarlarda ayarladıgımız
**DATABASE_APPS_MAPPING** kısmında ki verilen veri tabanı ismini yazarak bizim hangi
veri tabanını kullanacagımız belirleniz ve biz burda diyoruz ki bu model bu
app\(uygulama\) multiapp olan veri tabanını kullanacak bu veri tabanıda **multidb**
şimdi de ip adresimizi alalım **myapp/views.py** adresine gidin ve şu kodları yazın.

```python
from django.db.models import F
from multiapp.models import Blogviews

def up_blog_view(request,queryset):
    try:
        ip = request.META["HTTP_X_FORWARDED_FOR"].split(',')[-1].strip()
    except:
        ip = None
    if ip is None:
        return False
    if not Blogviews.objects.filter(blog = queryset,ip = ip).exists():
        Blogviews(content = queryset,ip = ip).save()
        queryset.views = F("views") + 1
        queryset.save()
```

**up_blog_view** adında bir fonksiyon yazdık ve iki parametre atadık bunlar birisi gelen
istek diğeri ise gelen queryset yanı gelen Blog verisi.
**request.META\["HTTP_X_FORWARDED_FOR"\].split\(','\)\[-1\].strip\(\)** bu kısımda gelen
isteğin ip adresini aldık ve eğer None değil ise **Blogviews** bağlandık **exists\(\)**
ile nesnenin daha önceden kaydı yapılmışmı yapılmamışmı ona baktık eğer yapılmamış ise
yeni kayıt oluşturduk ve **F\("views"\) + 1** kısmı ile izlenmeyi bir arttırdık sonra
save\(\) ledik.

### Bu fonksiyonu nasıl kullanacagız ?

myapp/views.py ı acın ve şöyle yazın.

```python
from multiapp.views import up_content_view
from models import Blog

def home(request,id):
    queryset = Blog.objects.filter(id = id)[0]
    up_content_view(request,queryset)
```

işte buna benzer bir kullanım ile bu arada Blog modelinizde izlenme sayılarını tutan
integer bir field açmanız gerek views adında.

son aşamalara geldik. Bütün herşey tamam şimdi veritabanı sekranizasyonu var kodlar şu
şekilde olmalı

```python
python3 manage.py migrate --database multi
python3 manage.py makemigrations multiapp
python3 manage.py migrate
python3 manage.py makemigrations myapp
```

## multiapp/admin.py

```python
from django.contrib.admin import ModelAdmin,site
from multiapp.models import Blogviews

class ViewsAdmin(ModelAdmin):
    list_ = ["content_id","ip"]
    list_display = list_
    list_display_links = list_
    search_fields = list_

site.register(Blogviews, ViewsAdmin)
```

## sonuç ?

![birden_fazla_veri_tabani](https://www.coogger.com/media/images/birden_fazla_veri_tabani.png)

![birden_fazla_veri_tabani](https://www.coogger.com/media/images/birden_fazla_veri_tabani_Rfated5.png)
