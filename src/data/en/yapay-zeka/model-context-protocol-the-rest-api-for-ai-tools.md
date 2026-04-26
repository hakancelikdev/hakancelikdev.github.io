---
publishDate: 2026-04-27T14:00:00Z
author: Hakan Çelik
title: "MCP: The REST API for AI Tools"
excerpt: "Every AI integration used to be custom-built. MCP changes that: write a tool once as an MCP server, and every MCP-compatible AI application can use it."
category: AI
series: "AI Foundations"
seriesIndex: 6
image: ~/assets/images/blog/mcp.jpg
tags:
  - artificial-intelligence
  - mcp
  - model-context-protocol
  - ai-agents
  - tool-use
---

## The Problem: N×M Integration Hell

[AI agents](/ai-agents-models-that-use-tools-and-make-decisions) use tools. Web search, file access, database queries, GitHub API — each one is a separate integration.

Before MCP, this is what the landscape looked like:

```
Claude  → custom GitHub integration
Claude  → custom filesystem integration
Claude  → custom database integration

ChatGPT → different GitHub integration
ChatGPT → different filesystem integration
ChatGPT → different database integration

Cursor  → yet another GitHub integration
...
```

5 AI applications × 10 tools = 50 separate integrations. Each with its own code, maintenance, and bugs.

**MCP solved this the same way REST solved web service integration.**

---

## The REST Analogy

Before REST, every application invented its own HTTP communication format. REST standardized it: `GET /users/1` means the same thing everywhere. A client that speaks REST can talk to any REST API.

MCP does the same thing for AI tool integrations:

```
REST API    →  web applications communicate over HTTP
MCP Server  →  AI applications communicate over MCP protocol
```

Once a tool is written as an MCP server — Claude Desktop, Claude Code, Cursor, Zed, your own application — anything that speaks MCP can use that tool.

5 + 10 = 15 implementations. Not 50.

---

## MCP Architecture

Three layers:

```
┌─────────────────────────────────┐
│  MCP Host                       │
│  (Claude Desktop, Claude Code,  │
│   Cursor, IDEs, your app)       │
│                                 │
│  ┌─────────────┐                │
│  │ MCP Client  │ ←── speaks the protocol
│  └──────┬──────┘                │
└─────────┼───────────────────────┘
          │ MCP Protocol
          │ (stdio or HTTP+SSE)
┌─────────┴───────────────────────┐
│  MCP Server                     │
│  (filesystem, GitHub, Postgres, │
│   web fetch, your own server)   │
└─────────────────────────────────┘
```

**Host** — the application that embeds an AI assistant. Claude Desktop is a host. Claude Code is a host. Cursor is a host.

**Client** — the layer inside the host that speaks MCP protocol. Each client maintains a 1:1 connection with a server.

**Server** — a lightweight process that exposes capabilities. Filesystem, GitHub, databases — any of these can be an MCP server.

---

## Three Primitives

An MCP server can expose three things:

### 1. Tools
Functions the model can invoke. May have side effects.

```
search_web(query)
create_file(path, content)
run_query(sql)
send_email(to, subject, body)
```

Same concept as [function calling](/ai-agents-models-that-use-tools-and-make-decisions) — wrapped in a standard protocol.

### 2. Resources
Read-only data. Provides context to the model, like documents in [RAG](/what-is-rag-giving-ai-a-memory).

```
file:///home/user/config.yaml
postgres://db/users/schema
github://repos/user/repo/README.md
```

### 3. Prompts
Reusable prompt templates. The host can surface these to users.

```
"Review this code" → pre-built system prompt
"Optimize SQL query" → parameterized template
```

---

## Transport: How They Communicate

Two transport options:

**stdio** — local process communication. The server runs on the same machine, talks over stdin/stdout. Simple, fast, ideal for local tools.

**HTTP + SSE** — remote server. The server runs on another machine, communicates over the network. For shared tools and cloud services.

---

## Practical: Writing an MCP Server

A minimal MCP server with Anthropic's Python SDK:

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("weather")

@mcp.tool()
def get_weather(city: str) -> str:
    """Get current weather for a city"""
    # Real implementation would call a weather API
    return f"{city}: 22°C, sunny"

@mcp.resource("config://app")
def get_config() -> str:
    """Return application configuration"""
    return "version=1.0, region=us"

if __name__ == "__main__":
    mcp.run()
```

Adding this server to Claude Desktop via `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "weather": {
      "command": "python",
      "args": ["/path/to/server.py"]
    }
  }
}
```

Save the file, restart Claude Desktop — Claude now has access to `get_weather`. Nothing else required.

---

## Pre-built MCP Servers

The ecosystem is growing fast. Servers from Anthropic and the community:

| Server | What It Does |
|--------|----------|
| `@modelcontextprotocol/server-filesystem` | Local file read/write |
| `@modelcontextprotocol/server-github` | Repos, issues, PRs |
| `@modelcontextprotocol/server-postgres` | Database queries |
| `@modelcontextprotocol/server-fetch` | Fetch web content |
| `@modelcontextprotocol/server-memory` | Persistent knowledge storage |
| `@modelcontextprotocol/server-brave-search` | Web search |

Adding them to Claude Desktop is a one-line config:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/user/Desktop"
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

## Claude Code and MCP

Claude Code uses MCP in both directions:

**As a client** — you'll see tools prefixed with `mcp__`: `mcp__github__create_pr`, `mcp__postgres__query`. These come from active MCP servers.

**As a host** — define a `mcpServers` block in `.claude/settings.json`, and Claude Code talks to those servers.

Claude Code also operates as an MCP host — its file reading, writing, and terminal tools come through this layer.

---

## Conclusion

MCP is REST for the AI world.

REST connected web services — one API standard let millions of applications talk to millions of services. MCP does the same for AI tools: write a server once, every AI application can use it.

> **Before MCP: every integration was custom. After MCP: write one server, run it everywhere.**
