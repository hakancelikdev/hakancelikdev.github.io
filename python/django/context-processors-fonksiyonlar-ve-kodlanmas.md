# Context Processors Fonksiyonları Ve Kodlanması

## Nedir ?

**context\_processors**, template render edildiğinde bağlamı doldurmak için kullanılan, çağrılabilir bir python yolu listesidir. Bu çağrılabilirler, _request_ nesnesini argüman olarak alır ve bağlama birleştirilerek itemler dict olarak döndürülür.

## Settings.py Dosyamızdaki Context Processors'ler

**/settings.py içinde**

```python
context_processors=[
    'django.template.context_processors.debug',
    'django.template.context_processors.request',
    'django.contrib.auth.context_processors.auth',
    'django.contrib.messages.context_processors.messages',
],
```

yukarıda gördüğünüz 4 tane **context\_processors** vardır, öncelikle bunların ne işe yaradıklarından bahsedelim zaten django kodlayan biri kesinlikle yukarıdaki **context\_processors**'leri kullanmış ve ne işe yaradığını biliyordur, biz kısaca bahsedip geçelim ve daha sonra bir tane de biz yazalım.

### Request

Yapılan isteklere ait bilgileri döndürür, bir HttpRequest nesnesidir.

Her **RequestContext** içinde request değişkeni bulunur zaten buda anlık **HttpRequest** nesnesidir.

### Debug

Hata ayıklamak için yardımcı bağlam değişlenlerini döndürür, sadece `DEBUG = TRUE` iken çalışır.

### Auth

Template içinde kullanıcı bilgilerine erişmemizi sağlar, örneğin;

```markup
{{ user.username }}
```

kullanıcı eğer bilinmeyen bir kullanıcı ise `AnonymousUser` döndürür.

### Messages

Bir mesaj listesidir ve djangonun mesajlar \( messages \) framework aracılığı ile gönderilir.

Aşağıdaki işlemleri yaparak kullanıcılara mesaj vermemizi sağlar.

```python
from django.contrib import messages
messages.add_message(request, messages.INFO, 'Hello world.')

messages.debug(request, '%s SQL statements were executed.' % count)
messages.info(request, 'Three credits remain in your account.')
messages.success(request, 'Profile details updated.')
messages.warning(request, 'Your account expires in three days.')
messages.error(request, 'Document deleted.')
```

**Template içinde**

```markup
{% if messages %}
<ul class="messages">
    {% for message in messages %}
    <li{% if message.tags %} class="{{ message.tags }}"{% endif %}>{{ message }}</li>
    {% endfor %}
</ul>
{% endif %}
```

şeklinde kullanmamızı sağlar.

ilgili döküman; [https://docs.djangoproject.com/en/2.2/ref/contrib/messages/](https://docs.djangoproject.com/en/2.2/ref/contrib/messages/)

## Context Processors Kaynak Kodları

Yukarıdaki **context\_processors**'lerin içinde iki tane _debug_ ve _request_'in kodlarına bakalım bir.

**django.template.context\_processors'ın kaynak kodları**

```python
import itertools
from django.conf import settings

def debug(request):
    """
    Return context variables helpful for debugging.
    """
    context_extras = {}
    if settings.DEBUG and request.META.get('REMOTE_ADDR') in settings.INTERNAL_IPS:
        context_extras['debug'] = True
        from django.db import connections
        # Return a lazy reference that computes connection.queries on access,
        # to ensure it contains queries triggered after this function runs.
        context_extras['sql_queries'] = lazy(
            lambda: list(itertools.chain.from_iterable(connections[x].queries for x in connections)),
            list
        )
    return context_extras

def request(request):
    return {'request': request}
```

Gördüğünüz gibi yukarıda iki tane _context\_processors_ fonksiyonumuz var bunlar django'nun kendi _context\_processors_ lerinden bazıları, yukarıdaki kodlara bakınca aslında bir _context\_processors_ nasıl yazılır onuda görmüş ve öğrenmiş oluyoruz, normal bir fonksiyondan farkı yok, fonksiyonunuzu yazıyor, parametre olarak sadece request \( HttpRequest \) nesnesini alıyor, ve dict tipinden döndürüyor \( döndürme eylemi dict tipinde olmalı \) ve yazdığınız _context\_processors_'ın konumunu **settings.py** de bulunan _context\_processors_ listesine ekliyorsunuz bitti artık sizde herhangi bir yerde yazdığınız _context\_processors_'e erişip kullanabilirsiniz bu kadar.

## Kendi Context Processors Fonksiyonumuzu Yazalım

**/myapp/contenxt\_processors/hello.py**

```python
def say_hello(request):
    return dict(hello="hello")
```

fonksiyonumuz basit'te olsa yazsık, şimdi sırada **settings.py** dosyamıza bunun yolunu eklemek.

**/settings.py içinde**

```python
context_processors=[
    'django.template.context_processors.debug',
    'django.template.context_processors.request',
    'django.contrib.auth.context_processors.auth',
    'django.contrib.messages.context_processors.messages',
    "myapp.contenxt_processors.hello.say_hello"
],
```

bu kadar şimdi aşağıdaki gibi yaparak bunu her templatimizde gösterebiliriz.

```markup
{{ say_hello }}
```

