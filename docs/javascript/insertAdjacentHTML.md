# insertAdjacentHTML

`Element` arabiriminin `insertAdjacentHTML()` method'u, belirtilen metni ( text ) HTML
veya XML olarak parse eder ve sonuçlanan düğümleri belirtilen bir konumdaki ( position )
DOM ağacına ekler. Kullanıldığı elemanı yeniden parse etmez ve bu nedenle o elemanın
içindeki mevcut elemanları bozmaz. Bu, serileştirmenin fazladan adımını önler, doğrudan
`innerHTML` manipülasyonundan çok daha hızlı hale getirir.

## Sözdizimi ( Syntax )

```js
element.insertAdjacentHTML(position, text);
```

## Parametreler

- position: `Element`'e göre konumu temsil eden bir `DOMString` olmalıdır; seçenekler
  aşağıya yazılmıştır.
  - `beforebegin`: `Element`'in kendisinden önce.
  - `afterbegin`: `Element`'in hemen içinde, ilk çocuğundan önce.
  - `beforeend`: `Element`'in hemen içinde, son çocuğundan sonra.
  - `afterend`: `Element`'in kendisinden sonra.
- text: HTML veya XML olarak parse edilecek ve ağaca eklenecek string.

## Konum Adların Görselleştirelim

```html
<!-- beforebegin -->
<p>
  <!-- afterbegin -->
  foo
  <!-- beforeend -->
</p>
<!-- afterend -->
```

## Örnek

```js
// <div id="one">one</div>
var d1 = document.getElementById("one");
d1.insertAdjacentHTML("afterend", '<div id="two">two</div>');

// At this point, the new structure is:
// <div id="one">one</div><div id="two">two</div>
```

### Kaynak

https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
