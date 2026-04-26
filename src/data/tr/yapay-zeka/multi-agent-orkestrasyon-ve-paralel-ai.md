---
publishDate: 2026-04-28T14:00:00Z
author: Hakan Çelik
title: "Multi-Agent Sistemler: Orkestrasyon ve Paralel AI"
excerpt: "Tek bir agent her şeyi yapamaz — context window dolar, dikkat dağılır. Multi-agent sistemlerde orkestratör görevi parçalar, subagent'lar paralel çalışır ve her biri kendi temiz context'iyle çalışır."
category: Yapay Zeka
series: "AI Temelleri"
seriesIndex: 8
image: ~/assets/images/blog/multi-agent.jpg
tags:
  - yapay-zeka
  - multi-agent
  - orkestrasyon
  - llm
  - otomasyon
---

## Tek Agent Neden Yetmez?

[AI agent'lar](/ai-agents-arac-kullanan-ve-karar-veren-yapay-zeka) bir hedef alır, araç kullanır, sonuca ulaşır. Küçük görevler için bu yeterli. Ama görev büyüdükçe üç problem ortaya çıkar:

**1. Context window dolar.**
Büyük bir codebase'i analiz etmek, yüzlerce dosyayı okumak ister. Tek bir [context window](/token-nedir-context-window-ve-ai-ucretlendirmesi) bunları taşıyamaz.

**2. Dikkat dağılır.**
Tek bir agent'a "hem güvenlik açıklarını bul, hem performansı analiz et, hem de dökümantasyon eksiklerini listele" dersen, üçünü de ortalama yapar. Her biri ayrı odaklanmayı hak eder.

**3. Her şey sıralı gider.**
Tek agent bir işi bitirip diğerine geçer. Bağımsız görevler paralel çalışabilirken sırada bekler.

Multi-agent sistemler bu üç problemi aynı anda çözer.

---

## Orkestratör / Subagent Mimarisi

```
Orkestratör Agent
    │
    ├──► Güvenlik Subagent'ı   → güvenlik açığı analizi
    │         (kendi context window'u)
    │
    ├──► Performans Subagent'ı → darboğaz analizi
    │         (kendi context window'u)
    │
    └──► Dökümantasyon Subagent'ı → eksik doc tespiti
              (kendi context window'u)
              │
              ▼
    Orkestratör sonuçları toplar ve birleştirir
```

**Orkestratör** — görevi parçalar, her parçayı uygun subagent'a delege eder, sonuçları alır ve birleştirir.

**Subagent** — tek bir göreve odaklanmış, kendi izole context window'unda çalışan agent. Orkestratörün ne yaptığını bilmez — sadece kendi görevini bilir.

Her subagent **temiz bir context window'la başlar**. Bu hem token [maliyetini](/token-nedir-context-window-ve-ai-ucretlendirmesi) düşürür, hem odağı korur.

---

## Paralel vs Sıralı: Hangi Durumda Ne?

Multi-agent tasarımın en kritik kararı bu:

| Görev yapısı | Yaklaşım | Neden |
|---|---|---|
| Görevler birbirinden bağımsız | **Paralel** | Aynı anda çalışırlar, toplam süre en uzun görev kadardır |
| Görev B, Görev A'nın çıktısına ihtiyaç duyuyor | **Sıralı** | B, A bitmeden başlayamaz |
| Bazı görevler bağımsız, bazıları bağımlı | **Karma** | Bağımsızları paralel, bağımlıları sıralı çalıştır |

Örnekler:

```
Paralel:  güvenlik analizi + performans analizi + doc analizi
          (üçü birbirinden bağımsız → aynı anda)

Sıralı:   araştırma → kod yazma → test yazma
          (kod, araştırmaya; test, koda bağımlı → sırayla)
```

---

## Pratik: Anthropic API ile Paralel Orkestrasyon

```python
import anthropic
from concurrent.futures import ThreadPoolExecutor, as_completed

client = anthropic.Anthropic()

def run_subagent(role: str, task: str, context: str) -> tuple[str, str]:
    """Tek bir subagent'ı çalıştırır"""
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=2048,
        system=f"Sen bir {role} uzmansın. Sadece bu role odaklan.",
        messages=[
            {"role": "user", "content": f"Kod:\n{context}\n\nGörev:\n{task}"}
        ]
    )
    return role, response.content[0].text

def orchestrate(codebase: str) -> str:
    """Orkestratör: görevi parçalar, paralel çalıştırır, birleştirir"""

    subagents = [
        ("güvenlik uzmanı", "Bu kodda güvenlik açıklarını listele."),
        ("performans uzmanı", "Bu kodda performans darboğazlarını listele."),
        ("teknik yazar",     "Bu kodda dökümantasyonu eksik fonksiyonları listele."),
    ]

    results = {}

    # Paralel çalıştır
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = {
            executor.submit(run_subagent, role, task, codebase): role
            for role, task in subagents
        }
        for future in as_completed(futures):
            role, result = future.result()
            results[role] = result

    # Orkestratör sonuçları birleştirir
    aggregation_prompt = f"""
Üç farklı analizin sonuçları:

Güvenlik: {results['güvenlik uzmanı']}

Performans: {results['performans uzmanı']}

Dökümantasyon: {results['teknik yazar']}

Öncelik sırasına göre bir özet rapor hazırla.
    """

    final = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=2048,
        messages=[{"role": "user", "content": aggregation_prompt}]
    )

    return final.content[0].text
```

Üç subagent paralel çalışır. Toplam süre en yavaş subagent kadardır, üçünün toplamı değil.

---

## Sıralı Pipeline: Bağımlı Görevler

```python
def sequential_pipeline(goal: str) -> str:
    """Birbirine bağımlı görevler için sıralı orkestrasyon"""

    # Adım 1: Araştırma
    research = run_subagent(
        "araştırmacı",
        f"Şu konu hakkında kapsamlı araştırma yap: {goal}",
        ""
    )[1]

    # Adım 2: Kod (araştırmayı input olarak alır)
    code = run_subagent(
        "yazılım geliştirici",
        f"Araştırmaya dayanarak implementasyon yaz.",
        f"Araştırma:\n{research}"
    )[1]

    # Adım 3: Test (kodu input olarak alır)
    tests = run_subagent(
        "test mühendisi",
        "Bu implementasyon için kapsamlı testler yaz.",
        f"Kod:\n{code}"
    )[1]

    return tests
```

Her adım bir öncekinin çıktısını context olarak alır. Subagent'lar birbirini görmez — sadece orkestratör bağlantıyı kurar.

---

## Context İzolasyonu: Neden Önemli?

Her subagent sıfırdan başlar. Bu bir özellik, bug değil.

**Avantajları:**
- Her subagent kendi uzmanlık alanına odaklanır, başka görevlerin gürültüsünü taşımaz
- Token maliyeti düşer — tüm konuşma geçmişini her subagent'a göndermek zorunda değilsin
- Farklı subagent'lar farklı system prompt'larla özelleştirilebilir

**Dikkat edilmesi gereken:**
- Subagent'lar birbirinin yaptığını görmez — orkestratör bilgiyi doğru aktarmalı
- Sıralı pipeline'larda önceki adımın çıktısı açıkça geçirilmeli

---

## Claude Code'da Agent Tool

Claude Code'un `Agent` tool'u tam olarak bu pattern'i uygular. Bir görevi başka bir agent'a delege ettiğinde:

- Yeni bir subagent başlatılır
- Kendi izole context window'uyla çalışır
- İstenirse `worktree` ile dosya sistemi de izole edilir
- Subagent tamamlandığında sadece sonuç orkestratöre döner

```
Orkestratör (ana Claude Code oturumu)
    └── Agent tool çağrısı
            └── Subagent (ayrı context, belki ayrı worktree)
                    └── Sonuç → Orkestratöre döner
```

Bağımsız araştırma görevlerini paralel subagent'lara devretmek, uzun bir oturumda context window'un dolmasını önlemenin en etkili yoludur.

---

## Ne Zaman Multi-Agent Kullanmalı?

| Kullan | Kullanma |
|--------|----------|
| Codebase tek context'e sığmıyor | Görev basit ve tek adımlı |
| Bağımsız görevler paralel çalışabilir | Koordinasyon maliyeti paralelizmden fazla |
| Farklı "uzmanlık" gerektiren alt görevler var | Subagent'lar arasında çok fazla veri geçişi gerekiyor |
| Uzun oturumda context dolmasını önlemek istiyorsun | Hata toleransı kritikse (zincirleme hata riski) |

---

## Sonuç

Multi-agent sistemler, tek bir agent'ın sınırlarını paralel ve izole çalışmayla aşar.

> **Orkestratör ne yapılacağına karar verir. Subagent'lar nasıl yapılacağını bilir.**

[AI agent'ların](/ai-agents-arac-kullanan-ve-karar-veren-yapay-zeka) temel döngüsünü anlıyorsan, multi-agent sistemi anlamak sadece bir adım daha: aynı döngüyü bağımsız context'lerde, paralel çalıştırmak.
