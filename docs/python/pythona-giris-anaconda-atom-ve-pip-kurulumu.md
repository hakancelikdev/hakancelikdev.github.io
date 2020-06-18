# Python Kurulumu

### Linux Üzerine Python Kurulumu

```bash
$ sudo apt-get install software-properties-common
$ sudo add-apt-repository ppa:deadsnakes/ppa
$ sudo apt-get update
$ sudo apt install python3.8
$ sudo apt-get install python3.8-dev
$ sudo apt-get install python3.8-pip
```

En sonda yaptığımız yüklemeyi şuan için yapmanız gerekmiyor

```bash
$ sudo apt-get install python3.8-pip
```

Burada Python'un paket yöneticisi olan pip kurulumunu yapıyoruz pip'i

{% page-ref page="kuetuephane-moduel-ve-paketler.md" %}

Adlı konuya geldiğimizde daha detaylı inceleyip kullanacağız, bu yüzden gerekli değil.
Bash konsolunuzu açıp `python3.8` yazarsanız kurulu olduğunu ve kullanıma hazır hale
geldiğini aşağıdaki gibi göreceksiniz.

```bash
$ python3.8
Python 3.8.2 (default, Feb 26 2020, 02:56:10)
[GCC 7.4.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

### WSL Nedir ?

Wsl'nin açılımı **Windows Subsystem for Linux** \( Linux için Windows Alt sistemi \).

Sadece Windows 10 işletim sistemine sahip cihazlarda olan bu özellik sayesinde Windows
üzerinden Linux kullanmanız için Virtualbox gibi araçlar kullanmadan çok daha hızlı bir
şekilde Windows üzerinde Linux'u kurabilir ve kullanabilirsiniz, WSL sizlere bu imkanı
sağlıyor.

#### WSL Kurulumu

Power Shell'i yönetici mod ile açıp aşağıdaki kodu çalıştırın.

```shell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```

Eğer isterse bilgisayarınızı yeniden başlatın.

Microsfot Strore \( Mağaza \) 'e girerek

![](../assets/store.png)

Ubuntu kurulumu yapın \( indirin \).

Daha fazla bilgi için ziyaret edin,
[https://docs.microsoft.com/en-us/windows/wsl/install-win10](https://docs.microsoft.com/en-us/windows/wsl/install-win10)

İndirme tamamlantıktan sonra ilk çalışmada sizlerden kullanıcı adı ve parolası
isteyecektir onları kendinize göre ayarlayın ve Python'u kurmak için yukarıda Linux için
anlattığım bölümün aynısını yaparak Python kurulumunuzu yapın.

Python kurulumu bittikten sonra bulunduğunuz console 'a `python3.8` yazarak Python
consolunuzu başlatabilirsiniz.

### Windows Üzerine Python Kurulumu

> Tavsiye etmiyorum, Linux , MacOS veya WSL kullanın.

Python'un kendi sitesinden [https://www.python.org/](https://www.python.org/) download
bölümünden en güncel Python sürümünü indirin ve çalıştırın.

Karşınıza şöyle bir ekran gelecektir.

![](../assets/capture%20%282%29.PNG)

Aşağıda bulunan **Add to Python 3.8 to PATH** bölümünü yukarıdaki gibi seçin ve
**Customize installation** bölümüne tıklarak devam edin.

Bir sonraki sayfada her şeyi seçili bırakın ve next'e basın.

![](../assets/capture%20%283%29.PNG)

Bir sonraki sayfayı yukarıdaki gibi doldurun ve **insall** tuşuna basıp yükleyin.

Yükleme bittikten sonra arama yerine Python yazarak, python'un console 'una
erişebilirsiniz, veyahut arama yerine `cmd.exe`yazın o console'a python yazın yine
karşınıza python console'u çıkacaktır.

### Kodlarımızı Nereye Yazacağız, Nasıl Çalıştıracağız ?

Python biliyor ve ufak denemeler yapmak için veya Python'a yeni başlıyor denemeler
yaparak sonuçları görmek ve öğrenmek için işletim sisteminize uygun konsolu
kullanabilirsiniz, [`cmd`](https://en.wikipedia.org/wiki/Cmd.exe) ,
[`bash`](https://en.wikipedia.org/wiki/Bash_%28Unix_shell%29) gibi.

### Text Editör Nedir ?

Çok kısaca text dosyalarını düzenleyen bir bilgisayar programıdır.

#### Atom Nedir?

Atom kısacası bir text editör'dür, başka bir çok editör olmasına rağmen, benim ilk
kullandığım editör Atom oldu, şuan ise
[VScode ](https://code.visualstudio.com/)kullanıyorum.

Editörleri veya IDLE leri araştırıp en çok hoşunuza giden ve rahat hissettiğinizi
indirip kullanabilirsiniz, sizlere bunun için bir kaç `keyword`vereceğim.

**vim, pycharm, emacs, atom, vscode**
