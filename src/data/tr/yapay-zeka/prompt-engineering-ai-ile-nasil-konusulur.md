---
publishDate: 2026-04-26T10:00:00Z
author: Hakan Çelik
title: "Prompt Engineering: AI ile Doğru Konuşmanın Yolu"
excerpt: "Aynı modele aynı soruyu farklı şekilde sorduğunuzda tamamen farklı cevaplar alırsınız. Bu bir tesadüf değil — modeli nasıl yönlendirdiğiniz, aldığınız çıktıyı doğrudan belirler."
category: Yapay Zeka
image: ~/assets/images/blog/prompt-engineering.jpg
tags:
  - yapay-zeka
  - prompt-engineering
  - llm
  - prompt
---

## Aynı Model, Farklı Sonuçlar

İki farklı prompt deneyin:

**Prompt A:**
```
Özgeçmişimi düzelt.
[özgeçmiş metni]
```

**Prompt B:**
```
Kıdemli bir İK uzmanısın. Aşağıdaki özgeçmişi, teknoloji sektöründe
yazılım mühendisi pozisyonuna başvuran biri için güçlendir.
Güçlü fiiller kullan, ölçülebilir başarıları öne çıkar,
belirsiz ifadeleri somutlaştır. Orijinal yapıyı koru.

[özgeçmiş metni]
```

Her ikisi de aynı modele, aynı özgeçmişle gidiyor. Ama Prompt B, neredeyse her zaman işe yarar bir çıktı üretir. Prompt A ise tahmin edilemez.

İşte prompt engineering tam bu farkı kasıtlı olarak yaratmaktır.

---

## Bir Model Neye Göre Cevap Verir?

[Token nedir?](/token-nedir-context-window-ve-ai-ucretlendirmesi) yazısında modelin metni token token işlediğini gördük. Ama modelin cevabı nasıl şekillendirdiğini anlamak için bir adım daha ileri gitmek gerekiyor.

Bir dil modeli, verilen bağlama göre en olası devamı üretir. Bu demek ki: **ne kadar iyi bağlam verirsen, o kadar iyi devam üretir.**

Prompt engineering, bu bağlamı kasıtlı ve sistematik olarak şekillendirme sanatıdır.

---

## Prompt'un Anatomisi

Bir prompt genellikle üç katmandan oluşur:

```
┌─────────────────────────────────┐
│  Sistem Promptu                 │  ← Modelin rolü, kuralları, tonu
│  (System Prompt)                │
├─────────────────────────────────┤
│  Bağlam / Örnekler             │  ← Geçmiş konuşma, dökümanlar, örnekler
│  (Context / Examples)          │
├─────────────────────────────────┤
│  Kullanıcı İsteği              │  ← Asıl soru veya görev
│  (User Request)                │
└─────────────────────────────────┘
```

Her katman [token](/token-nedir-context-window-ve-ai-ucretlendirmesi) tüketir. İyi bir prompt, token bütçesini verimli kullanarak maksimum yönlendirme sağlar.

---

## Temel Teknikler

### 1. Rol Verme (Role Prompting)

Modele bir kimlik ver. Bu, modelin hangi "bilgi alanından" cevap ürettiğini etkiler.

```
❌ "Bu kodu incele."
✅ "Kıdemli bir Python geliştiricisi olarak bu kodu incele.
    Güvenlik açıkları, performans sorunları ve okunabilirlik
    açısından değerlendir."
```

### 2. Az Örnekli Öğrenme (Few-Shot Prompting)

Modele ne istediğini anlatmak yerine örnekle göster.

```
Aşağıdaki format ile müşteri şikayetlerini kategorile:

Şikayet: "Ürün 3 gün gecikmeyle geldi"
Kategori: Teslimat

Şikayet: "Ürün açıklamayla uyuşmuyordu"
Kategori: Ürün kalitesi

Şikayet: "İade sürecinde kimse dönmedi"
Kategori: Müşteri hizmetleri

Şikayet: "Paket hasar görmüştü"
Kategori:
```

Model, örnekleri gördükten sonra formatı otomatik olarak takip eder.

### 3. Adım Adım Düşünme (Chain-of-Thought)

Karmaşık görevlerde modelden önce düşünmesini isteyin.

```
❌ "Bu matematik problemini çöz: ..."
✅ "Bu matematik problemini adım adım çöz.
    Her adımı açıkla, sonra nihai cevabı ver."
```

