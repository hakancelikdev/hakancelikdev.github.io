Merhaba arkadaşlar bildiğiniz gibi django da belirli özelliklere sahip bir user modelimiz var bu model'de isim,soy isim,email,şifre vb bilgiler mevcut bu bilgiler çoğu zaman hayat kurtarsada bazı durumlarda yeterli olmuyor ve bizlerin yapmakta olduğu projeye göre  kullanıcların daha fazla özelliklere sahip olması gerekiyor işte burda yapmak istediğimiz olayı kullanıcı modelini genişleterek elde edeceğiz bu olayada genişletme ( extend ) deniyor hadi başlayalım

### Nedir ?

Django da varsayılan olarak gelen user modeline yeni özellikler eklenmesine genişletme diyoruz.

### Nasıl Genişler bu User Modeli

Aslında genişletmemizi sağlıyan 4 tane seçenek var elimizde kısaca onların ne olduğuna değinip bu gün anlatacağımız olaya geçelim.

-  Proxy modelini kullanarak yapılan

> Veri tabanı içinde yeni bir tablo oluşturmadan modeli miras alarak yapılan olaya proxy model deniyor,mevcut bir veritabanı şemasını etkilemeden mevcut bir modelin davranışını değiştirmek için kullanılır.

  -  Kullanıcı modeli ile One-To-One bağlantısı kurarak

> Çalışma prensibi şu,kendi veri tablosuna sahiptir ve farklı bir model aracılığı ile  bire bir ( one-to-one ) bağlıdır.

örnek vermek gerekirse user modeli içindeki user id 'sini alıp yeni oluşturduğumuz tabloya user_id olarak ekliyor ve yeni oluşan tabloya bu id altında bilgiler ekleniyor mesela user_id 'si 4 olan kullanıcının telefon numarası adlı tablosuna gelen veriyi ekler ve biz veriyi çekmek istersek önce user_id den değeri alır ve bu değer User modelinde hangi kullanıcıya denk geldiğini bulur işlem bu şekilde devam eder.

- AbstractBaseUser'yi Genişleten Özel Bir User model oluşturarak

> AbstractBaseUser'dan devralınan tamamen yeni bir User modelidir, settings.py den bir kaç değişiklik yapmayı gerektirir ve bu projenin başında yapılmalıdır, çünkü veritabanı şemasını önemli ölçüde etkileyecektir hatalar içinde can vermemek için projeye başlamadan önce yapılması tavsiye edilir .

-   AbstractUser 'ı genişleterek yeni bir özel User modeli yapmak

> Hemen bir üste söylediğim şeyler bunun içide geçerli o yüzden hemen geçiyorum dikkat !
Peki sen hangisini anlatacaksın ?

Kolay ve hemen kavranabilen one-to-one olayını anlatacağım.
[coogger](www.coogger.com)'ın kodlarını kullanarak açıklayacağım
önce projenize eklemediyseniz **models.py** içine şu User modeli'ni dahil edelim

```python
from django.contrib.auth.models import User
```
Bu django'nun bize hazır olarak verdiği user modelidir ve şimdi biz bu user modeline eklenmesi gereken diğer kullanıcı bilgilerini projenize göre şekillendirin ve eklemeler yapın.

```python
class UserProfile(models.Model): # kullanıcıların diğer bilgileri
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    pp = models.BooleanField(default = False,verbose_name = "profil resmi")
    is_author = models.BooleanField(default = True, verbose_name = "yazar olarak kabul et")
    author = models.BooleanField(default = True, verbose_name = "yazarlık başvurusu")
    about = RichTextField(null = True, blank = True,verbose_name = "kişi hakkında")
    following = models.IntegerField(default = 0)
    followers = models.IntegerField(default = 0)
    hmanycontent = models.IntegerField(default = 0)
```
Şimdi bu yaptığımız OtherInfo modelimizi anlatalım.

- user = models.OneToOneField olarak yazdığınız yerde modelimizdeki user ( kullanıcı ) yı django'nun kendi modeline bağladık bu bağlamadan sonra veri tabanında UserProfile tablosunda user bölümünde ilgili kullanıcının id numarası olacaktır, direk kullanıcı adı falan olmayacaktır.
- models.CASCADE ifadesi bağlı olan nesne silinirse bu da silinsin anlamı taşımaktadır yani django'ya bunu bildirmemizi sağlar.

