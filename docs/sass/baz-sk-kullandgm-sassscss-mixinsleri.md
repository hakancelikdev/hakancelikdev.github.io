# Bazı Sık Kullandığım Sass Mixinsleri

### Konunun Anlaşılması İçin Bilinmesi Gereken Konular

- css3
- scss yapısı

## Mixins Prefixed

Öncelikle en sevdiğim sass mixins'inden başlamak istiyorum bu aynı zamanda yazdığım
sass/css kodlarını bütün tarayıcılarda uyumlu hale getiriyor ve bir kere yaz bütün
tarayıcılarda çalışsın pirensibi ile hareket etmemi sağlıyor örneğin:

```css
.flex {
  -webkit-display: flex;
  -moz-display: flex;
  -ms-display: flex;
  -o-display: flex;
  display: flex;
}

[border~="2"] {
  -webkit-border: 2px solid;
  -moz-border: 2px solid;
  -ms-border: 2px solid;
  -o-border: 2px solid;
  border: 2px solid;
}
```

şimdi bu iki örnekte gördüğümüz gibi bütün tarayıcılara uyumlu halde css kodu yazmak
istersek sass ile şu şekilde bunu sağlayabilecek kod yazabiliriz.

```sass
@mixin prefixed($property, $value) {
    -webkit-#{$property}: #{$value};
    -moz-#{$property}: #{$value};
    -ms-#{$property}: #{$value};
    -o-#{$property}: #{$value};
    #{$property}: #{$value};
}
```

bunun kullanımını bir önceki içeriğimde anlatmıştım aslında yine örnek vererek anlatayım
üstte verdiğim iki örneği sass ile yazalım

### Kullanım

```sass
.flex{
     @include prefixed(display,flex);
}

[border~="2"]{
     @include prefixed(border,2px solid);
}
```

şimdi size bu mixins'in kullanıldığı diğer mixinsleri örnek olarak göstereyim, inceleyin

```sass
@mixin text-shadow($string: 0 1px 3px rgba(0, 0, 0, 0.25)) {
    text-shadow: $string;
}
@mixin box-shadow($string) {
  @include prefixed(box-shadow, $string);
}
@mixin drop-shadow($x: 0, $y: 1px, $blur: 2px, $spread: 0, $alpha: 0.25) {
  @include prefixed(box-shadow, $x $y $blur $spread rgba(0, 0, 0, $alpha));
}
@mixin inner-shadow($x: 0, $y: 1px, $blur: 2px, $spread: 0, $alpha: 0.25) {
  @include prefixed(box-shadow, inset $x $y $blur $spread rgba(0, 0, 0, $alpha));
}
@mixin box-sizing($type: border-box) {
  @include prefixed(box-sizing, $type);
}
@mixin border($br){
  @include prefixed(border, $br);
}
@mixin opacity($opacity: 0.5) {
  @include prefixed(opacity, $opacity);
}
@mixin animation($name,$iteration-count: infinite) {
  @include prefixed(animation-name, $name);
  @include prefixed(animation-iteration-count, $iteration-count);
}
@mixin transition($transition) {
  @include prefixed(transition, $transition);
}
@mixin transform($string){
  @include prefixed(transform, $string);
}
@mixin scale($factor) {
  @include prefixed(transform, scale($factor));
}
@mixin rotate($deg) {
  @include prefixed(transform, rotate($deg));
}
@mixin skew($deg, $deg2) {
  @include prefixed(transform, skew($deg, $deg2));
}
@mixin translate($x, $y:0) {
  @include prefixed(transform, translate($x, $y));
}
@mixin translate3d($x, $y: 0, $z: 0) {
  @include prefixed(transform, translate3d($x, $y, $z));
}
@mixin perspective($value: 1000) {
  @include prefixed(perspective, $value);
}
@mixin transform-origin($x:center, $y:center) {
  @include prefixed(transform-origin, $x $y);
}
```

## Mixins Reprefixed

bu prefix ise bazı durumlarda prefixed uygum olmuyor bunun tam tersi gerekiyor o yuzden
prefixed mixins inin tam tersine reprefixed adını verdim bunun kullanım alanı ise şu
şekilde olan css kodlarıdır.

örneğin:

```css
[width~="wmax"] {
  width: -webkit-max-content;
  width: -moz-max-content;
  width: -ms-max-content;
  width: -o-max-content;
  width: max-content;
}
```

şimdi bunu gibi bütün tarayıcılarda çalışacak olan css maks genişlik için prefixed uygun
olmuyor bu yüzden bu şekilde bir reprefixed işimizi görecektir.

