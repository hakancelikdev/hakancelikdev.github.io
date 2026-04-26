---
publishDate: 2026-04-26T00:00:00Z
author: Hakan Çelik
title: "RAG Nedir? Yapay Zekaya Hafıza Kazandırmanın Yolu"
excerpt: "RAG öğrenmeden önce AI'a ham context veriyordum ve çok fazla yanlış cevap alıyordum. RAG sonrasında her şey değişti. Cursor ve Claude Code'un proje dizinini nasıl 'anladığını' da meğer bu açıklıyormuş."
category: Yapay Zeka
image: ~/assets/images/blog/rag.jpg
tags:
  - yapay-zeka
  - rag
  - makine-öğrenimi
  - llm
  - embedding
---

## Önce Sorun: AI'a Ham Context Vermek

Bir AI projesi üzerinde çalışırken dokümanlarımı, notlarımı veya kod tabanımı AI'a şöyle veriyordum:

```
[Tüm doküman metni buraya yapıştır] + [Sorum]
```

Sonuç? Çok fazla **hallucination**. AI alakasız bilgileri cevaba karıştırıyor, gerçek olmayan referanslar üretiyor, bazen doğrudan yanlış cevap veriyordu.

Sorun modelde değildi. Sorun **nasıl context verdiğimdeydi.**

İşte RAG tam bu noktada devreye giriyor.

---

## RAG Nedir?

**RAG** — Retrieval-Augmented Generation (Erişim Destekli Üretim).

Türkçeye çevirmek zor çünkü kavramı iyi özetliyor: önce **retrieval** (ilgili bilgiyi geri getir), sonra **generation** (bu bilgiyle cevap üret).

Sade bir tanımla:

> AI'a tüm bilgiyi körce vermek yerine, soruyla **en alakalı** parçaları bulup sadece onları vermek.

Ama bunun için önce verinin **aranabilir** hale getirilmesi gerekiyor. İşte burada **embedding** ve **indexleme** giriyor.

---

## Embedding Nedir? Anlamı Sayıya Dönüştürmek

Bir cümleyi düşünün:

> "Python ile web scraping nasıl yapılır?"

Bilgisayar bu cümleyi anlamaz — sadece karakterler görür. Ama bir **embedding modeli** bu cümleyi bir sayı vektörüne dönüştürür:

```
[0.23, -0.87, 0.14, 0.55, ..., -0.31]  → 768 veya 1536 boyutlu bir vektör
```

Sihir şurada: **anlam bakımından benzer cümleler, uzayda birbirine yakın vektörler üretir.**

```
"Python web scraping"       → [0.23, -0.87, 0.14, ...]
"requests ile veri çekme"   → [0.21, -0.85, 0.16, ...]  ← yakın!
"Java ile dosya okuma"      → [-0.61, 0.42, -0.33, ...] ← uzak
```

Bu sayede "konuya yakın olan nedir?" sorusunu, vektörler arası mesafe hesabıyla yanıtlayabiliyorsunuz. Buna **semantic search** (anlamsal arama) denir — anahtar kelime aramasından çok daha güçlü.

---

## RAG'ın Çalışma Adımları

RAG iki ayrı süreçten oluşur: **indexleme** (bir kez yapılır) ve **sorgulama** (her soruda yapılır).

### 1. Aşama: İndexleme (Hazırlık)

```
Dokümanlar / Kod / Notlar
         ↓
   Parçalara Böl (chunking)
         ↓
   Her Parçayı Embede Et
         ↓
  Vektör Veritabanına Kaydet
```

Belgelerinizi küçük parçalara (chunk) bölersiniz. Chunk boyutu kritik bir karardır:

- **Çok büyük chunk** (1000+ token): alakasız bilgi de içeri giriyor, LLM'in odağı dağılıyor
- **Çok küçük chunk** (50 token altı): cümle bağlamı kopuyor, anlam kaybolabiliyor
- **Pratik başlangıç noktası**: 300-500 token, %10-20 overlap

**Overlap** neden gerekli? Bir cümle chunk sınırında ikiye bölünürse her iki parçada da içeriği görmek isteriz. Overlap, bu sınır bölgesindeki bilginin kaybolmamasını sağlar.

