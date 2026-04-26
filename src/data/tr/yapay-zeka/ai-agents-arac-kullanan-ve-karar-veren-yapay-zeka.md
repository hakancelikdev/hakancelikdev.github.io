---
publishDate: 2026-04-26T14:00:00Z
author: Hakan Çelik
title: "AI Agents: Araç Kullanan ve Kendi Kararlarını Veren Yapay Zeka"
excerpt: "Bir dil modeli soru sorar, cevap alırsın. Bir AI agent ise hedef alır, plan yapar, araç kullanır ve sonuç üretir. Bu fark, AI'ı bir chatbot'tan bir iş ortağına dönüştürür."
category: Yapay Zeka
series: "AI Temelleri"
seriesIndex: 7
image: ~/assets/images/blog/ai-agents.jpg
tags:
  - yapay-zeka
  - ai-agents
  - tool-use
  - llm
  - otomasyon
---

## Chatbot ile Agent Arasındaki Fark

Bir dil modeliyle normal bir konuşma şöyle işler:

```
Kullanıcı → Soru → Model → Cevap
```

Siz sorar, model cevaplar. Tek turlu, tek yönlü.

Bir AI agent ise farklı çalışır:

```
Kullanıcı → Hedef
               ↓
           Model (düşünür)
               ↓
           Araç kullanır (web ara, kod çalıştır, API çağır...)
               ↓
           Sonucu değerlendirir
               ↓
           Yeniden düşünür / tekrar araç kullanır
               ↓
           Nihai çıktı → Kullanıcı
```

Agent, hedefe ulaşmak için kendi kararlarını alır. Hangi araçları hangi sırayla kullanacağını kendisi belirler. Gerekirse planını değiştirir.

---

## Ajanın Üç Bileşeni

Her AI agent üç temel parçadan oluşur:

### 1. Beyin (LLM)

[Bir AI modeli](/ai-modeli-derlenmis-bir-programdir) — akıl yürütme, planlama ve karar verme buradan gelir. Agent, modelin düşünme kapasitesini bir döngü içinde tekrar tekrar kullanır.

### 2. Araçlar (Tools)

Modelin yapamayacağı şeyleri yapan fonksiyonlar:
- Web araması
- Kod çalıştırma
- Dosya okuma/yazma
- API çağrısı
- Veritabanı sorgusu
- E-posta gönderme

Model, bu araçları ne zaman ve nasıl kullanacağına kendisi karar verir.

### 3. Hafıza (Memory)

