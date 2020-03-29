# Python'a Giriş, Anaconda, Atom Ve Pip Kurulumu

Herkese merhaba bu gün yeni bir tutorial serisine başlamaya karar verdim, python'ı baştan sona anlatan bir kaynak olacak, normalde [Python](https://www.coogger.com/python/@hakancelik96/) konusu altında yeni öğrendiğim konuları yazıyordum fakat baştan sona bir python serisi olmadığı için içimden yazmak gelmiyordu, ek olarak gaziantep üniversitesinde arkadaşlarımız arasında yazılım öğrenmek ve uygulamak adına bir ekip oluşturduk onlar içinde ek kaynak olmasını istediğim için ![](https://www.egitimsistem.com/d/news/13286.jpg) umarım güzel bir şekilde devamını getireceğim orada işlenecek olan başlıkları bir hafta öncesinde burda anlatmayı planlıyorum \( Gereken yerlerde sık sık düzenlemeler yapacağım \), hatalı yerleri görürseniz lütfen yorum yapın veya aşağıdaki adreslerden bana ulaşarak bildirin, sizde katkıda bulunun.

## [Anaconda Nedir](https://www.anaconda.com/what-is-anaconda/) ?

Aslında anaconda **en popüler python veri bilim platformu** dur, ek olarak anaconda ile birlikte çok sayıda python kütüphaneleri kurulur ve ilerleyen zamanda tek tek pip kullanarak indirmek zorunda kalmazsınız.

### Anaconda Dağıtımı

6 milyonu aşkın kullanıcı ile, açık kaynak Anaconda Dağıtımı, _**Linux**_, _**Windows**_ ve _**Mac OS X**_'te **Python** ve **R** veri bilimi ve makine öğrenimi yapmanın en hızlı ve kolay yoludur. Bu, geliştirme, test etme ve eğitim için tek makine'de endüstri standardıdır.

### Anaconda Kuruluş, Girişim

Anaconda Enterprise \( Kurulum, girişim \), kurumları eğitimden üretime kadar dizüstü bilgisayardan AI/ML ve veri bilimini geliştirmeye, yönetmeye ve otomatik hale getirmeye teşvik eden bir AI/ML etkinleştirme platformudur. Organizasyonların bireysel veri bilimcilerden binlerce kişilik işbirlikçi ekiplere ölçeklenmesini ve tek bir sunucudan model eğitim ve dağıtım için binlerce düğüm noktasına gitmesini sağlar.

## Anaconda Kurulumu

[https://www.anaconda.com/download/](https://www.anaconda.com/download/) bu adresten en güncel sürümü indirin, Bir yazılımcı hep güncel kalmalı, yoksa gelişen teknoloji içinde **old man** olur. Ve sonra **next, next, next** diyerek kurulumu tamamlayın bu kısmı anlatmayı gerek bulmuyorum

Dikkat;Bilgisayar kullanıcı isminizde boşluk olmaması gerek var ise Atom ve Anaconda hata verebiliyor

## [Atom Nedir?](https://atom.io/)

Atom kısacası bir editör'dür, başka bir çok editör olmasına rağmen, ben kod yazarken **Atomu** kullandığım için sizede onu öneriyorum, kendileri açık kaynak olup Python veya diğer diller için yazılmış paketleri bulunmakta birazdan 2 tane paketi indireceğiz zaten.

## Atom Kurulumu

Bu adresten [https://atom.io/](https://atom.io/) Atom editörü indirip, kurulumunu yapabilirsiniz, zor bir kısım olmadığı için yine atlıyorum burayı.

Python için tasarlanmış **pycharm** editörüde isterseniz bu adresten kurabilirsiniz, [https://www.jetbrains.com/pycharm/download/](https://www.jetbrains.com/pycharm/download/)

kurulum bittikten sonra aşağıdaki resimde görüldüğü gibi **Atom**&gt;**Settings** bölümüne geliyorsunuz.

!\[\]\(https://www.coogger.com/media/images/atom\_settings.png\)

Daha sonra aşağıda göründüğü gibi **Install** bölümüne gelip arama yerine _**Python**_ yazıyoruz ve çıkan paketlerden sizlere yardımcı olması için **autocomplete-python** ve **atom-pyhton-run** paketlerini **install** düymesine basarak indiriyoruz.

!\[\]\(https://www.coogger.com/media/images/atom\_install.PNG\)

### autocomplete-python

Kodlarınızı oto tamamlayan bir paket.

### atom-pyhton-run

F5 tuşuna basarak yazdığınız python kodunun çalışmasını sağlayan bir paket'tir.

Son olarak **Anaconda**'nın bilgisayarınızın neresine kurulduğunu bulun, eğer kurulum sırasında değiştirmemiş iseniz **C:\Users{kullanıcı\_adınız}\Anaconda3** şeklinde kurulmuş olması gerek, bu yolu kopyalayın ve **Bilgisayarım&gt;\(sağ tık\) özellikler&gt;\( sol en alta\) gelişmiş sistem ayarları&gt;Ortam değişkenleri&gt;\(sistem değişkenleri altındaki\) Path kısmını açın** sağ köşede yeni yazan yere tıklayıp **Anaconda'nın yolunu sonuna  işareti ekleyerek buraya yapıştırın** daha sonra tekrar anaconda'nın kurulu olduğu yere gelin ve **C:\Users{kullanıcı\_adınız}\Anaconda3\Scripts** yolunu kopyalayın ve yine aynı adımları yapın son hali aşağıdaki gibi olacaktır.

!\[\]\(https://www.coogger.com/media/images/ortam\_de%C4%9Fi%C5%9Fkenleri.png\)

## Pip nedir?

Pip python için paket yöneticisidir, **Anaconda**'da bulunmayan kütüphaneleri kurmak için pip kullabilirsiniz, veya anaconda yerine direk python indiren arkadaşlar ek kütüphaneleri **Pip paket yöneticisi** ile hızlı bir şekilde indirip kurulumu yapabilir ve kullanabilir.

Masaüstüne **get\_pip.py** adında bir python dosyası açın

> Not; Eğer dosyalarınızın uzantısı görünmüyor ise windows arama yerine klasör yazıp, çıkan penceredeki ikinci sırada yer alan `bilinen dosya türleri için uzantıları gizle` adlı yerin işaretini kaldırın ve kayıt edin.

ve [https://bootstrap.pypa.io/get-pip.py](https://bootstrap.pypa.io/get-pip.py) bu linke tıklarak karşınıza çıkan kodları açtığınız get\_pip.py adındaki dosyanıza kopyalayın kayıt edip kapatın ve masaüstünde **shift + \(fare sağ tık\)** yaparak shell komut satırını \( veya cmd \) açın.

`python get_pip.py` yazarsanız pip kurulumuda gerçekleşmiş olacaktır.

## Test Etme Zamanı

Windows aramaya yerine **cmd** yazın ve konsolu açıp **python** komutunu girin eğer kurduğunuz anaconda'nın konsolu açılırsa bütün kurulumu doğru yaptınız ve _Atom_ editörden F5 yaparak da doğru bir şekilde çalıştırılacaktır, tebrikler görüşmek üzere.

!\[\]\(https://www.coogger.com/media/images/console.png\) Yine komut satırına `pip` yazarak kontrol edebilirsiniz, yardım sayfası açılıra başarılı bir şekilde kurulum gerçekleşmiş demektir.

**Kod yazmadığınız gün olmasın ... görüşürüz**

