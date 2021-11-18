# Instagram Botu

### Neler Öğreneceğiz ;

- Sınıf yapısını instagram botu yaparak pekiştireceğiz.
- Sınıf yapısında bulunan @staticmethod decorator'ünü öğreneceğiz.
- requests kütüphanesini kullanarak güzel bir bot yapacağız.

### Botumuzun şuan ki yapabildikleri

- Kullanıcı adınız ve şifreniz ile oturum açmak, çift doğrulama olayını henüz eklemedim.
- Bir kullacı adını girerek onun bilgilerine ulaşmak - gizli hesap ise daha çok bilgi
  için oturum açmanız ve kişinin sizde ekli olması gerek.
- Yeni bir hesap açmak
- Kullanıcı isimlerine göre takip etmek veya takibi bırakma
- çıkış yapmak

> Birde botumuz rastgele bir useragent bilgisi alabilmekte ve proxy değiştirerek farklı
> konumlardan işlemler gerçekleşiyor gibi gösterilmekte Bundan dolayı bir keyword
> hazırlayıp bu bot ile bir bruteforce yazsanız işlem yaptığınız kişiye hesabınıza giriş
> yapılmaya çalışıldı gibi bir bildirim gittiğinde gerçek konumuz değilde sahte
> konumunuz gider,ama instagram siz proxy kullansanız bile max 19 istek gibi bir sayıda
> engelliyor ve siz şifreyi doğru yazsanız bile giriş vermiyor kişi bir süreliğine
> sadece telefonundan girebiliyor. Peki bunu nasıl yapıyor bir web birde mobil olarak
> ayırmış ona göre çerez vermiş olabilir web den 19 istek her ne şekilde gelirse gelsin
> bunu zaman damgası ile gelen istek sayısını kayıt eder ve 2 saat süresince 19 istek
> atmış ise engellensin ve şifre doğru olsa bile web'den girilmesin şeklinde bir
> algoritma kullanmış ise işe yarayacaktır diye düşünüyorum.

## Yapalım Şu Lanet Botu.

Bu adresten gelişmeleri takip edebilirsiniz.

Önce gerekli kütüphaneleri dahil edelim projemize

```python
import time
import sys
import random
import json
import requests
from lib import fake
```

> lib/ fake de nedir diyorsanız bu useragent bilgilerinin bulunduğu uzun bir sözlük.

Adres ise şu

