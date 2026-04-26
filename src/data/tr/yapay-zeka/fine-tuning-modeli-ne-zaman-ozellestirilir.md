---
publishDate: 2026-04-26T12:00:00Z
author: Hakan Çelik
title: "Fine-Tuning: Bir AI Modelini Ne Zaman ve Nasıl Özelleştirirsiniz?"
excerpt: "Her AI problemi için fine-tuning şart değil — çoğu zaman gereksiz. Ama gerçekten gerektiği durumlarda nasıl çalıştığını, ne zaman RAG'ı tercih etmeniz gerektiğini ve LoRA'nın neden oyunun kurallarını değiştirdiğini anlattım."
category: Yapay Zeka
image: ~/assets/images/blog/fine-tuning.jpg
tags:
  - yapay-zeka
  - fine-tuning
  - lora
  - llm
  - makine-ogrenimi
---

## "Fine-Tuning Yapalım" Ne Zaman Doğru Bir Karar?

Bir AI projesi başladığında akla gelen ilk çözüm çoğu zaman fine-tuning oluyor: "Modeli kendi verilerimizle eğitelim, mükemmel sonuç verir."

Gerçek çoğunlukla farklı.

Fine-tuning pahalı, zaman alıcı ve her sorun için doğru araç değil. Ama gerçekten gerektiğinde — başka hiçbir şeyin veremeyeceği sonuçları veriyor.

---

## Fine-Tuning Nedir?

[Bir AI modeli indirdiğinizde](/ai-modeli-derlenmis-bir-programdir), milyarlarca parametreden oluşan, genel amaçlı eğitilmiş ağırlıklar indiriyorsunuz. Bu model pek çok şey yapabilir — ama her şeyi genel düzeyde yapıyor.

Fine-tuning, bu genel modeli alıp **kendi veri setinizle ek eğitimden geçirme** işlemidir. Model ağırlıkları güncellenir — tıpkı ilk eğitim gibi, ama çok daha küçük ölçekte ve çok daha az veriyle.

```
Genel Model (milyarlarca parametre, genel bilgi)
          ↓
  Fine-Tuning (kendi veri setiniz + gradient descent)
          ↓
Özelleştirilmiş Model (aynı mimari, güncellenmiş ağırlıklar)
```

[AI modeli yazısındaki](/ai-modeli-derlenmis-bir-programdir) derleme benzetmesini hatırlıyorsanız: fine-tuning, varolan binary üzerine ek bir derleme adımı uygulamak gibidir.

---

## Fine-Tuning vs RAG: Hangisini Seçmeli?

Bu soruyu doğru cevaplamak, hem zaman hem para tasarrufu sağlar.

| Soru | Fine-Tuning | RAG |
|---|---|---|
| Modele yeni **bilgi** mi katmak istiyorsun? | ✗ Zayıf | ✓ Güçlü |
| Modele yeni **davranış/ton** mı öğretmek istiyorsun? | ✓ Güçlü | ✗ Zayıf |
| Veriler sık güncelleniyor mu? | ✗ Her güncellemede yeniden eğitim | ✓ Index güncelleme yeterli |
| Yanıtlar kaynaklara referans vermeli mi? | ✗ Zor | ✓ Doğal |
| Bütçe kısıtlı mı? | ✗ Pahalı | ✓ Ucuz |

**Pratikte:**
- Kendi şirket dokümanlarınıza dayalı soru-cevap sistemi → **RAG**
- Modelin her zaman belirli bir yazı stiliyle yanıt vermesi → **Fine-tuning**
- Özel bir alan terminolojisini doğal kullanması → **Fine-tuning**
- Günlük güncellenen ürün kataloğu sorguları → **RAG**

[RAG yazısında](/rag-nedir-retrieval-augmented-generation) da belirttiğim gibi: sorunun büyük çoğunluğu "model yeterince akıllı değil" değil, "model doğru bilgiye erişemiyor." Bu durumlarda RAG, fine-tuning'den önce denenmeli.

---

## Full Fine-Tuning: Güçlü ama Pahalı

Klasik fine-tuning'de modelin **tüm ağırlıkları** güncellenir. Bu en güçlü yaklaşımdır — ama dezavantajları büyüktür:

- 7B parametreli bir modeli fine-tune etmek için ~14GB VRAM gerekir
- 70B model için endüstriyel GPU cluster'ı gerekir
- Eğitim saatler alır ve maliyetlidir
- Her güncelleme için süreç baştan tekrarlanır

