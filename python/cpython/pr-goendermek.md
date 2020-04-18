# PR Göndermek

{% embed url="https://bugs.python.org/" %}

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



