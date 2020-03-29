# Django'da Clickjack Tuzağının Engeli Ve Kontrolu - Xframeoptionsmiddleware

**Clickjack** nedir ve nasıl korunulur, önlemleri nelerdir gibi daha fazla bilgiye ihtiyaç duyuyorsanız [clickjacking adındaki listeme göz atabilirsiniz.](https://github.com/hakancelik96/blog/tree/a2daa68f9fcf2b6e6dae3f9d0e8b8bfc6369c349/clickjacking/README.md)

**Django** kütüphanesinde bulunan clickjack middleware \( ara katman \) ve dekoratörler **clickjack**'e karşı kullanımı kolay koruma sağlar.

![](https://cdn.steemitimages.com/DQmTxbMupXoHhMSTNk6ydzYgTEDCu83f5fGHVqNsgJxebDc)

Django uygulamanızda **MIDDLEWARE** listesine ellemediyseniz zaten uygulamanız şuan bu açığa karşı koruma durumunda, bunu korumayı `django.middleware.clickjacking.XFrameOptionsMiddleware` Middlewar'i ile yapıyor, eğer bilmeyerek sildiyseniz hemen bunu kopyalayarak **MIDDLEWARE** bölümüne eklemelisiniz.

Varsayılan olarak **X-Frame-Options** header'i **middleware**'de **SAMEORIGIN** olarak ayarlanmış durumda olacaktır bütün Http yanıtlarında \(HttpResponse\), fakat eğer isterseniz bunu değiştirebilirsiniz.

**/settings.py** `X_FRAME_OPTIONS = 'DENY'` Yazarak gelen bütün istekleri reddedebilirsiniz.

Daha da iyisi siz sadece bazı durumlarda bütün isteklere izin versin istiyorsanız yapmanız gereken, **/views.py** dosyanızda bulunan izin vermek istediğiniz view fonksiyon veya sınıfınızda djangonun bu işlem için kullanılan dekoratörü kullanmalısınız.

## Fonksiyonel View'de Clickjacking Korumasına Müdahale Etmek.

Çok kolay **/views.py** dosyamıza `from django.views.decorators.clickjacking import xframe_options_exempt` **xframe\_options\_exempt** adlı dekoratörü dahil ediyoruz ve izin verdiğimiz fonksiyonda kullanıyoruz aşağıda bir örnek bulunmaktadır.

```python
from django.http import HttpResponse
from django.views.decorators.clickjacking import xframe_options_exempt

@xframe_options_exempt
def ok_to_load_in_a_frame(request):
    return HttpResponse("Bu sayfa herhangi bir sitede bir çerçeveye yüklemek için güvenlidir.")
```

Diğer seçenekleri de görelim,

```python
from django.views.decorators.clickjacking import xframe_options_deny, xframe_options_sameorigin, xframe_options_exempt
# @xframe_options_deny operatörü reddeder
# @xframe_options_sameorigin operatörü aynı kökene sahip sitelere izin verir.
# @xframe_options_exempt hepsine izin verir
```

## Sınıfsal \( class based \) View'de Clickjacking Korumasına Müdahale Etmek.

Burada yukarıdake ek olarak **X-Frame-Options** için yapılmış dekoretörleri kullanabilmek için `method_decorator` adında bir dekoratörü projemize dahil etmemiz gerekiyor `from django.utils.decorators import method_decorator`. bu dekoratörün amacı bütün dekoratörleri class based \( sınıfsal \) view ile kodladığımızda da kullanabilelim.

```python
# django class based
from django.views.generic.base import TemplateView
# clickjacking
from django.views.decorators.clickjacking import xframe_options_deny, xframe_options_sameorigin, xframe_options_exempt
# decorators
from django.utils.decorators import method_decorator

@method_decorator(xframe_options_exempt, name='dispatch') # dekoratörün ilk parametresine kullanmak istediğim X-Frame-Options dekoratörünü verdim ve ikinci parametre olarak bir isim verdim, işte bu kadar geri kalan kodlar zaten class based view konusuna giriyor.
class Embed(TemplateView):
    template_name = "index.html"
    def get_context_data(self,  **kwargs):
        context = super(Embed, self).get_context_data(**kwargs)
        context ["note"] = "Bu sayfa herhangi bir sitede bir çerçeveye yüklemek için güvenlidir."
        return context
```

Dekoratörü **/views.py**'in **url** adresini artık diğer siteler kullanabilir ve kendi sitelerine gömebilirler, ben bu izni sadece içerik detay sayfası için yaptım, bunu örnekleyelim

Aşağıdaki kodu bir siteye yazdığımda youtube video gömmede olduğu gibi src kısmında yazan adresi yani içeriği gömmüş olacağım.

```markup
<iframe scrolling="yes" frameborder="0" height="300px" width="100%" src="https://www.coogger.com/embed/@hakancelik96/clickjack-tuzagsaldrs-nedir/"></iframe>
```

Sonuç ;

### Yararlanılan Kaynaklar

* [Clickjacking - docs.djangoproject.com](https://docs.djangoproject.com/en/2.1/ref/clickjacking/)
* [Class based Clickjacking -  coogger \| github](https://github.com/coogger/coogger/blob/7b0b6ee13f417a16bb196366287135bb9ab1cf1e/coogger/cooggerapp/views/detail.py)