Önceki adımların sonuçları, araç çıktıları ve konuşma geçmişi — bunların tümü [context window'da](/token-nedir-context-window-ve-ai-ucretlendirmesi) yaşar. Agent her adımda bu birikmiş bağlamı kullanır.

---

## ReAct: Düşün → Davran → Gözlemle

En yaygın agent mimarisi **ReAct** (Reason + Act) döngüsüdür:

```
Düşünce (Thought): "Kullanıcı EUR/TRY kurunu soruyor.
                    Güncel kur için web araması yapmalıyım."
        ↓
Eylem (Action):    web_search("EUR TRY kur 2026")
        ↓
Gözlem (Observation): "1 EUR = 38.42 TRY (26 Nisan 2026)"
        ↓
Düşünce (Thought): "Kuru buldum. Kullanıcıya verebilirim."
        ↓
Yanıt (Final Answer): "Güncel EUR/TRY kuru: 38.42"
```

Model her adımda hem düşünür hem davranır. Bu döngü hedefe ulaşılana kadar devam eder.

---

## Araç Kullanımı: Function Calling

Modern API'lerde araçlar, modele JSON şeması olarak tanımlanır. Model, hangi aracı kullanacağına karar verince API bunu yapılandırılmış bir nesne olarak döner — sizin kodunuz aracı çalıştırır, sonucu modele geri gönderirsiniz.

```python
from anthropic import Anthropic

client = Anthropic()

# Araç tanımları
tools = [
    {
        "name": "web_search",
        "description": "İnternette güncel bilgi arar",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Arama sorgusu"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "hesap_makinesi",
        "description": "Matematiksel hesaplama yapar",
        "input_schema": {
            "type": "object",
            "properties": {
                "ifade": {"type": "string", "description": "Hesaplanacak ifade"}
            },
            "required": ["ifade"]
        }
    }
]

mesajlar = [{"role": "user", "content": "1 EUR kaç TRY? 500 EUR'u TRY'ye çevir."}]

# Agent döngüsü
while True:
    yanit = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        tools=tools,
        messages=mesajlar
    )

    if yanit.stop_reason == "end_turn":
        # Model bitti, son cevabı al
        print(yanit.content[0].text)
        break

    if yanit.stop_reason == "tool_use":
        # Model araç kullanmak istiyor
        for blok in yanit.content:
            if blok.type == "tool_use":
                # Aracı çalıştır (gerçek implementasyon)
                if blok.name == "web_search":
                    sonuc = web_search(blok.input["query"])
                elif blok.name == "hesap_makinesi":
                    sonuc = eval(blok.input["ifade"])

                # Sonucu modele geri gönder
                mesajlar.append({"role": "assistant", "content": yanit.content})
                mesajlar.append({
                    "role": "user",
                    "content": [{"type": "tool_result", "tool_use_id": blok.id, "content": str(sonuc)}]
                })
```

---

## Kod Asistanları Neden Agent Gibi Davranır?

Modern kod asistanları dosya okuma, kod yazma, terminal komutu çalıştırma, dosya arama ve içerik tarama gibi araçlara erişerek çalışır. Bir görev aldıklarında hangi aracı hangi sırayla kullanacaklarına karar verir, ara sonuçları değerlendirir ve planlarını günceller.

Bu yaklaşım, [RAG](/rag-nedir-retrieval-augmented-generation) yazısında anlattığım "dinamik araştırma" fikriyle de örtüşür: sabit bir tek adım yerine, ihtiyaç oldukça ilgili bilgiye gidip geri dönmek.

---

## Multi-Agent: Ajanların İş Birliği

Tek bir agent her şeyi yapamaz — context window [token sınırlıdır](/token-nedir-context-window-ve-ai-ucretlendirmesi), dikkat dağılır, karmaşık görevler için yetersiz kalır.

Multi-agent sistemlerde birden fazla agent iş birliği yapar:

```
Orkestratör Agent
    ├── Araştırma Agentı  (web arama, bilgi toplama)
    ├── Kod Agentı        (kod yazma, test etme)
    └── Yazı Agentı       (raporlama, özetleme)
```

Orkestratör görevi parçalar, alt agentlara delege eder, sonuçları birleştirir. Her agent kendi context window'unda çalışır — paralel ve verimli.

---

## Agent'ların Zorlukları

**1. Token maliyeti yüksektir.**
Her araç çağrısı, düşünce adımı ve gözlem [token](/token-nedir-context-window-ve-ai-ucretlendirmesi) tüketir. Uzun bir agent döngüsü, tek bir API çağrısının on katı token harcayabilir.

**2. Hata yayılımı.**
Erken adımdaki bir yanlış karar sonraki adımları etkiler. İyi bir agent, belirsizlikle nasıl başa çıkacağını bilmeli veya kullanıcıya sormalıdır.

**3. Kontrol sorunu.**
Agent ne kadar özerk olmalı? Geri dönüşü olmayan bir eylemi (e-posta gönderme, dosya silme) yapmadan önce onay almalı mı? Bu kararlar, sistemin güvenliğini doğrudan etkiler.

---

## Sonuç

AI agent, dil modelini tek seferlik bir cevap makinasından, hedefe yönelik çalışan bir iş ortağına dönüştürür.

> **Model neyi bildiğini söyler. Agent neyi yapabileceğini gösterir.**

Bu serinin başında [model nedir](/ai-modeli-derlenmis-bir-programdir) sorusunu sorduk. Sonra [token'ların](/token-nedir-context-window-ve-ai-ucretlendirmesi) bu modelin temel birimi olduğunu gördük. [RAG](/rag-nedir-retrieval-augmented-generation) ile bilgiyi akıllıca besledik. [Prompt engineering](/prompt-engineering-ai-ile-nasil-konusulur) ile doğru konuşmayı öğrendik. [Fine-tuning](/fine-tuning-modeli-ne-zaman-ozellestirilir) ile modeli özelleştirdik. Agent ile hepsini eyleme döktük.