Her parçayı embedding modelinden geçirip vektöre çevirirsiniz. Bu vektörleri bir **vektör veritabanında** (Chroma, Pinecone, Weaviate, pgvector...) saklarsınız.

Bu işlem **bir kez yapılır** ve veriler değişmediği sürece tekrar edilmez.

### 2. Aşama: Sorgulama (Her Soruda)

```
Kullanıcı Sorusu
      ↓
  Soruyu Embede Et
      ↓
  Vektör DB'den En Yakın K Parçayı Getir
      ↓
  Soru + Getirilen Parçalar = Prompt
      ↓
  LLM'e Gönder → Cevap
```

Kullanıcı bir soru sorduğunda, o soruyu da embede edersiniz. Sonra vektör veritabanında bu soruya en yakın (anlamsal olarak en benzer) chunk'ları bulursunuz. Bu chunk'ları soruyla birleştirip LLM'e gönderirsiniz.

Sonuç: LLM artık tüm dokümanı değil, **soruyla gerçekten ilgili parçaları** görüyor.

---

## Neden Bu Kadar Fark Yaratıyor?

RAG öncesi yaklaşımım:

```
PROMPT = sistem_promptu + tüm_doküman_metni + soru
```

**Sorunlar:**
- Context window'u dolduruyor (GPT-4'te bile limit var)
- AI alakasız metinlerden "halüsinasyon" üretiyor
- Maliyet artıyor (daha fazla token = daha fazla para)
- Cevap kalitesi düşüyor

RAG sonrası yaklaşım:

```
alakali_parca = vektör_db.ara(soru, k=5)
PROMPT = sistem_promptu + alakali_parca + soru
```

**Sonuçlar:**
- Context window verimli kullanılıyor
- AI sadece konuyla ilgili bilgiyi görüyor
- Hallucination dramatik biçimde düşüyor
- Cevap kalitesi yükseliyor

---

## "Aha!" Anı: Cursor RAG Kullanıyor — Claude Code Farklı Çalışıyor

Bir gün Cursor'un ayarlarına baktım. "Codebase indexing" diye bir bölüm var — proje dizinini tararken bir ilerleme göstergesi çıkıyor. _"Bu ne yapıyor acaba?"_ diye düşünmüştüm.

Meğer bu tam olarak **RAG indexleme adımıydı**.

**Cursor** projenizi açtığında klasik RAG uygular:
1. Tüm kaynak dosyalarınızı küçük parçalara böler
2. Her parçayı bir embedding modelinden geçirir
3. Vektörleri local bir veritabanında saklar

Siz `@codebase` yazıp bir soru sorduğunuzda:
1. Sorunuzu embede eder
2. En alakalı kod parçalarını bulur
3. Bunları GPT-4 / Claude'a gönderir

**Claude Code** ise farklı bir yaklaşım kullanır — önceden indexleme yapmaz. Bunun yerine bir yazılımcı gibi projeyi dinamik olarak araştırır: `Glob` ile dosya arar, `Grep` ile içerik tarar, `Read` ile okur. Hangi dosyaların alakalı olduğuna her sorguda yeniden karar verir. Bu RAG'ın tam karşılığı değil, ama aynı temel fikri paylaşır: **LLM'e tüm kodu değil, ilgili parçaları ver**.

Bu farkındalık her şeyi değiştirdi. Artık bu araçların "sihirli bir şekilde kodu anladığını" değil, **ölçülü ve akıllıca seçilmiş context ile LLM'i yönlendirdiğini** biliyorum. Yöntem farklı, ama sonuçtaki mantık aynı.

---

## Basit Bir RAG Uygulaması

Kendi RAG pipeline'ınızı birkaç satırda kurabilirsiniz:

