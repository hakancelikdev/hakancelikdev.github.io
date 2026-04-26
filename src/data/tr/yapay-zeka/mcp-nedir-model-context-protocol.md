---
publishDate: 2026-04-27T14:00:00Z
author: Hakan Çelik
title: "MCP Nedir? AI Araçları için REST API"
excerpt: "Her AI entegrasyonu ayrı ayrı yazılıyordu. MCP bunu değiştirdi: bir araç bir kez MCP server olarak yazılır, MCP destekleyen her AI uygulamasına bağlanır."
category: Yapay Zeka
series: "AI Temelleri"
seriesIndex: 6
image: ~/assets/images/blog/mcp.jpg
tags:
  - yapay-zeka
  - mcp
  - ai-agents
  - protocol
  - tool-use
---

## Problem: N×M Entegrasyon Cehennemi

[AI agent'lar](/ai-agents-arac-kullanan-ve-karar-veren-yapay-zeka) araç kullanır. Web arama, dosya okuma, veritabanı sorgusu, GitHub API — bunların hepsi ayrı entegrasyon demek.

MCP öncesinde durum şuydu:

```
Claude  → özel GitHub entegrasyonu
Claude  → özel dosya sistemi entegrasyonu
Claude  → özel veritabanı entegrasyonu

ChatGPT → farklı GitHub entegrasyonu
ChatGPT → farklı dosya sistemi entegrasyonu
ChatGPT → farklı veritabanı entegrasyonu

Cursor  → bir başka GitHub entegrasyonu
...
```

5 AI uygulaması × 10 araç = 50 ayrı entegrasyon. Her biri ayrı kod, ayrı bakım, ayrı hata.

**MCP bu problemi REST API'nin web servislerine yaptığı şeyi yaparak çözdü.**

---

## REST Analogisi

REST'ten önce her uygulama kendi HTTP iletişim formatını icat ediyordu. REST standartlaştı: `GET /users/1` her yerde aynı anlama gelir. Bir client REST biliyorsa bütün REST API'lere konuşabilir.

MCP aynı şeyi AI araç entegrasyonları için yapıyor:

```
Araç REST API  →  HTTP üzerinden web uygulamaları konuşur
MCP Server     →  MCP protokolü üzerinden AI uygulamaları konuşur
```

Bir araç MCP server olarak yazıldığında — Claude Desktop, Claude Code, Cursor, Zed, kendi yazdığın uygulama — MCP destekleyen her şey o araçla konuşabilir.

5 + 10 = 15 implementasyon. 50 değil.

---

## MCP Mimarisi

Üç katman var:

```
┌─────────────────────────────────┐
│  MCP Host                       │
│  (Claude Desktop, Claude Code,  │
│   Cursor, IDE'ler, kendi appın) │
│                                 │
│  ┌─────────────┐                │
│  │ MCP Client  │ ←── protokolü konuşur
│  └──────┬──────┘                │
└─────────┼───────────────────────┘
          │ MCP Protokolü
          │ (stdio veya HTTP+SSE)
┌─────────┴───────────────────────┐
│  MCP Server                     │
│  (filesystem, GitHub, Postgres, │
│   web fetch, kendi server'ın)   │
└─────────────────────────────────┘
```

**Host** — AI asistanını embed eden uygulama. Claude Desktop bir host. Claude Code bir host. Cursor bir host.

**Client** — Host içinde çalışan, MCP protokolünü konuşan katman. Her client bir server ile 1:1 bağlantı kurar.

**Server** — Araçları expose eden hafif process. Dosya sistemi, GitHub, veritabanı — hepsi birer MCP server olabilir.

---

## Üç Primitive

MCP server üç şeyi expose edebilir:

### 1. Tools (Araçlar)
Model'in çağırabileceği fonksiyonlar. Yan etkileri olabilir.

```
search_web(query)
create_file(path, content)
run_query(sql)
send_email(to, subject, body)
```

[Function calling](/ai-agents-arac-kullanan-ve-karar-veren-yapay-zeka) ile aynı kavram — sadece standart bir protokolle sarmalanmış.

### 2. Resources (Kaynaklar)
Salt okunur veri. Model'e bağlam sağlar, [RAG](/rag-nedir-retrieval-augmented-generation)'taki döküman gibi.

```
file:///Users/hakan/config.yaml
postgres://db/users/schema
github://repos/hakancelik/unimport/README.md
```

### 3. Prompts (Şablonlar)
Yeniden kullanılabilir prompt şablonları. Host bunları kullanıcıya sunabilir.

```
"Kodu code review et" → hazır sistem promptu
"SQL sorgusunu optimize et" → parametre alan şablon
```

---

## Transport: Nasıl İletişim Kurulur

İki transport var:

**stdio** — Local process iletişimi. Server aynı makinede çalışır, stdin/stdout üzerinden konuşur. Basit, hızlı, yerel araçlar için ideal.

**HTTP + SSE** — Uzak server. Server başka bir makinede, network üzerinden iletişim. Paylaşılan araçlar, cloud servisler için.

---

## Pratik: Bir MCP Server Yazmak

Anthropic'in Python SDK'sı ile minimal bir MCP server:

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("hava-durumu")

@mcp.tool()
def get_weather(sehir: str) -> str:
    """Bir şehrin güncel hava durumunu getirir"""
    # Gerçek implementasyonda API çağrısı yapılır
    return f"{sehir}: 22°C, güneşli"

@mcp.resource("config://app")
def get_config() -> str:
    """Uygulama konfigürasyonunu döner"""
    return "version=1.0, region=tr"

if __name__ == "__main__":
    mcp.run()
```

Bu server'ı Claude Desktop'a eklemek için `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "hava-durumu": {
      "command": "python",
      "args": ["/path/to/server.py"]
    }
  }
}
```

Kaydedip Claude Desktop'ı yeniden başlatınca, Claude artık `get_weather` aracına erişebilir. Başka bir şeye gerek yok.

---

## Hazır MCP Server'lar

Ekosistem hızla büyüyor. Anthropic ve topluluk tarafından yazılmış server'lar:

| Server | Ne Yapar |
|--------|----------|
| `@modelcontextprotocol/server-filesystem` | Yerel dosya okuma/yazma |
| `@modelcontextprotocol/server-github` | Repo, issue, PR yönetimi |
| `@modelcontextprotocol/server-postgres` | Veritabanı sorguları |
| `@modelcontextprotocol/server-fetch` | Web içeriği çekme |
| `@modelcontextprotocol/server-memory` | Kalıcı bilgi saklama |
| `@modelcontextprotocol/server-brave-search` | Web araması |

Bunları Claude Desktop'a eklemek bir config satırı:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/hakan/Desktop"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
      }
    }
  }
}
```

---

## Claude Code ve MCP

Claude Code MCP'yi iki yönde kullanır:

**Client olarak** — `mcp__` prefix'li araçlar görürsün: `mcp__github__create_pr`, `mcp__postgres__query` gibi. Bunlar aktif MCP server'lardan gelen araçlar.

**Host olarak** — `.claude/settings.json` içinde `mcpServers` bloğu tanımlarsın, Claude Code o server'larla konuşur.

Claude Code da bir MCP host olarak çalışır — dosya okuma, yazma, terminal çalıştırma araçlarını bu katman üzerinden alır.

---

## Sonuç

MCP, AI dünyasının REST'i.

REST web servislerini birbirine bağladı — bir API standardı sayesinde milyonlarca uygulama milyonlarca servise bağlanabildi. MCP aynı şeyi AI araçları için yapıyor: bir araç bir kez yazılır, her AI uygulaması onu kullanabilir.

> **MCP öncesi: her entegrasyon custom. MCP sonrası: bir server yaz, her yerde çalıştır.**