Diğer ifadeler ise benim projeme göre gerek duydugum ifadelerdir
pp - profil resmi yüklemişmi
followers - kaç kişi takip ediyor
following - kaç kişi takip ediliyor gibi bilgiler

kısacası veri tabanı şu şekilde görünecektir işlem sonrası.

-------------------------------
|   id  |user_id |    pp   |
|------------------------------
|   0   |   3            |1|
|   1   |   4            |0|
|   2   |   5            |0|


## Admin Tarafı
```python
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
#daha sonra kullanarak genişletmiş olduğumuz modelimizi dahil edelim benim ki şöyle ;
from models import UserProfile

class UserProfileAdmin(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = "Kullanıcının diğer bilgileri"

#**verbose_name_plural** ile de admin saydasında gösterilecek olan ismi yazıyorsunuz.
#**model** ile hangi model sınıfımız kullanılacak onu belirtiyoruz

#Ve yeni modelimizi dahil etmek için şunu yazıyoruz

class UserAdmin(UserAdmin):
    inlines = (UserProfileAdmin, )
    """buraya az önce admin.py de oluşturduğumuz
    sınıf ı yazıyoruz virgülü unutmayın hata verir"""
```
eğer birden fazla genişletme yaparsanız yine **class UserProfileAdmin(admin.StackedInline):** bunun gibi tanımlayıp gereken yeri dolduruyorsunuz ve **class UserAdmin(UserAdmin):** burada **inlines** içine sınıfınızı yazıp sonuna virgül koyuyorsunuz.

sonra klasik user modelini unutsun onun la işlem yapmasın diye django'ya şu şekilde bildiriyorum.
```python
admin.site.unregister(User)
```
buraya tekrar varsayılan olarak gelen User modelini atıyoruz.
ve son olarak yeni özellikleri gönderip arkamıza yaslanıyoruz
```python
admin.site.register(User, UserAdmin)
```

Son olarak models.py de değişikliler yaptığımız için veritabanına yansıtılması adına gerekli olan
```python
python manage.py migrate
python manage.py makemigrations myapp # (myapp burda sizin oluşturduğunuz uygulama adı oluyor mesela benimki cooggerapp )
```

komutlarını çalıştırıp veritabanına işledikten sonra herşeyiniz hazır demektir

### Template İçinde Kullanımı ?
Genişletme olayının benim en sevdiğim yanı ise eklemiş olduğumuz yeni özellikleri templatimizde hemen kullanabiliyor olmamız hiç bir başka işlem yapmadan views ile uğraşmadan hemen bir kaç örnek vererek konuyu bitirelim.
mesela siz kullanıcın fotograf yüklemişmi yüklememişmi teplate içinde öğrenmeniz gerek o zaman benim modelim ile şu şekilde yapmanız gerek
**template**
```html
  {% if request.user.userprofile.pp %}
      <img  src="/media/users/{{ request.user  }}.jpg">
      {% else %}
      <img src="/static/media/profil.png" >
      {% endif %}
```
Burada tema içinde **request.user.userprofile.pp ** bu kod ile gelen kullanıcının yani **request.user** ın profil yüklemişmi yüklememişmi ona baktık eğer True ise kendi resmini gösterdik False ise klasik resmi gösterdik
```html
takip   {{ request.user.userprofile.following }}
takipçi  {{ request.user.userprofile.followers }}
```

### Signals
User modelinizi genişlettiniz ve şimdi yeni bir kullanıcı, kayıt olduğunda bunu yakalamak ve açtığınız yeni model'e de kayıt olsun istiyorsunuz, o zaman **Django signal** konusunu öğrenmeniz gerekiyor.

[@hakancelik96/django-sinyalleri-nasl-olusturulur-django-signals](https://www.coogger.com/@hakancelik96/django-sinyalleri-nasl-olusturulur-django-signals/)


## Sonuç
![extend-user-model](https://www.coogger.com/media/images/extend-user-model.png)
