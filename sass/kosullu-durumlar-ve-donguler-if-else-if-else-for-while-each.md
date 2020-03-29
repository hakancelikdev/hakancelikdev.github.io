# Koşul Durumları ve Döngüler

Merhaba arkadaşlar bildiğiniz gibi coogger projesine başladığımda yeni bir css fremework'u olan [coogger.css](https://github.com/coogger/coogger.css) projesinede başlamıştım, bu fremework'u geliştirirken sass kullanıyorum ve son 1 haftadır yeni özellikler ve var olan özellikleri geliştirmeye çalışıyorum, bunu yaparken sass'da bilmediğim bazı yeni şeyler öğrendim bunların hepsi bu içeriğin konusu olmasada yeni öğrendiğim ve çok işime yarayan programlama dillerinde bulunan if, else yapısı ve döngüleri ele alacağım, ek olarak eski sass yazılarıma baktığımda çok anlaşılır ve detaylı anlatmadığımı fark ettim zaman bulduğumda onlarada bir el atıp düzenleyeceğim yada daha detaylı eskiye yönelik yeni içerikler paylaşacağım.

Bu içeriğin konusunu herhangi bir programlama dili bilen kişi hızlıca anlayıp kavrayacaktır.

## @if

If koşullu yürütme kodumuzu sass içerisine syntax olarak aşağıdaki gibi yazıyoruz, **Boolean expression** olarak adlandırlan bölüm'ü şu şekilde anlatayım. If, else if veya else gibi koşullu durumları yazmamızı sağlayan kodların tek umursadıkları şey şart olarak verilen ifadenin doğru olup olmadığıdır, verilen ifade doğru ise if, else if veya else altındaki kodlar çalışır, doğru değil ise çalışmazlar, programlama dilleri **0** ve **""** bunun gibi boş karekteri **false** \( yani yanlış \) diğer geri kalan herşeyi **true** \( yani doğru \) kabul eder, bu kural sass'da da geçerlidir.

Syntax;

```css
@if <Boolean expression> {
    <statements>
}
```

Aşağıda bir örnek yazalım.

```css
$variable: 1; // değişkenimi tanımladım
a{
   @if $variable == 1 { // variable değişkenim 1'e eşit ise
       color: blue; // color blue olur
    }
   @if $variable != 1 { // değişkenim 1'e eşit değilse
      color: red; // color red olur
   }
}
```

bu örneği bu şekildede yazabilirdik.

```css
$variable: 1; // değişkenimi tanımladım
a{
   @if $variable == 1 { // variable değişkenim 1'e eşit ise
       color: blue; // color blue olur
    }
   @else{ // değişkenim 1'e eşit değilse
      color: red; // color red olur
   }
}
```

css olarak çıktımız

```css
a{
   color : blue;
}
```

> Kodlarınızda ne kadar @if varsa sass hepsini bakar ve şart doğru olduğu takdirde hangisi doğru ise onu çalıştırır, siz 10 farklı @if blogu yazmış olsanız ve ne olursa olsun mutlaka bir tane @if'in çalışacağını bilseniz bile bilgisayar bunu bilemiyeceği için bütün @if'leri kontrol eder bu kötü yazılmış bir kod'dur ve @if, @else if,@else yapısının kullanılması gerek

Nota örnek;

```css
$variable: 1; // değişkenimi tanımladım
a{
   @if $variable == 1 { // variable değişkenim 1'e eşit ise
       color: blue; // color blue olur
   }
   @if $variable != 1{ // yukarıdaki ilk if doğru olsada olmasada, yani yukarıdaki if çalışsada çalışmasada bu if kontrol edilir, siz yukarıdaki çalışırsa bunun çalışmayacağını bilirsiniz ama bilgisayar bilemezi bunu bilmesi için @else if kullanmanız gerekir.
      color: red;
   }
}
```

## @else if

Else if koşullu durumu şu if'den pek farklı değildir, yine boolen bir değer alır ve şart doğru ise çalışır, tek fark @if'i anlatırken hemen yukarıdaki örnek ile açıkladığımız durumdur, eğer kod bloğunuzda @if, @else if, @else if yapısı varsa yani her şartınız @if değil içinde @else if'de varsa, herhangi bir şart sağlandığı zaman bilgisayar diğer şartlara bakıp kendisini yormaz.

