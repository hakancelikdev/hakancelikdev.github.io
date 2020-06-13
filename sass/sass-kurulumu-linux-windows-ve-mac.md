# Sass Kurulumu ?

Kurulum için daha detaylı bilgi :
[http://sass-lang.com/install](http://sass-lang.com/install)

## Linux için

Linux dağıtımı kullanıyorsanız, önce ruby'yi yüklemeniz gerekir. Ruby'yi apt Paket
Yöneticisi ile yükleyebiliriz şu adresten kullandığınız linux dağıtımında uygun olarak
yükleyebilirsiniz
[https://www.ruby-lang.org/en/documentation/installation/\#package-management-systems](https://www.ruby-lang.org/en/documentation/installation/#package-management-systems)

mesela ubuntu için

```bash
sudo apt-get install ruby-full
```

şimdide sass' ı kuralım

```bash
sudo gem install sass --no-user-install
```

şöyle bir çıktı verecektir.

```markup
Fetching: sass-3.5.5.gem (100%)
Successfully installed sass-3.5.5
Parsing documentation for sass-3.5.5
Installing ri documentation for sass-3.5.5
Done installing documentation for sass after 3 seconds
1 gem installed
```

## windows için

Yine önce ruby'i kurmamız gerek bunun için exe dosyasını indirip next next next diyerek
kurabiliriz. adres: [https://rubyinstaller.org/](https://rubyinstaller.org/)

## Mac için

mac'de ruby zaten yüklü geliyor bu yüzden ek bir şey kurmanıza gerek yok

windows ve mac de ruby den sonra sass'ı kurmak için konsolu açın ve şu kodu yazın.

```bash
gem install sass
```

izin vermez ise yönetici olarak sudo ön eki ile yazın

```bash
sudo gem install sass
```

yüklenmiş mi diye bir kontrol amacı ile yazın

```bash
sass -v
```

cevap olarak yüklenen güncel versiyon bilgisi gelecektir örneğin : Sass 3.5.4.

Diğer ders görüşmek üzere ..