Bu yüzden büyük çoğunluk için **parameter-efficient fine-tuning** yöntemleri tercih ediliyor.

---

## LoRA: Fine-Tuning'i Erişilebilir Kılan Yöntem

**LoRA** (Low-Rank Adaptation), 2021'de yayınlanan ve fine-tuning'i kökten değiştiren bir yaklaşım.

Temel fikir: modelin tüm ağırlıklarını güncellemek yerine, orijinal ağırlıklara **küçük adaptör matrisler** ekle. Eğitim sırasında sadece bu adaptörler güncellenir.

```
Orijinal Ağırlık Matrisi (W) — donuk, değişmez
          +
LoRA Adaptörü (A × B) — eğitilen küçük matrisler
          =
Efektif Ağırlık (W + AB)
```

Sonuç:

| | Full Fine-Tuning | LoRA |
|---|---|---|
| Eğitilen parametre | ~100% | ~0.1-1% |
| VRAM ihtiyacı | Çok yüksek | Düşük |
| Eğitim süresi | Uzun | Kısa |
| Kalite farkı | Referans | Genellikle %90-95 kalitede |
| Birden fazla görev | Ayrı model | Tek model + birden fazla adaptör |

**QLoRA** ise LoRA'yı kuantizasyonla birleştirir — 4-bit kuantize edilmiş modele LoRA adaptörü ekler. Tüketici GPU'ları (16-24GB VRAM) ile 7B-13B modelleri fine-tune etmek mümkün hale gelir.

---

## Pratik: Bir Modeli Fine-Tune Etmek

Modern fine-tuning için en yaygın araçlar:

**Hugging Face + PEFT kütüphanesi:**

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import get_peft_model, LoraConfig, TaskType

# Temel modeli yükle
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.2-3B")
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-3B")

# LoRA konfigürasyonu
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,           # rank — düşük = daha az parametre
    lora_alpha=32,  # ölçekleme faktörü
    lora_dropout=0.1,
    target_modules=["q_proj", "v_proj"]  # hangi katmanlar etkilenecek
)

# LoRA adaptörlerini ekle
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# Eğitilen parametre: ~4M / 3B (%0.1)
```

**Veri formatı** (instruction fine-tuning için):

```json
[
  {
    "instruction": "Aşağıdaki metni resmi bir dile çevir.",
    "input": "Merhaba, nasılsın? İyi misin?",
    "output": "Sayın ilgili, selamlarımı sunar, sağlık ve iyiliğinizi temenni ederim."
  }
]
```

Birkaç yüz ile birkaç bin kaliteli örnek, fine-tuning için genellikle yeterlidir. Veri kalitesi miktardan çok daha önemlidir.

---

## Ne Zaman Gerçekten Fine-Tuning Gerekir?

Şu senaryolarda fine-tuning düşünün:

1. **Tutarlı ton ve stil:** Tüm yanıtların belirli bir marka sesini yansıtması gerekiyor ve prompt engineering yeterli olmuyor.

2. **Alan spesifik görevler:** Tıp, hukuk, finans gibi alanlarda model genel terminolojiyi doğru ama nüanssız kullanıyor.

3. **Düşük gecikme + yüksek hacim:** Büyük bir modeli prompt engineering ile kullanmak yerine, küçük ama iyi fine-tune edilmiş bir model hem ucuz hem hızlı olabilir.

4. **Gizlilik:** Verilerinizi üçüncü taraf API'ye gönderemiyorsunuz — kendi altyapınızda fine-tune edilmiş model çalıştırmanız gerekiyor.

---

## Sonuç

Fine-tuning, AI araç kutusundaki en güçlü araçlardan biri — ama en sık ihtiyaç duyulan değil.

> **Sıralaması şöyle:** önce iyi bir [prompt](/prompt-engineering-ai-ile-nasil-konusulur) dene. Bilgiye erişim sorunuysa [RAG](/rag-nedir-retrieval-augmented-generation) ekle. Model davranışını kökten değiştirmen gerekiyorsa fine-tuning'e bak.

LoRA sayesinde fine-tuning artık büyük şirketlerin tekelinde değil. Doğru veri setiyle, tek bir tüketici GPU'suyla anlamlı sonuçlar almak mümkün.
