---
publishDate: 2022-07-15T00:00:00Z
author: Hakan Çelik
title: "PR Göndermek"
excerpt: "CPython'a ilk katkınızı nasıl yaparsınız? Issue bulmaktan fork etmeye, düzeltme yapmaktan PR açmaya kadar adım adım gerçek bir örnek üzerinden anlattım."
category: CPython
image: ~/assets/images/blog/cpython.jpg
tags:
  - python
  - cpython
  - açık-kaynak
---

# PR Göndermek

CPython bugları [https://bugs.python.org/](https://bugs.python.org/) adresinde
listelenir, tartışılır ve takip edilir. CLA kaydınızı yaptıktan sonra burada
üzerinde çalışabileceğiniz bir issue bulup katkıda bulunabilirsiniz.

### Örnek PR

Bir örnek üzerinden nasıl PR atabiliriz bakalım.

Issue olarak [https://bugs.python.org/issue29418](https://bugs.python.org/issue29418)
bunu seçiyorum. Issue'yi açan kişi bazı
[built-in function'ların](https://docs.python.org/library/functions.html)
[inspect](https://docs.python.org/library/inspect.html) kütüphanesinde bulunan
[isroutine](https://docs.python.org/library/inspect.html#inspect.isroutine) fonksiyonunun
`False` döndüğünü söylemiş. Verdiği örnekteki:

```python
>>> inspect.isroutine(object().__str__)
False
```

```python
>>> object().__str__
<method-wrapper '__str__' of object object at 0x7fb92f30a0d0>
```

bu nesne bir `method-wrapper`'dır. Dolayısıyla düzeltmemiz gereken şey,
`inspect.isroutine` fonksiyonunun `method-wrapper` nesneleri için de `True`
döndürmesini sağlamaktır. Fonksiyonun tanımına bakalım:

> Return `True` if the object is a user-defined or built-in function or method.

Tanıma göre nesne kullanıcı tanımlı veya built-in bir fonksiyon ya da method ise
`True` dönmesi gerekir. `method-wrapper` da built-in bir method olduğundan `True`
dönmesi beklentisi yerindedir.

### CPython'u Forklamak

Ne yapacağımızı öğrendiğimize göre yapacağımız ilk iş CPython'u forklamak. Bunun için
[CPython GitHub deposuna](https://github.com/python/cpython) gidin ve sağ üstteki
**Fork** butonuna tıklayarak kendi hesabınıza forklayın.

Şimdi bilgisayarınızda git konsolunuzu açın ve sırası ile aşağıdaki komutları çalıştırın:

```bash
git clone https://github.com/{username}/cpython
cd cpython
./configure
make
```

Şu an CPython'u klonladık ve bilgisayarımıza derledik. Derlenen sürümü test etmek için:

```bash
./python.exe
Python 3.9.0a5+ (heads/master-dirty:0bae8d6f45, Apr 17 2020, 17:54:17)
[GCC 7.5.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

Ben bu yazıyı yazarken en güncel sürüm **3.9.0a5+** idi.

### Kodu Bulmak

`inspect.isroutine` fonksiyonu `Lib/inspect.py` dosyasında bulunuyor. Dosyayı açıp
ilgili fonksiyonu bulalım:

```python
def isroutine(object):
    """Return true if the object is any kind of function or method."""
    return (isbuiltin(object) or isfunction(object) or
            ismethod(object) or ismethoddescriptor(object))
```

Fonksiyon dört farklı kontrol yapıyor ancak `method-wrapper` nesneleri için herhangi
bir kontrol içermiyor. `method-wrapper` nesnelerinin hangi türe ait olduğuna bakalım:

```python
>>> type(object().__str__)
<class 'method-wrapper'>
>>> import types
>>> isinstance(object().__str__, types.MethodWrapperType)
True
```

`types.MethodWrapperType` kullanarak `method-wrapper` nesnelerini tespit edebiliyoruz.

### Düzeltmeyi Yapmak

`Lib/inspect.py` dosyasına yeni bir `ismethodwrapper` fonksiyonu ekleyip `isroutine`
fonksiyonunu güncelleyelim:

```python
def ismethodwrapper(object):
    """Return true if the object is a method-wrapper."""
    return isinstance(object, types.MethodWrapperType)


def isroutine(object):
    """Return true if the object is any kind of function or method."""
    return (isbuiltin(object) or isfunction(object) or
            ismethod(object) or ismethoddescriptor(object) or
            ismethodwrapper(object))
```

Yeni fonksiyonu modülün `__all__` listesine de eklemeyi unutmayın.

### Testi Çalıştırmak

CPython'da değişiklik yaptıktan sonra `Lib/test/test_inspect.py` dosyasına test
eklemeniz beklenir. Mevcut testlere bakarak uygun bir test ekleyin:

```python
def test_ismethodwrapper(self):
    self.assertTrue(inspect.ismethodwrapper(object().__str__))
    self.assertTrue(inspect.ismethodwrapper(object().__repr__))
    self.assertFalse(inspect.ismethodwrapper(inspect.ismethodwrapper))
    # isroutine artık method-wrapper için True döndermeli
    self.assertTrue(inspect.isroutine(object().__str__))
```

Testi çalıştırmak için:

```bash
./python.exe -m unittest Lib.test.test_inspect -v
```

Testler geçtikten sonra branch oluşturma aşamasına geçebiliriz.

### Branch Oluşturmak ve Commit Atmak

CPython'a katkı için her zaman konuya özel bir branch oluşturun; doğrudan `main`
üzerinde çalışmayın:

```bash
git checkout -b fix-isroutine-method-wrapper
```

Değişikliklerinizi ekleyip commit atın:

```bash
git add Lib/inspect.py Lib/test/test_inspect.py
git commit -m "bpo-29418: Add ismethodwrapper() to the inspect module"
```

### PR Açmak

Branch'ı kendi fork'unuza push edin:

```bash
git push origin fix-isroutine-method-wrapper
```

Ardından GitHub'da fork reponuza gidin. GitHub size otomatik olarak
**"Compare & pull request"** seçeneği sunacaktır. Tıklayıp PR'ınızı oluşturun.

PR açıklamasında şunlara dikkat edin:

- **Başlık**: `bpo-29418: Add ismethodwrapper() to the inspect module`
- **Açıklama**: Neyi düzelttiğinizi, neden düzelttiğinizi ve nasıl test ettiğinizi kısaca açıklayın
- **Issue bağlantısı**: `Fixes https://bugs.python.org/issue29418` satırını ekleyin

### Sonuç

İlk CPython PR'ınızı gönderdiniz! Core developer'ların incelemesini bekleyin; geri
bildirimlere göre değişiklik yapmanız istenebilir. Sabırlı olun — büyük bir açık
kaynak projesine katkıda bulunmak hem heyecan verici hem öğretici.

> **Not:** Bu yazı 2020 yılında yapılan bir katkı üzerinden anlatılmıştır. O tarihten bu
> yana CPython'un hata takip sistemi tamamen
> [GitHub Issues](https://github.com/python/cpython/issues)'a taşınmıştır.
> `bugs.python.org` artık yalnızca eski kayıtlar için erişilebilirdir.