[fake.py](https://github.com/hakancelik96/instagram/blob/e9d1919b2f0cd3e299b997d6fe7314f9dfdfd73c/src/lib/fake.py)

Burdan indirin.

```python
class Instagram():
    def __init__(self, username, password, proxy = False):
        self.username = username
        self.password = password
        self.isloggedin = False
        self.instagram_url = "https://www.instagram.com/"
        self.instagram_login_url = "https://www.instagram.com/accounts/login/ajax/"
        self.instagram_signup_url = "https://www.instagram.com/accounts/web_create_ajax/"
        self.instagram_logout_url = "https://www.instagram.com/accounts/logout/"
        self.user_info_url = "https://www.instagram.com/{}/?__a=1"
        self.follow_url = "https://www.instagram.com/web/friendships/{}/follow/"
        self.unfollow_url = "https://www.instagram.com/web/friendships/{}/unfollow/"
        self.useragent = self.random_ua()["User-Agent"] # rastgele bir useragent bilgisi oluşturan fonksiyon
        self.s = requests.Session() # session
        self.s.proxies = self.random_proxy() if proxy else {} # kişi 3.paremtere de proxy kullanımına True yazmıs ise random_proxy fonksiyonundan rastegele bir adres alıyoruz
        self.s_get = self.s.get("https://www.instagram.com/") # ve instagram.com'a bağlanıyoruz
```

İlk önce Instagram adında bir sınıfımızı tanımladık ve 3 tane parametre verdik bunları
**init** fonksiyonuna yazık bildiğiniz gibi sınıflarda init fonksiyonu sınıf
örneklenince çalışan ve return işlemi uygulanmayan bir fonksiyondur. Self. ön eki ile de
yazdığımız değişkenleri sınıfımızı örneklerdikten sonra @classmethod veya @staticmethod
olarak tanımlamadığımız bütün fonksiyonlarda yine self. ön eki ile erişebiliriz. Şimdi
burada instagram işlemleri için bir kaç adres var peki ben bu adresleri nerden buldum
yapmak istediğim işlem her ne ise instagram.com'a gidip resimde görmüş olduğunuz gibi
network de görünen giden gelen isteklere bakmak ve daha sonra requests kütüphanesini
kullanarak bu istekleri taklit etmek genel botu bu şekilde yapıyoruz mesela takip
olayını yapacaksak bir kullanıcı profiline gidip follow tuşuna basıyoruz ve giden
isteğin adresini bulup post mu get mi yapmış ona bakıyoruz daha sonra da bunu taklit
ediyoruz.

![](https://www.coogger.com/media/images/instagram-console.jpg)

şimdi yukarda kullanıcı adı ve şifreyi aldık işlem gerçekleşecek adresleride bulduk.
Şimdi sınıfımınızn diğer fonksiyonlarını yapmaya geçelim bazı yapılmamış fonksiyonlar
var init fonksiyonumuzda şimdi onları ve diğerlerini yapalım.

#### Init Fonksiyonunda Kullandığımız Fonksiyonlar

```python
    @staticmethod
    def random_ua():
        explorer = ["chrome", "opera", "firefox", "internetexplorer", "safari"]
        ex = fake.ua["browsers"][explorer[random.randrange(len(explorer))]] # fake olarak import ettiğimiz sözlük biçimli dosyamızdan faydalanarak alıyoruz
        useragent = ex[random.randrange(len(ex))]
        return {'User-Agent': useragent}

    @staticmethod
    def random_proxy():
        json_data = requests.get("https://freevpn.ninja/free-proxy/json").json()
        # possible alternate proxies
        # "https://gimmeproxy.com/api/getProxy"
        # "https://getproxylist.com/"

        json_ip = []
        # We are just selecting https and http types
        for i in json_data:
            if i["type"] in ["http", "https"]:
                json_ip.append({"type": i["type"], "proxy": i["proxy"]})

        if len(json_ip) == 0: # If we dont have any http / https proxies
            return {}

        num = random.randrange(len(json_ip))
        json_proxy = json_ip[num]
        return {json_proxy["type"]: "{}://{}".format(json_proxy["type"], json_proxy["proxy"])}
```

@staticmethod decorator'ü olarak tanımladığımız sınıf içi fonksiyonlar yine sınıfın bir
elemanı olup sınıfla pek bağlantısı olmayan fonksiyonlardır @staticmethod decoratorleri
self parametresini almaz çünkü az önce dediğimiz gibi sınıfın öğeleri ile pek işi yoktur
ve bu fonksiyonlar sınıf örneklemeden çağırıp kullanabilirsiniz yanı şu şekilde
_**Instagram.random_ua\(\)**_ bunu yaparsanız size random bir useragent verecektır.

Yukarıdaki _**random_ua\(\)**_ fonksiyonu nasıl çalışıyor derseniz **fake.py**
dosyamızdaki sözlük tipindeki useragent bilgilerini rastgelen **\["chrome", "opera",
"firefox", "internetexplorer", "safari"\]** bunlardan birini seçerek\( random modulü ile
yapıyor bunu\) yine fake içinde rast gelen bir agent bilgisini sözlük kurallarına göre
alıyor.

**random_proxy\(\)** fonksiyonu ise yine static bir fonksiyon olup
[https://freevpn.ninja/free-proxy/json](https://freevpn.ninja/free-proxy/json) bu
adresten json formatında adresleri alıyor ve aldığı tüm adreslerden rastgele bir proxy
seçip [https://123.123.12.12](https://123.123.12.12) şeklinde çıktı olarak veriyor, eğer
ip bulamamıssa boş döndürüyor

Arkadaşlar gönül isterdiki her adımı anlatayım ama birşeyler bilerek bu yazıyı
oluduğunuzu varsayıyorum çünkü bir ton başlangıç kaynakları videoları ve kursları var
yani ben burda random nasıl çalışıyor anlatamam \( ama yinede anlatıyorum fakat sözlük
liste işlemlerini adım adım anlatamam \) bilmeyenler lütfen öğrenip gelsin.

Şimdi bir json çıktılarımız için bir fonksiyon yazalım ki sürekli kodlar tekrar etmesin.

```python
    def json_loads(self, req):
        r = {}
        try:
            r = json.loads(req.text)
        except Exception as e:
            print("An Error Occured! Details :\n",sys.exc_info())
        try:
            if r["authenticated"] == True:
                self.isloggedin = True
        except:
            pass
        finally:
             self.s_get = self.s.get(self.instagram_url)
        return r
```

gelen veriyi req içine attık normalde instagram dan gelen veriyo bu şekilde yapmadan
çıktı vermeye çalışsak , gibi status kodları gelir. gelen req verisini req.text yaparak
metin halinde aldık ve json formatına dönüştürdük **json.loads\(\)** diyerek.

Hatalarımız olmuşsa ekrana bastık

ve gelen veride **r\["authenticated"\]** şu bilgiye baktık bu kişinin oturum açıp
açmadığı bilgisidir True ise oturum açmış demektir, eğer açmış ise **isloggedin**
değikenimze durumu bildirdik ve daha sonra herhangi bir çerez session değişmesine karşın
tekrar **self.s.get\(self.instagram_url\)** diyerek o bilgileri aldık bunu şundan dolayı
yapıyoruz kişi oturum açmiş ve bu fonksiyon çalışmış ise oturum açınca instagramın
verdiği çerez bilgisini alıyoruz güncellemiş oluyoruz.

### Login\(\)

```python
     def login(self):
        form_data={"username": self.username, "password": self.password}
        self.s.headers.update({
            'UserAgent': self.useragent,
            'x-instagram-ajax': '1',
            'X-Requested-With': 'XMLHttpRequest',
            'origin': self.instagram_url,
            'ContentType': 'application/x-www-form-urlencoded',
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'Referer': 'https://www.instagram.com/accounts/login/',
            'authority': 'www.instagram.com',
            'Host' : 'www.instagram.com',
            'Accept-Language': 'en-US;q=0.6,en;q=0.4',
            'Accept-Encoding': 'gzip, deflate'
            })
        self.s.headers.update({'X-CSRFToken': self.s_get.cookies.get_dict()['csrftoken']})
        r = self.s.post(self.instagram_login_url, data=form_data)
        return self.json_loads(r)
```

Yine basitce deniyelim, gönderilen form verileri kullancı adı ve şifre başka yok daha
sonra taklit etmemiz gereken headers bilgisi var buda web geliştirici konsolunu
açtığınızda görünüyor gereken bilgileri doldurduk ve bu bilgileri
**self.s.headers.update** \(self.s\) hep bağlı kaldığımız çerez ve session bilgisini ip
adresimi zi \( proxy \) tutar ve istekleri ona göre yapar. bu yüzden hep bu şekilde
yapıyoruz.Django da da bulunan csrftoken bilgisini isteğimizden önce siteden
**self.s.headers.update\({'X-CSRFToken':
self.s_get.cookies.get_dict\(\)\['csrftoken'\]}\)**

bu kodlar ile alıyoruz ve headeri tekrar güncelliyoruz sonda **self.s.post** ile bu
bilgiler işiğinde post isteğimizi yapıyor ve artık login olmuş oluyoruz.

### Logout\(\)

```python
    def logout(self):
        r = self.s.get(self.instagram_logout_url)
        self.isloggedin = False
    return r
```

Çıkış yaparken pek birşey yok yine **self.s** i kullanarak çıkış yapmamızı sağlayan
**self.instagram_logout_url** adresine get isteğinde bulunuyoruz ve tamam çıkış
yaptığımız içinde isloggedin false yapıyoruz neden hemen çıkış yapabildik derseniz zaten
bize ait olan bütün bilgiler **self.s** in içinde olduğu için ek bir şeye gerek kalmadı.

### Userinfo\(\)

```python
    def userinfo(self,username):
        if self.isloggedin: # oturum acildiktan sonra erisilebilen bilgiler
            user_info = self.user_info_url.format(username)
            req = self.s.get(user_info)
        else: # oturum acılmadan erisilebilen bilgiler
            user_info = "https://www.instagram.com/{}/?__a=1".format(username)
            req = requests.get(user_info)
        info = json.loads(req.text)
        return info
```

şimdi burda **isloggedin** değişkeni ile oturum açılıp açılmadığı bilgisini tutuyorduk
burda **if self.isloggedin** diyerek oturum açmış ise request isteğini bizim çerez ve
session vb bilgilerin bulunduğu **self.s** ile yapacağız bu sayede eğer oturum açmış ve
işlem yapacağım kullanıcı bizde ekli ise daha detaylı bilgilere erişebileceğiz,eğer
oturum açılmamıs ise zaten normal **requests.get** yapıp herkese açık olan kullanıcı
bilgilerine erişebiliyoruz.

### Follow\(\)

kodlarda açıklamalar var

```python
    def follow(self,username = False, userid = None):
        if self.isloggedin:
            if userid is not None: # eğer kişi userid ye göre takip atacaksa user_id None olmaz
                follow_url = self.follow_url.format(userid) # ve gelen user_id yi adrese atarız ( follow_url bu adrese)
            elif userid is None and username: # userid eğer None ise username de True ise yani girilmiş ise
                userid = self.userinfo(username)["user"]["id"] # bir yukarıda tanımladığımız
                #userinfo fonksiyonuna bize sadece id numarası lazım o
                # yüzden @static olarak tanımladığımızdan veri alıyoruz
                follow_url = self.follow_url.format(userid) # follow_url oluşturduk id numarsını alarak
            else:
                return "you can not enter two parameters at the same time"
            self.s.headers.update({'X-CSRFToken': self.s_get.cookies.get_dict()['csrftoken']})
            r = self.s.post(follow_url) # ve post isteği ile takp isteğini göndermiş oluyoruz
            return self.json_loads(r)
        else:
            print("You must login first")
```

şimdi bu bir kişiyi kullanıcı adına veya user_id sine göre takip isteği atmamızı
sağlayan bir fonksiyondur. aldığı parametreler:

- username
- userid

  her ikisini aynı anda alamaz alırsa **else: return "you can not enter two parameters
  at the same time"** bu çalışır yani almanıza izin vermez diğer açıklamları kodların
  içine yazdım.userinfo dan daha ne gibi bilgiler alınabilir diye merak ediyorsanız
  github da verdiğim adreste **userinfo.md** dosyasına bakın.

### Unfollow\(\)

Arkadaşlar unfollow da follow un aynısı sadece adresi değişiyor init de tanmlamış
oldugumuz unfollow oluyor onun yerine

### Singup\(\)

Login fonksiyonuna çok benzer kendileri

```python
    def signup(self, first_name, email):
        form_data={
            "email": email,
            "password": self.password,
            "username": self.username,
            "firs_name": full_name,
            "seamless_login_enabled": "1"
            }
        self.s.headers.update({
            'UserAgent': self.useragent,
            'x-instagram-ajax': '1',
            'X-Requested-With': 'XMLHttpRequest',
            'Host': self.instagram_url,
            'ContentType': 'application/x-www-form-urlencoded',
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'Referer': self.instagram_url,
            'authority': 'www.instagram.com',
            'Host' : 'www.instagram.com',
            'Accept-Language': 'en-US;q=0.6,en;q=0.4',
            'Accept-Encoding': 'gzip, deflate'
        })
        self.s.headers.update({'X-CSRFToken': self.s_get.cookies.get_dict()['csrftoken']})
        r = self.s.post(self.instagram_signup_url, data=form_data)
        return self.json_loads(r)
```

**form_data** mızda sizinde bilmiş olduğunuz gibi instagra.com'a üye olurken sorduğu 4
soru var email,şifre,kullanıcı adı ve tam adınız

bu form isimlerinide frefoxda params sekmesinde bulunuyor ilgili adrese baktıgınızda,
rastgele formu doldurup giden isteklerden
[https://www.instagram.com/accounts/web_create_ajax/](https://www.instagram.com/accounts/web_create_ajax/)
bu adrese baktıgınızda params sekmesinde form isimleri görünür.

- "email"
- "password"
- "username"
- "firs_name"
- "seamless_login_enabled": "1"

**Resimde görünüyor :**

![instagram](https://www.coogger.com/media/images/instagram.jpg)

Bunlar yani geri kalan işlemde yine aynı işlemler login de olduğu gibi.

Gerçekten bu botu anlatırken çok yoruldum umarım faydalı ve yardımcı olur siz değerli
okuyanlara github adresini bıraktım zaten herkese iyi çalışmalar görüşmek üzere

## Botun kullanımı :

```python
from instagram import Instagram as I
# diyerek import ettik
user_info = I.userinfo(username  = "hakancelik.py") veya
user_info = I.userinfo("hakancelik.py")
# oturum açmadan belirlerdiğimiz bir kullanıcının herkese açık
# bilgilerine erişmek için userinfo fonksiyonunu  kullanıyoruz 1 parametre alır ve bu da bilgi edineceğimiz kişinin kullanıcı ismidir.
user_info["logging_page_id"]
# userinfo foksiyonu bize json formatında bir veri döndürür bunun içinde hangi bilgiler var derseniz şu dosyayı # incelemiz gerek:[userinfo.md](https://github.com/hakancelik96/instagram/blob/e9d1919b2f0cd3e299b997d6fe7314f9dfdfd73c/userinfo.md)
# mesela bu kullanıcının id numarasını alacağız diyelim bunun için
user_info["user"]["id"]
# dememiz gerekiyor peki id numarası ne işe yarar derseniz kişilere
# takip isteği gibi # olayları id numarsına göre yapıyoruz
# kişinin tam ismi için
user_info["user"]["full_name"]
# eğer bilgi edinmek istediğiniz kişi sizi engellemiş mi bunu
# öğrenmek için oturum açmalı ve daha sonra ilgili  bilgiyi kontrol etmelisiniz örneğin:
I = I("hakancelik.py", "password")  kullanıcı adımı ve şifremi yazdım ardından oturum açmak için
I.login() login() fonksiyonunu çağırdığımda oturum açmış oluyorum
I.userinfo("hakancelik.py")["user"]["blocked_by_viewer"] false dönerse siz engellememissiniz demektir.
# Birine takip isteği atmak için
I.follow(username="hakancelik.py")#  derseniz bana takip isteği gönderecektir.
# takibi bırakmak için
I.follow(username="hakancelik.py") # derseniz eğer beni takip ediyorsanız takibi bırakacaktır.
# user_id numarsına göre takip isteği atmak için
I.follow(userid = 3) # yaparsanız kevin adında birini takip etmiş olursunuz
# oturumdan çıkmak için :
I.logout()
# oturum açmanız veya çıkış yapıp yapmadığınız görmek için
# I.isloggedin # true ise giriş yapmıssınız false ise cıkıs yapmıssınızdır.
# yeni bir kullanıcı açmak için login yapmadan önce
I.signup(first_name="first_name",email="email") #bunu çalıştırı ve gerkli yerleri doldurusanız size yeni bir hesap acacaktır.
```

```python
from instagram import Instagram as I
user_info = I.userinfo("hakancelik.py") # get information before signing in
oturum açmadan bilgi alıyoruz
 user_info["logging_page_id"] # page_id
user_info["user"]["id"] # for user id
 user_info["user"]["full_name"] # for full name
# etc ... for more information read userinfo.md
I = I("username", "password")
# if you want to use proxy I("username", "password", True)
I.username
username
I.password
password
I.useragent
# gives random useragent
I.s
# gives requests session
I.s.proxies
# you gives fake proxy ex: 165.321.51.21:8050
I.login() # to login instagram
I.logout() # to logout instagram
I.isloggedin  # To check whether loggedin or not
False # or True
I.follow(userid = 3) # for @kevin
{'result': 'following', 'status': 'ok'}
I.follow(username = "hakancelik.py") # for me
{'result': 'following', 'status': 'ok'}
I.unfollow(userid = 3) # for #kevin
{'status': 'ok'}
I.unfollow("hakancelik.py") # for me
{'status': 'ok'}
I.signup(first_name="first_name",email="email") # to signup for instagram
```

Bu kadar görüşmek üzere, okuduğunuz için teşekkürler.
