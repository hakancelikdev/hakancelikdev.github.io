# sass-scss-dersleri-sass-watch-degiskenler-nesting-import-mixin-include-ve-operatorler

Merhaba arkadaşlar [sass](https://www.coogger.com/sass/@hakancelik/) listemde **Sass** yerine **css** yapısına daha çok benzediği ve kolay öğrenilmesi açısından daha hızlı olacağını düşündüğüm **Scss** yapısını ele alarak devam edeceğim, belki ilerleyen zamanlarda zaman bulursam syntax olarak bu içeriklere **Sass** syntax'ınıda dahil ederim, zaten Syntax hariç geri kalan herşey aynı.

## Sass Watch

sass ile yazdığımız kodlar biz yazarken hemen css'e dönüşsün ve local de çalışırken sonunuc direk web projenizde görmek istiyorsanız bunu watch ile yapabiliyoruz

```css
sass --watch input.scss output.css
```

burda input.scss ile açmış olduğumuz sass dosyasındaki kodlar biz her ctrl+s yaptığımızda hemen css kodlarına dönüştürür ve output.css dosyasına kayıt eder, watch olayını klasör yolu içinde yapabilirsiniz mesela iki tane klasörünüz olduğunu düşünün biri sass diyeri styles klasörü styles dosyanızda css kodlarınız \( dosyalarınız \) olacak bunu için

```css
sass --watch sass:styles
```

bu watch'da siz sass klasörünüzde herhangi bir .sass dosya uzantısı ile dosya açıp sass kodlarınızı yazdıgınızda aynı isimide fakat .css uzantılı dosyalar styles klasörünüzde oluşmaya başlar

her ctrl+s yaptığınızda değişimler kayıt edelir.

### Sass Değişkenler

Değişkenler, stil sayfası boyunca yeniden kullanmak istediğiniz bilgileri depolamanın bir yoludur. Yeniden kullanmak isteyeceğinizi düşündüğünüz herhangi bir CSS değerini saklayabilirsiniz. Sass bir şeyi değişken olarak atamak için $ sembolünü kullanır değişkenleri kullanmak tekrar eden kodları minumun indirmemize yardımcı olur bu yüzden değişken kullanmak önemlidir.

```css
$font-stack:    Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

Burdaki değişkenlerimiz iki tane olup

**$font-stack**, **$primary-color** bunlardır, tanımladığımız değişkenleri kullanmak sitediğimizde ise yine tanımladığımız gibi $ ön eki ile birlikte değişken ismimizi yazmamız geriyor yani $primary-color böyle

bu kodlar sass'da böyle görünürken css olarak değişkenler olmadan direk değişkenin değeri olarak yazılır yani css çıktımız şöyle olacaktır.

```css
body {
  font: 100% Helvetica, sans-serif;
  color: #333;
}
```

## Nesting

Html kodlarımızda belirli bir hiyerarşi olabiliryor şunun gibi mesela footer&gt;div&gt;ul&gt;li&gt;a&gt;span gibi bir şekilde html kodlarımız olabiliyor sass ile yine bu hiyerarşi gibi kod yazabiliyoruz şöyleki

```css
footer{
  ul{
    margin: 0;
    padding: 0;
    list-style: none;
   li{ display: inline-block; }
  }

  a{
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
  span{
    display: flex;
  }
}
```

css çıktısı olarak

```css
footer ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

footer ul li {
  display: inline-block;
}

footer a {
  display: block;
  padding: 6px 12px;
  text-decoration: none;
}

footer span {
  display: flex;
}
```

şeklinde olur

## İmport İşlevi

sass kodlarınızı modüler olarak yazabilirsiniz örneğin header.scss kodlarınız ayrı bir dosyada, body.scss kodlarınız ayrı bir dosyada hover.scss kodlarınız ayrı bir dosyada olabilir ve bu dosyalarınızı python dilinde olduğu gibi projelerinize dahil edebilirsiniz @import ön eki ile sass ile bir kere bir çıta \(fremework\) oluşturur daha sonra isteğinize göre yaptıklarınızı projenize dahil edebilirsiniz veya github dan açık kaynak olarak yapılan sass projelerini kendi projenize import ile dahil edebilirsiniz.

örneğin ;

```css
// _reset.scss

html,
body,
ul,
ol {
  margin:  0;
  padding: 0;
}

bu _reset.scss dosyamız

// base.scss

@import 'reset';

// veya

@import '_reset.scss'; // şeklindede import edebilirdik

body {
  font: 100% Helvetica, sans-serif;
  background-color: #efefef;
}
```

@import ön eki ile aynı dizinde bulunan reset.scss dosyasını projemize dahil ettik

watch komutu bunu css dosyasına dönüştürdüğünde @import reset; yazan satırda reset dosyasındaki kodlarımız daha sonra ise onun alt satırındaki kodlar bulunur yani aynen şöyle

```css
html, body, ul, ol {
  margin: 0;
  padding: 0;
}

body {
  font: 100% Helvetica, sans-serif;
  background-color: #efefef;
}
```

## Mixins

fonksiyonların bir güzelliği vardır oda bir fonksiyon yazarsın sonra geri kalan kodları o yazar :D , yani şöyle kendisini sürekli tekrar eden bir olay vardır bu tekrar kodlarda ufak tefek şeyler değişse bile genel hat hep aynıdır işte o zaman bunları tekrarlamak yerine bir fonksiyon ve o değişen yerler için öğe sayısı boyunca parametreler ve işte bitti örnek verelim, mesela css ile bir border-radius kodu yazıyorsunuz ama hem frefoxda hem safaride çalışsın istiyorsunuz o zaman öyle bir kod yazmanız gerekiyor.

```css
.border{
-webkit-border-radius: 3px;
-moz-border-radius:  3px;
-ms-border-radius: 3px;
border-radius:  3px;
}
```

şimdi buna bakarsak **-webkit-border-radius:** **-moz-border-radius:** **-ms-border-radius:** **border-radius:** bu kısımlar değişmiyor değişen yerler aldıkları değerler birden fazla border radius kullanacaksam sürekli bunları değerleri farklı olacaksa bile tekrar tekrar yazmak yerine şyle birşey yapabilirim

```css
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
     -moz-border-radius: $radius;
      -ms-border-radius: $radius;
          border-radius: $radius;
}

.box { @include border-radius(10px); }
```

burda @mixin ön eki ile tanımlamıs oldugum border-radius isimki mixin'im $radius diye bir değişken alıyor unutmayın değişkenler $ ön eki ile tanımlanıyordu.daha sonra da yazılan bu fonksiyonu kullanmak için @include ön eki + kullanmak istediğin fonksiyon ismi ve \(\) bunun içine fonksiyonda alınan parametre bilgisi

yani şöyle yaparsınız

```css
.box { @include border-radius(1px); }

.box { @include border-radius(2px); }

.box { @include border-radius(3px); }

.box { @include border-radius(10px); }
```

gibi kullanabilirsiniz hatta daha da abartalım burda aslında sabit olan 3 nesne var onlarda -webkit,-moz ve -ms ön ekleridir ben eğer her yazdığım kod bütün tarayıcılara uyumlu olsun ve tekrar dan kurtulayım isterseniz şöyle yazmanız gerek.

```css
@mixin prefixed($property, $value) {
    -webkit-#{$property}: #{$value};
    -moz-#{$property}: #{$value};
    -ms-#{$property}: #{$value};
    -o-#{$property}: #{$value};
    #{$property}: #{$value};
}
```

şimdi bunu şu şekilde kullanabilirim

```css
@include prefixed(border-radius, 4px)

@include prefixed(border, 4px)

@include prefixed(border, 4px)

@include prefixed(border-color, red);
```

bakın şuan bir mixin ile her tarayıcıya uygun kodlar yazdık çok basit , bu arada $property değişkeninden alınan css kodlarına erişmek için \#{$property} böyle yapılmalı normal değişken değil bunlar direk $property şeklinde erişemezsiniz değişkene css kodları atadığımız için.

çıktı olarak normal css kodları verir ler örneğin şöyle

```css
.box {
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  -ms-border-radius: 10px;
  border-radius: 10px;
}
```

## Operatörler

şöyle işlemler yapabiliriz mesela

```css
width: 300px / 960px * 100%;
width: 600px / 960px * 100%;
```

kullanacağımız operatörler

`/,*,-,+,%` dir

sass dersleri bu kadar arkadaşlar yeni şeyler öğrenirsem eklerim herkese iyi çalışmalar dilerim kolay gelsin görüşmek üzere.