Araştırmalar, bu tekniğin özellikle mantık gerektiren görevlerde doğruluğu önemli ölçüde artırdığını gösteriyor.

### 4. Çıktı Formatı Belirleme

Ne istediğinizi değil, nasıl istediğinizi de söyleyin.

```
Analizi şu formatta ver:
- Özet (1-2 cümle)
- Güçlü yönler (madde madde)
- Riskler (madde madde)
- Öneri (1 paragraf)
```

### 5. Sınırları Tanımlama

Modelin neyi yapmaması gerektiğini de söyleyin.

```
Türkçe yanıt ver.
Teknik jargon kullanma — hedef kitle teknik bilgisi olmayan yöneticiler.
Cevabı 3 paragrafla sınırla.
Bilmediğin şeyler için spekülasyon yapma.
```

---

## Sistem Promptu: Kalıcı Yönlendirme

Bir uygulama geliştirirken sistem promptu, modelin tüm konuşma boyunca uygulayacağı temel kurallardır. Her kullanıcı mesajından önce otomatik olarak eklenir.

```python
from anthropic import Anthropic

client = Anthropic()

sistem_promptu = """Sen bir yazılım dokümantasyon asistanısın.
- Her zaman Türkçe yanıt ver
- Kod örneklerini daima kod bloğu içinde göster
- Açıklamaları hem yeni başlayanlar hem deneyimliler anlayabilecek
  şekilde yap
- Eğer soru dokümantasyon konusu dışındaysa kibarca yönlendir"""

mesaj = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    system=sistem_promptu,
    messages=[
        {"role": "user", "content": "list.append() nasıl çalışır?"}
    ]
)

print(mesaj.content[0].text)
```

Sistem promptu [token](/token-nedir-context-window-ve-ai-ucretlendirmesi) tüketir — her API çağrısında. Prompt caching ile bu maliyeti önemli ölçüde azaltabilirsiniz.

---

## Sık Yapılan Hatalar

**1. Çok geniş, çok belirsiz sormak**
```
❌ "Bana iş fikirlerinden bahset"
✅ "İstanbul'da, 50.000₺ başlangıç bütçesiyle,
    tek kişi tarafından kurulabilecek 5 e-ticaret iş fikri öner.
    Her fikir için tahmini başlangıç maliyeti ve ilk 3 ayda
    yapılması gerekenler listele."
```

**2. Görevi bölmemek**
Karmaşık bir görevi tek promptla çözdürmeye çalışmak yerine, adımlara bölün. Model her adımda daha odaklı çalışır.

**3. Çıktıyı doğrulamamak**
Model ikna edici ama yanlış cevaplar üretebilir — özellikle güncel olaylar veya çok spesifik veriler için. Önemli çıktıları her zaman doğrulayın.

---

## Prompt Engineering ile RAG'ı Birleştirmek

[RAG](/rag-nedir-retrieval-augmented-generation), alakalı bilgiyi bulup context'e ekler. Prompt engineering ise bu context'i modele nasıl sunacağınızı belirler. İkisi birlikte kullanıldığında güç katlanır:

```python
# RAG'dan gelen ilgili parçalar
ilgili_bilgi = vector_db.ara(kullanici_sorusu, k=5)

# Prompt engineering ile birleştirme
prompt = f"""Sen bir müşteri destek uzmanısın.
Aşağıdaki ürün belgelerine dayanarak soruyu yanıtla.
Belgeler dışında bilgi kullanma — bilmiyorsan söyle.

Belgeler:
{ilgili_bilgi}

Soru: {kullanici_sorusu}

Yanıtını şu formatta ver:
- Doğrudan cevap (1-2 cümle)
- Detaylı açıklama
- İlgili belge bölümü (varsa)"""
```

---

## Sonuç

Prompt engineering ne sihir ne de şans. Modelin nasıl çalıştığını anlayıp bu mekanizmayı kasıtlı olarak kullanmaktır.

> **İyi bir prompt, modele ne yapacağını söyler. Mükemmel bir prompt, modeli doğru şeyi yapmak isteyecek konuma koyar.**

Bir [AI modelinin](/ai-modeli-derlenmis-bir-programdir) ne olduğunu, [token'ların](/token-nedir-context-window-ve-ai-ucretlendirmesi) nasıl çalıştığını ve [RAG'ın](/rag-nedir-retrieval-augmented-generation) bilgiyi nasıl beslediğini anladıktan sonra prompt engineering, bu üçünü birleştiren pratik beceridir.
