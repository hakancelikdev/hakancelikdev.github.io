---
publishDate: 2022-05-23T00:00:00Z
author: Hakan Çelik
title: "Özellikleri Anlamak"
excerpt: "Görüntü özelliklerinin ne olduğunu, neden önemli olduklarını ve köşelerin neden iyi özellikler olduğunu öğrenin. Özellik tespiti ve tanımlamanın temel kavramlarını anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 33
subcategory: Özellik Tespiti
image: /images/posts/opencv/feature_building.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Özellikleri Anlamak

## Hedefler

Bu bölümde sadece özelliklerin ne olduğunu, neden önemli olduklarını ve köşelerin neden önemli olduğunu anlamaya çalışacağız.

## Açıklama

Çoğunuz yapboz oyunlarını oynamıştır. Bir görüntünün birçok küçük parçasını alır ve bunları doğru şekilde bir araya getirerek büyük gerçek görüntüyü oluştururunuz. **Peki bunu nasıl yaparsınız?** Bu teoriyi bir bilgisayar programına yansıtırsak, bilgisayar yapboz oynayabilir mi? Eğer bilgisayar yapboz oynayabiliyorsa, neden güzel bir doğa manzarasının birçok gerçek hayat görüntüsünü bilgisayara vererek hepsini tek bir büyük görüntüde birleştirmesini söyleyemeyiz? Bilgisayar birkaç doğal görüntüyü tek bir görüntüde birleştirebiliyorsa, bir bina veya herhangi bir yapının çok sayıda fotoğrafını verip ondan 3D model oluşturmasını istemek ne olur?

Sorular ve hayaller devam eder. Ama hepsi şu en temel soruya dayanır: Yapbozları nasıl oynuyorsunuz? Çok sayıda karışık görüntü parçasını nasıl tek bir büyük görüntüye düzenliyorsunuz?

Cevap şu: Benzersiz, kolayca takip edilebilen ve kolayca karşılaştırılabilen belirli desenler veya belirli özellikler arıyoruz. Bu tür bir özelliğin tanımına gidersek, bunu sözcüklerle ifade etmek zor olabilir, ancak ne olduğunu biliyoruz. Eğer biri birkaç görüntü arasında karşılaştırılabilecek iyi bir özellik noktasını göstermenizi isteseydi, gösterebilirdiniz. Bu yüzden küçük çocuklar bile bu oyunları kolayca oynayabiliyor. Bu özellikleri görüntüde arıyoruz, buluyoruz, aynı özellikleri diğer görüntülerde arıyoruz ve hizalıyoruz. Peki bu özellikler nedir?

Bunu söylemek zor. Ama bazı resimlere bakıp farklı desenler arayacak olursak, ilginç bir şey keşfederiz. Örneğin aşağıdaki görüntüye bakın:

![Özellik binası](/images/posts/opencv/feature_building.jpg)

Görüntü çok basit. Görüntünün üstünde altı küçük görüntü parçası verilmiştir. Sizin için soru, bu parçaların orijinal görüntüdeki tam konumunu bulmaktır.

**A ve B** düz yüzeylerdir ve geniş bir alana yayılmıştır. Bu parçaların tam konumunu bulmak zordur.

**C ve D** çok daha basittir. Bunlar binanın kenarlarıdır. Yaklaşık bir konum bulabilirsiniz, ancak tam konum hâlâ zordur. Çünkü desen kenar boyunca her yerde aynıdır. Bununla birlikte kenarda farklıdır. Dolayısıyla kenar, düz alana kıyasla daha iyi bir özelliktir, ancak yeterince iyi değildir.

Son olarak, **E ve F** binanın bazı köşeleridir. Ve kolayca bulunabilirler. Çünkü köşelerde, bu parçayı nereye taşırsanız taşıyın, farklı görünür. Bu nedenle iyi özellikler olarak değerlendirilebilirler.

![Basit özellik](/images/posts/opencv/feature_simple.png)

Tıpkı yukarıdaki gibi, mavi yama düz alandır ve bulmak ve takip etmek zordur. Mavi yamayı nereye taşırsanız taşıyın aynı görünür. Siyah yama bir kenara sahiptir. Dikey yönde (yani gradyan boyunca) hareket ettirirseniz değişir. Kenar boyunca (kenara paralel) hareket ettirildiğinde aynı görünür. Ve kırmızı yama için, bu bir köşedir. Yamayı nereye taşırsanız taşıyın farklı görünür; bu benzersiz olduğu anlamına gelir. Yani temel olarak köşeler görüntüde iyi özellikler olarak kabul edilir. (Sadece köşeler değil, bazı durumlarda blob'lar da iyi özellikler olarak kabul edilir.)

Peki şimdi "bu özellikler nedir?" sorusunu yanıtladık. Ancak bir sonraki soru ortaya çıkıyor: Onları nasıl buluruz? Veya köşeleri nasıl buluruz? Bunu sezgisel bir şekilde yanıtladık: Etrafındaki tüm bölgelerde hareket ettirildiğinde (küçük miktarlarla) maksimum varyasyona sahip görüntü bölgelerini arıyoruz. Bu, sonraki bölümlerde bilgisayar diline yansıtılacak. Bu görüntü özelliklerini bulmak **Özellik Tespiti** olarak adlandırılır.

Özellikleri görüntülerde bulduk. Bir kez bulduktan sonra, aynısını diğer görüntülerde bulabilmemiz gerekir. Bu nasıl yapılır? Özelliğin etrafındaki bir bölge alıyoruz, onu kendi sözcüklerimizle açıklıyoruz ve aynı alanı diğer görüntülerde arıyoruz. Bu temelde özelliği tanımlamaktır. Benzer şekilde, bilgisayar da özellikleri başka görüntülerde bulabilmesi için özellik etrafındaki bölgeyi tanımlamalıdır. Bu tanımlamaya **Özellik Tanımlama** denir.

Bu modülde, özellikleri bulmak, tanımlamak, eşleştirmek vb. için OpenCV'deki farklı algoritmalara bakıyoruz.

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_feature2d/py_features_meaning/py_features_meaning.markdown)