```sass
@mixin reprefixed($property, $value) {
    #{$property}: -webkit-#{$value};
    #{$property}: -moz-#{$value};
    #{$property}: -ms-#{$value};
    #{$property}: -o-#{$value};
    #{$property}: #{$value};
}
```

### Kullanımı :

```sass
[width~="wmax"] {
     @include reprefixed(width,max-content);
}
```

hepsi bu kadar.

## Mixins Gradient İşlemleri

```sass
@mixin gradient($startColor: #eee, $endColor: white) {
    background-color: $startColor;
    background: -webkit-gradient(linear, left top, left bottom, from($startColor), to($endColor));
    @include prefixed(background,linear-gradient(top, $startColor, $endColor));
}
@mixin horizontal-gradient($startColor: #eee, $endColor: white) {
     background-color: $startColor;
    background-image: -webkit-gradient(linear, left top, right top, from($startColor), to($endColor));
    @include prefixed(background-image,linear-gradient(left, $startColor, $endColor))
}
```

## Hover İşlemleri

şu kodu yazarak istediğiniz gibi bir nesneye hover ayarı yapabilirsiniz hover
özelliğinden yararlanırken hover,active ve focus gibi özellikleri'de kullanırsanız her
tarayıcıda aynı çalışmasını sağlarsınız mesela chrome da hover direk çalışırken
safari'de hover çalışmıyor focus yapınca çalışıyor bu yüzden bu gibi işlemlerde hepsini
kullanmanız iyi olacaktır örnek olarak

```sass
@mixin hover($name, $property, $value){
  [hover~="#{$name}"]{
    &:hover,&:focus,&:active
    {#{$property}:$value;}
  }
}
```

örneğin bu sass kodu ile basit hover işlemlerinizi yapabilirsiniz ama hover uygularken
bazı hover durumları bütün tarayıcılarda aynı çalışmaz o zaman bu durumda şöyle bir kod
yazmamız gerekecektir.

```sass
@mixin hover-prefixed($name,$property, $value){
  [hover~="#{$name}"]{
    &:hover,&:focus,&:active{
      @include prefixed($property, $value);
    }
  }
}
```

işte bu kod ile artık bütün hover işlemlerimiz bütün tarayıcılarda aynı çalışacaktır
bunu bir kaç örnek ile daha iyi anlayacaksınız.

örnekler :

```sass
@include hover(txt-xl,font-size, 24px);
/*html içine şu şekilde yazdığınızda <div hover="txt-xl">hover xl</div> ve fare üzerine geldiğinizde hover işlemi uygulanacaktır.*/

/* aşağıdaki örneklerin kullanımıda aynı ilk yazılan çağırma parametresi */

/* color ayarı */
@include hover(c-muted,color,#f1f1f1);
/* örneğin burda <div hover="c-muted"></div> şeklinde

/* arkaplanı renklerinin ayarı */
@include hover(bg-muted,background-color, $c-muted);

/* opacity */
@include hover(o-0,opacity,0);
@include hover(o,opacity,1);

/* border-radius ayarı */
@include hover-prefixed(br-circle,border-radius, 50%);
/* bu özellikler prefixed'e ihtiyac duyan özelliklerdir. bu yüzden bu şekilde kullandık.

/* border color özelliği */
@include hover-prefixed(brc-white,border-color, $c-white);
```

## Son Olarak Sık Kullandığım Bir Sınıf Olan Media'yı Görelim.

mixins değil ama siz bunu mixin haline getirebilirsiniz, css kodlarımda display flex
kullandığım için çok fazla media etiketine ihtiyaç duymuyorum flex yapısı direk mobil
uyumlu hale geliyor yazarken biraz dikkatlı olursanzı ayrıca mobil için kodlamanız
gerekmez, ama bazı durumlarda gerekli oluyor işte bunun için ben şunu kullanıyorum

```css
.media {
  /* taşmaması için overflow ve margin ayarı */
  overflow-x: auto;
  width: 50%; /* aşağıdaki ekranlardan daha büyük olan ekranlar için olan genişlik ayarı */
  margin: auto;
  @media screen and (max-width: 900px) {
    /* tablet ve pc için */
    width: 80%;
  }
  @media screen and (max-width: 700px) {
    /* bu ekran boyutuna sahip tablet, mobil veya pc için */
    width: 90%;
  }
  @media screen and (max-width: 500px) {
    /* mobil ve daha düşün
        width: 96%;
    }
    @media screen and (max-width: 300px) { /* daha küçün ekranlı mobil ve daha düşük */
    width: 98%;
  }
}
```

işte bu kod ile hem responsive hemde bütün tarayıclarda çalışan css kodu yazabiliyorum.

okuduğunuz için teşekkürler, görüşmek üzere :\)
