## Nedir

Sinyaller'ler kısacası bir model ve istekler ( request, response ) ile yapılan bir işlem sırasında bunu yakalamanız ve ona göre işlem yapmanızı sağlar, örneğin yeni bir user modeliniz var ve yeni bir kullanıcı kaydı olduğunda sizin user modelinizede kayıt olsun istiyorsunuz bunu sinyalleri kullanarak yapabilirsiniz.

Bütün signal olaylarının olmasını sağlayan django'nun kaynak kodlarındaki ilgili bölümler;
- [django/dispatch/dispatcher.py](https://github.com/django/django/blob/master/django/dispatch/dispatcher.py)
- [django/db/models/signals.py](https://github.com/django/django/blob/master/django/db/models/signals.py)
- [django/core/signals.py](https://github.com/django/django/blob/master/django/core/signals.py)

## Django Sinyali Oluşturma
[**django/dispatch/dispatcher.py**](https://github.com/django/django/blob/master/django/dispatch/dispatcher.py)

Aşağıdaka Django sinyal kullanımını görüyoruz, bu kodları yukarıda verdiğim kaynak adreslerinden aldım.

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

burdaki `receiver` dekorator'u nü aşağıda inceleyelim.

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

Yukarıdaki kodlarda gördüğümüz gibi eğer verdiğimiz **signal** parametresi yanı `@receiver(post_save, sender=MyModel)` bu kısımdaki `post_save` bir signal'dir ve ilk parametre bir liste değilse direk bunun alında bulunan **connect** fonksiyonuna fonksiyonumuzu ve aldığı parametreleri vererek çalıştırıyor ( yukarıdaki kodlardan `signal.connect(func, **kwargs)` bu kısım ) eğer liste girilirse `@receiver([post_save, post_delete], sender=MyModel)` bunun gibi her bir signal'in altındaki **connect** fonksiyonunu çalıştırıp
( yukarıdaki kodlardan
```python
for s in signal:
	s.connect(func, **kwargs)
```
bu kısım ) fonksiyonu ve verilen parametreleri ( `(func, **kwargs)` bu kısım ) veriyor en sonundada fonksiyonumuzu return ediyor, işte bu şekilde sinyaller yakalanmış ve çalıştırılmış oluyor.

Bu alt başlıkta django'da bulunan **built-in signal** leri kullanarak modeller için yeni sinyaller kodlayacağız.

**Built-in** sinyallerinin kodları [**django/db/models/signals.py**](https://github.com/django/django/blob/master/django/db/models/signals.py);
**built-in** gömülü olarak çevrilebilir sanırım, django ile birlikte gelen sinyallerdir denilebilir.

kaynak kodlarındada gördüğümüz üzere model sinyallerinin isimler ve aldıkları parametreler;
- django.db.models.signals.**pre_init:**
`(sender, *args, **kwargs)`

- django.db.models.signals.**post_init:**
`(sender, instance)`

- django.db.models.signals.**pre_save:**
`(sender, instance, raw, using, update_fields)`

- django.db.models.signals.**post_save:**
`(sender, instance, created, raw, using, update_fields)`
Modellerin save methodu çalıştıktan hemen sonra çalışan bir sinyaldir.

- django.db.models.signals.**pre_delete:**
`(sender, instance, using)`

- django.db.models.signals.**post_delete:**
`(sender, instance, using)`

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

Yukarıdaki kodlarda bir sinyalin oluşturulma kodlarını görüyorsunuz, django sinyali oluşturmak için bir diğer yöntem de `@receiver` decorator'ünü kullanmaktır çünkü yukarıda vermiş olduğum `@receiver` decorator'ün kodlarına baktığınızda `signal.connect(func, **kwargs)` bu şekilde işlem yaptığını görürsünüz, gördüğünüz gibi ilk yöntem ile aynı, yani bunun ile `post_save.connect(save_profile, sender=User)` yukarıda anlattığım  `receive` decorator'ü de bu şekilde yapıyordu.

```python
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()
```

## Projede Kullanımı
Projelerde signaller kullanılacak ise eğer bunun için en güzel yöntem uygulama klasörünüzün hemen altında **signals** adında bir klasör oluşturmak daha sonra signal fonksiyonlarınızı burada açacağınız python dosyalarını içine yazmak ve aşağıdaki adımları uygulamaktır. Uygulama tamamen yüklendikten sonra kodladığımız signalleri çağırırsak yüklenmiş olur, bunuda **apps.py**'yi kullanarak yapabiliriz.

Aşağıdaki adımları yaptıktan sonra işlemlerimiz tamamlanmış olacaktır.

**/myapp/__init__.py**

`default_app_config = "myapp.apps.MyAppNameConfig"`

**/myapp/signals/__init__.py**

bu dosyanızda signals klasörü altında kaçtane python dosyası oluşturduysanız ve kaç tane signals fonksiyonları oluşturduysanız onları import etmelisiniz ki **apps.py** de çağırdığımızda onlar yüklensin.

**mysignal** adında bir python dosyam ve içinde signals fonksiyonlarım olsun hepsini aşağıdaki gibi import ederim
```
from .mysignal import *
```

**/myapp/apps.py**

```python
#django
from django.apps import AppConfig

class MyAppNameConfig(AppConfig):
    name = 'MyAppNameConfig'

    def ready(self): # MyAppName isimli uygulamam hazır olduğunda
        from myapp.signals import *
		#bu satır bütün yazdıgım signalleri import edecek
```


## Request/Response Sinyalleri ( Signals )
[**django/core/signals.py**](https://github.com/django/django/blob/master/django/core/signals.py)

- django.core.signals.**request_started**:
`(sender, environ)`
- django.core.signals.**request_finished**:
`(sender, environ)`
- django.core.signals.**got_request_exception**:
`(sender, environ)`

## Yeni Django Sinyali Nasıl Oluşturulur.
### Nedir?
Yukarıda **Request/Response Sinalleri ( Signals )** ve **Models** sinyalleri dışında kendi sinyallerimizi oluşturma olayıdır.

### Nasıl Yapılır?
En yukarıda verdiğim kaynak kodları linkleri bunu anlamamız için yeterli, ancak ben size başka bir projeden örnek vererek anlatacağım.

[django-contrib-comments](https://github.com/django/django-contrib-comments) projesi kendi amaçları doğrultusunda yeni sinyal üretmiş ve bunu kullanıma sunmuş bir bakalım.

Sinyal dosyası [/django_comments/signals.py](https://github.com/django/django-contrib-comments/blob/master/django_comments/signals.py) burda gördüğümüz gibi önce `from django.dispatch import Signal` diyerek Signal sınıfını import etmiş ve 3 tane yeni signal tanımlamış bunlar, `comment_will_be_posted`, `comment_was_posted` ve `comment_was_flagged` bu sinyallerin alacağı parametreler kodlarda görünüyor `comment_was_posted = Signal(providing_args=["comment", "request"])` bu sinyalimiz comment ve request parametresini alıyormuş, birde varsayılan olarak `sender` parametremiz var.

Şimdi sıra geldi işlem gerçekleştiğinde yukarıda kodladığımız sinyali kullanarak sinyal göndermekte, onuda proje view içerisine gerçekleştirmiş.

en yukarda `from django_comments import signals` signals modülünü import etmiş ve hemen burda [/views/comments.py#L123](https://github.com/django/django-contrib-comments/blob/master/django_comments/views/comments.py#L123) `save()` methodundan sonra ( çünkü sinyal ismi comment_was_posted ( yorum yapıldı )) olduğu için.
```python
signals.comment_was_posted.send(
	sender=comment.__class__,
	comment=comment,
	request=request
)
```
yazarak sinyal göndermiş oldu, sizde amaçlarınıza yönelik bu şekilde sinyaller oluşturabilirsiniz.