```python
from sentence_transformers import SentenceTransformer
from anthropic import Anthropic
import chromadb

# Embedding modeli — metni vektöre çeviren küçük bir AI modeli
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# Vektör veritabanı
client = chromadb.Client()
collection = client.create_collection("belgeler")

# --- İNDEXLEME (bir kez çalıştırılır) ---
belgeler = [
    "Python ile web scraping requests kütüphanesiyle yapılır.",
    "Django bir Python web framework'üdür.",
    "RAG, LLM'lere dış bilgi eklemenin yoludur.",
]

for i, belge in enumerate(belgeler):
    embedding = embed_model.encode(belge).tolist()
    collection.add(documents=[belge], embeddings=[embedding], ids=[str(i)])

# --- SORGULAMA (her soruda çalıştırılır) ---
soru = "Web scraping nasıl yapılır?"
soru_embedding = embed_model.encode(soru).tolist()

sonuclar = collection.query(query_embeddings=[soru_embedding], n_results=2)
ilgili_parcalar = sonuclar["documents"][0]

# Prompt'u oluştur
prompt = f"""Aşağıdaki bilgilere dayanarak soruyu yanıtla.
Bilgilerde cevap yoksa "Bilmiyorum" de.

Bilgiler:
{chr(10).join(f"- {p}" for p in ilgili_parcalar)}

Soru: {soru}"""

# LLM'e gönder ve cevabı al
llm = Anthropic()
mesaj = llm.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": prompt}]
)

print(mesaj.content[0].text)
```

Burada iki farklı AI modeli kullanıyoruz: biri embedding için (`all-MiniLM-L6-v2`), biri cevap üretmek için (`claude-opus-4-6`). İkisi de birer "derlenmiş binary" — farklı işler için özelleşmiş.

---

## RAG'ı İyileştirmenin İki Yolu

Temel RAG iyi bir başlangıç noktası, ama gerçek projelerde iki önemli adım daha var.

### Hybrid Search: Semantic + Keyword

Salt semantic search her zaman yeterli değildir. "Django 4.2 release notes" gibi spesifik bir sorgu için kelime eşleşmesi, anlam benzerliğinden daha doğru sonuç verir.

**Hybrid search** ikisini birleştirir:
- **BM25** (keyword search) — tam kelime eşleşmesi, isimlere ve kodlara güçlü
- **Semantic search** — anlam yakınlığı, parafrazlara güçlü
- İkisinin skorları birleştirilerek sıralanır

Çoğu modern RAG sistemi (%60 semantic + %40 keyword gibi) bir ağırlıkla çalışır.

### Reranking: İkinci Bir Eleme

İlk retrieval adımı hızlı ama kaba bir eleme yapar. Reranking bu sonuçları daha pahalı ama daha doğru bir model ile yeniden sıralar:

```
Vektör DB → İlk 20 chunk → Reranker → En iyi 5 chunk → LLM
```

Reranker modeller (Cohere Rerank, `cross-encoder/ms-marco-MiniLM-L-6-v2`) soruyu ve her chunk'ı birlikte değerlendirir — bu yüzden çok daha isabetli sonuç verir ama daha yavaştır. Bu yüzden retrieval → rerank → generate şeklinde bir pipeline kurulur.

---

## RAG vs. Fine-tuning: Hangisi Ne Zaman?

Bu iki kavram sıkça karıştırılır:

| | RAG | Fine-tuning |
|---|---|---|
| **Ne yapar?** | Sorguda alakalı veri ekler | Modelin ağırlıklarını günceller |
| **Veri güncellenebilir mi?** | Evet, kolayca | Hayır, yeniden eğitim gerekir |
| **Maliyet** | Düşük (sadece indexleme) | Yüksek (GPU, zaman) |
| **Ne zaman kullanılır?** | Dış bilgi tabanı, doküman arama | Özel ton/davranış, alan uzmanlığı |

Çoğu uygulamada RAG, fine-tuning'den **önce** denenmelidir. Sorunun çoğu aslında "modelin yeterince akıllı olmaması" değil, "modelin doğru bilgiye erişememesidir."

---

## Sonuç

RAG'ı öğrenmeden önce AI'ı yanlış kullanıyordum: tüm veriyi körce context'e dolduruyordum ve neden yanlış cevaplar aldığımı anlayamıyordum.

RAG'ın özü şu:

> **AI'a ne kadar çok şey verdiğin değil, ne kadar doğru şeyi verdiğin önemlidir.**

Ve bir gün Cursor'un "Codebase indexing" çubuğunu izlerken şunu fark ettim: dünyanın en gelişmiş kod editörleri de aynı fikri kullanıyor. Ölçek farklı, mantık aynı.

Bu bakış açısını kazandıktan sonra, AI ile çalışmak çok daha öngörülü bir hal aldı.
