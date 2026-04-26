---
publishDate: 2026-04-26T04:00:00Z
author: Hakan Çelik
title: "Bir AI Modeli İndirdiğinizde Aslında Ne İndiriyorsunuz?"
excerpt: "AI modelleri birer binary dosyadır. Tıpkı derlenen bir C programı gibi, eğitilmiş bir model de artık kaynak kodundan bağımsız, çalıştırılmaya hazır bir varlıktır. Peki bu ne anlama geliyor?"
category: Yapay Zeka
series: "AI Temelleri"
seriesIndex: 1
image: ~/assets/images/blog/yapay-zeka.jpg
tags:
  - yapay-zeka
  - makine-öğrenimi
  - derin-öğrenme
  - model
---

## Zihin Değiştiren Bir Benzetme

Bir AI modelini ilk kez indirdiğinizde muhtemelen şöyle düşünürsünüz: _"Birkaç gigabyte'lık bir dosya indirdim, içinde bir şeyler var, Python bunu çalıştırıyor."_ Ama içinde ne olduğunu hiç düşündünüz mü?

İşte size zihin değiştiren bir bakış açısı:

**Bir AI modeli, derlenmiş bir binary programdır.**

Tıpkı `.exe` veya bir Linux ikili dosyası gibi. Sadece çok daha farklı bir "donanım" üzerinde — matematiksel operasyonlar üzerinde — çalışıyor.

---

## Geleneksel Programlama: Kaynak Kod → Derleme → Binary

Klasik yazılım geliştirmeyi düşünün:

```
Kaynak Kod (C, Go, Rust...)
        ↓
    Derleyici
        ↓
  Binary / Executable
```

Bir C programı yazarsınız. Derleyici bu kodu makine talimatlarına çevirir. Ortaya çıkan `.exe` veya ikili dosya artık kaynak kodundan **bağımsızdır** — içine bakıp "bu fonksiyon şunu yapıyor" diyemezsiniz. Sadece çalıştırırsınız.

---

## AI Eğitimi: Veri + Mimari → Eğitim → Model Ağırlıkları

AI modelleri de aynı mantıkla çalışır, sadece farklı bir dil ve farklı bir derleyiciyle:

```
Eğitim Verisi + Mimari (kaynak kod)
              ↓
     Eğitim Süreci (derleyici)
              ↓
  Model Ağırlıkları (binary)
```

| Geleneksel Yazılım | AI Modeli |
|---|---|
| Kaynak kod (`.c`, `.go`) | Eğitim verisi + mimari kodu |
| Derleyici (`gcc`, `rustc`) | Eğitim döngüsü (gradient descent) |
| Binary / Executable | Model ağırlıkları (`.gguf`, `.safetensors`) |
| CPU/GPU talimatları | Matris çarpımları, aktivasyon fonksiyonları |

Bir modeli **eğitmek**, onu **derlemek** demektir. Ve eğitim tamamlandığında elimizde kalan şey — tüm bu milyarlarca parametre — derlenmiş bir binary'dir.

Model ağırlıkları belirli bir **mimariye** bağlıdır: kaç katman, kaç attention head, hangi boyut. Aynı `.gguf` dosyasını farklı bir mimariye yükleyemezsiniz — tıpkı x86 için derlenen bir binary'yi ARM işlemcide çalıştıramadığınız gibi.

---

## Model Dosyaları: Modern Dönemin Binary Formatları

Bir AI modelini indirdiğinizde karşınıza çıkan dosya formatlarına bakın:

- **`.gguf`** — llama.cpp ekosistemi için optimize edilmiş format (LLaMA, Mistral, Phi modelleri)
- **`.safetensors`** — HuggingFace'in güvenli tensor depolama formatı
- **`.onnx`** — Open Neural Network Exchange, platform bağımsız model formatı
- **`.pb`** — TensorFlow'un Protocol Buffer formatı
- **`.mlmodel`** — Apple'ın CoreML formatı

Bu dosyalar içinde binlerce, milyonlarca, hatta milyarlarca **float sayısından** oluşan devasa tablolar var. İşte bunlar model ağırlıkları — yani "derlenmiş beyin."

Bir `.gguf` dosyasını metin editörüyle açmayı deneyin. Göreceğiniz şey anlamsız binary veriden ibaret olacak. Tıpkı bir `.exe` dosyasını açmak gibi.

---

## "Hazır Beyin" Metaforu

Bunu şöyle de düşünebilirsiniz:

Bir AI modeli eğitmek, milyonlarca saatlik insan deneyimini (metin, görüntü, ses) alıp bunları bir "beyin yapısına" **sıkıştırmak** demektir. Bu süreç tamamlandığında ortaya çıkan model:

- Belirli bir iş için **özelleşmiş**
- Çalıştırılmaya **hazır**
- Kaynak veriden **bağımsız**

Hugging Face'den bir model indirdiğinizde, birisi o modeli eğitmek için harcadığı milyonlarca dolarlık hesaplama gücünün, terabyte'larca verinin ve aylarca süren çalışmanın **sıkıştırılmış çıktısını** indiriyorsunuz.

Bu, bir şirketten derleme ortamı kurmadan hazır bir `.exe` indirmekten çok daha büyülü bir şey.

---

## Kuantizasyon: Derleyici Optimizasyonu

Derleyicilerle çalıştıysanız `-O2` veya `-O3` optimizasyon bayraklarını bilirsiniz. Derleme sırasında kod küçülür, hızlanır — ama biraz hassasiyet kaybedebilir.

AI dünyasındaki karşılığı **kuantizasyon**dur:

- **FP32** → **INT8**: 32-bit float sayıları 8-bit tam sayılara dönüştür
- **Q4_K_M**, **Q5_K_S**: llama.cpp'deki özel kuantizasyon seviyeleri
- Sonuç: Dosya boyutu 4x küçülür, RAM kullanımı düşer, hız artar — minimal doğruluk kaybıyla

70 milyar parametreli bir modeli 4-bit kuantizasyonla ~40GB'dan ~20GB'a indirip sıradan bir bilgisayarda çalıştırabilirsiniz. Bu, derleyici optimizasyonunun AI dünyadaki versiyonudur.

---

## Neden Bu Bakış Açısı Önemli?

Bu benzetmeyi anlamak birkaç önemli sonuç doğurur:

**1. Modeli "okuyamazsınız"**

Binary'i reverse engineer etmeden kaynak kodu göremediğiniz gibi, model ağırlıklarına bakıp "bu ağırlık şu kavramı temsil ediyor" diyemezsiniz (çok sınırlı ölçüde mechanistic interpretability çalışmaları bunu yapmaya çalışıyor, ama hâlâ erken aşamada).

**2. Eğitim verisi = kaynak kod**

Bir modelin "ne öğrendiğini" anlamak için eğitim verisine bakmak gerekir — tıpkı programın kaynak koduna bakmak gibi. Model ağırlıkları bize bu bilgiyi doğrudan vermez.

**3. Fine-tuning = yeniden derleme**

Bir modeli fine-tune etmek, varolan binary'yi alıp üzerine ek bir derleme adımı uygulamak gibidir. Temel yetenekler korunur, yeni davranışlar eklenir.

**4. Model boyutu ≠ yetenek**

Büyük binary her zaman daha iyi program anlamına gelmez. Mimarisi iyi tasarlanmış, kaliteli veriyle eğitilmiş küçük bir model, büyük ama kalitesiz bir modeli geçebilir. Llama 3.2 3B, eski GPT-3 175B'yi birçok görevde geçiyor.

---

## Pratik: Bir Modeli Gerçekten Çalıştırmak

Teoriden çıkıp somutlaşalım. Ollama ile yerel bir model indirip çalıştırmak birkaç komut:

```bash
# Modeli indir (~4GB — bu sizin "binary"niz)
ollama pull llama3.2

# Doğrudan sohbet et
ollama run llama3.2

# Ya da REST API olarak kullan (port 11434)
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Merhaba, nasılsın?",
  "stream": false
}'
```

`ollama pull` komutu tam olarak "binary indirme" adımıdır. `ollama run` ise o binary'yi belleğe yükleyip çalıştırmaktır. Arada derleme yok, kaynak kod yok — sadece ağırlıklar ve mimari.

Bu arada: embedding modelleri de birer AI modelidir. `ollama pull nomic-embed-text` dediğinizde indirdiğiniz şey, metni vektöre dönüştürmek için özelleştirilmiş başka bir "binary beyin"dir. Bu konu RAG ile doğrudan bağlantılı — RAG'ın indexleme adımında tam olarak bu embedding modellerini kullanıyorsunuz.

---

## Sonuç

Bir dahaki sefere Hugging Face'den model indirdiğinizde ya da Ollama ile `ollama pull llama3` yazdığınızda, şunu aklınızda tutun:

> **Milyarlarca sayıdan oluşan, milyonlarca dolarlık hesaplama gücüyle derlenen, belirli bir iş için özelleştirilmiş, çalıştırılmaya hazır bir beyin indiriyorsunuz.**

AI modelleri gerçekten de modern yazılımın en ilginç binary formatlarıdır — sadece CPU talimatları yerine matris operasyonları çalıştırıyorlar.

Ve bu farkı anlamak, AI'ı hem daha iyi kullanmanızı hem de daha iyi sorgulamanızı sağlar.
