Bu yazımda

# PR Göndermek

CPython bugları [https://bugs.python.org/](https://bugs.python.org/) adresinde
listelenir, tartışılır ve takip edilir sizlerde CLA kaydınızı yaptıktan sonra burada
yapabileceğiniz bir issue bulup onun için çalışabilirsiniz.

### Örnek PR

Bir örnek üzerinden nasıl PR atabiliriz bakalım.

Issue olarak [https://bugs.python.org/issue29418](https://bugs.python.org/issue29418)
bunu seçiyorum, issue'yi açan kişi bazı
[built-in functionların](https://docs.python.org/library/functions.html)
[inspect ](https://docs.python.org/library/inspect.html)kütüphanesinde bulunan
[isroutine ](https://docs.python.org/library/inspect.html#inspect.isroutine)fonksiyonunun
False dönderdiğini söylemiş ama verdiği örnekteki

```python
>>> inspect.isroutine(object().__str__)
False
```

```python
>>> object().__str__
<method-wrapper '__str__' of object object at 0x7fb92f30a0d0>
```

bu obje bir method-wrapper'dir bu yüzden eğer bug var ise düzeltmemiz gereken şey
`inspect.isroutine` fonksiyonuna verilen obje method-wrapper olursada `True`
göndermesini sağlamalıyız. Peki bu bulduğumuz bug, **isroutine** fonksiyonunun tanımına
uyuyor mu onada bakalım.

> Return `True` if the object is a user-defined or built-in function or method.

bu tanımda nesne eğer kullanıcı tanımlı veya built-in fonksiyonları veya method ise
`True` döndermesi gerekmektedir demiş. Sanırım bu durumda objec method-wrapper ise de
`True` göndermesi gerek.

### CPython'u Forklamak

Ne yapacağımızı öğrendiğimize göre yapacağımız ilk iş CPython'u forklamak bunun için
CPython reposuna gidip fork tuşuna basın ve kendi adınıza forklayın.

{% embed url="https://github.com/python/cpython" %}

Şimdi bilgisayarınızda git konsolunuzu açın sırası ile aşağıdaki komutları çalıştırın.

```bash
>>> git clone https://github.com/{username}/cpython
>>> cd cpython
>>> ./configure
>>> make
```

Şuan CPython'u klonladık ve bilgisayarımıza en güncel CPython'u kurduk bunu görmek ve en
güncel CPython'u denemek için konsolu açıp.

```bash
>>> cd cpython
>>> ./python.exe
Python 3.9.0a5+ (heads/master-dirty:0bae8d6f45, Apr 17 2020, 17:54:17)
[GCC 7.5.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

Ben bu yazıyı yazarken en güncel sürüm **3.9.0a5+** dür.
