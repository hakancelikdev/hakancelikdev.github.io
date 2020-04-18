# PR Göndermek

{% embed url="https://bugs.python.org/" caption="List of cpython\'s issues" %}

Cpython bugları yukarıdaki adreste listelenir, tartışılır ve takip edilir sizlerde CLA kaydınızı yaptıktan sonra burada yapabileceğiniz bir issue bulup onun için çalışabilirsiniz.

Bir örnek üzerinden nasıl PR atabiliriz bakalım. 

Issue olarak [https://bugs.python.org/issue29418](https://bugs.python.org/issue29418) bunu seçiyorum, issue'yi açan kişi bazı built-in methodlarının inspect kütüphanesinde bulunan isroutine fonksiyonunun False dönderdiğini söylemiş ama verdiği örnekteki 

```text
>>> inspect.isroutine(object().__str__)
False
```

```text
>>> object().__str__
<method-wrapper '__str__' of object object at 0x7fb92f30a0d0>
```

bu obje bir method-wrapper'dir bu yüzden eğer bug var ise düzeltmemiz gereken şey `inspect.isroutine` fonksiyonuna verilen obje method-wrapper olursada `True` göndermesini sağlamalıyız.

### Cpython'u Forklamak

Ne yapacağımızı öğrendiğimize göre yapacağımız ilk iş cpython'u forklamak bunun için cpython reposuna gidip fork tuşuna basın ve kendi adınıza forklayın.

{% embed url="https://github.com/python/cpython" %}

Şimdi bilgisayarınızda git konsolunuzu açın sırası ile aşağıdaki komutları çalıştırın.

```text
>>> git clone https://github.com/{username}/cpython
>>> cd cpython
>>> ./configure
>>> make
```

Şuan cpython'u klonladık ve bilgisayarımıza en güncel cpython'u kurduk bunu görmek ve en güncel cpython'u denemek için konsolu açıp.

```text
>>> cd cpython
>>> ./python.exe
Python 3.9.0a5+ (heads/master-dirty:0bae8d6f45, Apr 17 2020, 17:54:17)
[GCC 7.5.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

Ben bu yazıyı yazarken en güncel sürüm **3.9.0a5+** dür.