```css
$variable: 1; // değişkenimi tanımladım
a{
   @if $variable == 1 { // variable değişkenim 1'e eşit ise
       color: blue; // color blue olur
   }
   @else if $variable != 1{ // yukarıdaki şart doğru olduğu için o çalışır ve pc bu şarta bakmaz bile, yukarıdaki if bloğu yanlış ise bakar ama.
      color: red;
   }
   @else{ // hem if hem @else if yanlış yani çalışmamış ise bu blok çalışır.
    color:white;
   }
}
```

## @else

Else koşullu durum, @if veya @else if'in çalışmadığı durumlarda çalışırı, yani @else'in şartı diğer şartların çalışmama durumudur, bu yüzden @else ilave bir şart \( boolen karakter almaz \) direk @else{} şeklinde yazılır yukarıda bir örneğimiz mevcut.

## @for

**For** döngüsü belirli bir noktadan belirli bir noktaya kadar yapılan döngüler için kullanılır, örnek olarak 1'den 100'e kadar gibi döngülerde **while** yerine for kullanmak daha pratiktir, syntax'ı aşağıda verilmiştir.

Syntax;

```css
@for <var> from <start> through <end> {
    <statements>
}
@for <var> from <start> to <end> { // veya
    <statements>
}
```

10 kere çalışan bir for döngüsü yapalım.

```css
@for $i from 1 through 6 {
   .width-#{$i} {
      width: 0% * $i;
   }
}
```

Sonuç;

```css
.width-1{
    width: 1%;
}
.width-2{
    width: 2%;
}
.width-3{
    width: 3%;
}
.width-4{
    width: 4%;
}
.width-5{
    width: 5%;
}
```

## @while

@while döngümüz bir boolen \( true veya false \) değer alır ve aldığı değer doğru olduğu süre boyunca çalışır.

```css
$variable: 4;
@while $variable < 6 {
  .myclass-#{$variable} { // css için yazılmış kod blogu
        color: red;
    }
    $variable : $variable + 1; // kod bloğundan sonra, değişkenimi 1 arttırıyorum
    // yoksa döngü sonsuza kadar çalışmak isteyecektir, değişkenim 6 olduğu zaman
    // $variable < 6 bu şart false olacağından döngü duracaktırç
}
```

## @each

Son olarak @each döngümüz bir liste elemanlarını veya sözlük elemanlarını kullanarak döngü yapmamızı sağlar bu tıpkı python probramlama dilindeki for döngüsü gibidir.

Sözlük veri tipi; `$map: (key1: value1, key2: value2, key3: value3);`

Syntax ;

```css
@each <variables> in <list or map> {
   <statements>
}
```

Örnek;

```css
@each $size in (10, 12, 14, 16) {
  .font-#{$size} {font-size: 0px+$size;}
}
```

Sonuç;

```css
.font-10 {font-size: 10px;}
.font-12 {font-size: 12px;}
.font-14 {font-size: 14px;}
.font-16 {font-size: 16px;}
```

liste içine liste'de verebilirsiniz

```css
@each $name, $style, $size, $color in ((normal, bold, 10px, red), (emphasis, bold, 15px, white)) {
   .text-#{$name} {
      font-weight: $style;
      text-size: $size;
      color:$color;
   }
}
```

Sonuç;

```css
.text-normal {
  font-weight: bold;
  font-size: 10px;
  color:red;
}

.text-emphasis {
  font-weight: bold;
  font-size: 15px;
  color:white;
}
```

## Not;

* Döngülerinizin veya koşullu durumlarınızın içine kodladığınız mixinsleri yazarak veya @extend ile diğer css kodlarınızı dahil ederek kullanabilirsiniz.
* Mixinslerinizin içirisine @include mixin\_ismi\($parametre\); şeklinde mixin dahil edebilir, yine @extend ile diğer css kodlarınızı dahil edebilirsiniz.

