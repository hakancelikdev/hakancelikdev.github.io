---
publishDate: 2026-04-26T06:00:00Z
author: Hakan Çelik
title: "What Is a Token? How AI Models Read Text and Charge You for It"
excerpt: "AI models don't read text word by word or character by character — they read in tokens. Understanding this one concept explains context limits, pricing, and why models 'forget' things mid-conversation."
category: AI
image: ~/assets/images/blog/token.jpg
tags:
  - artificial-intelligence
  - token
  - llm
  - pricing
  - context-window
---

## How an AI Model Actually Sees Text

When you send a message to an AI model, it doesn't read it character by character or word by word. It first breaks the text into chunks called **tokens**.

A token can be a word, a fragment of a word, or a punctuation mark. The fastest way to understand this is with real examples:

```
"Hello"        → ["Hello"]                       → 1 token
"Merhaba"      → ["Mer", "hab", "a"]            → 3 tokens
"ChatGPT"      → ["Chat", "G", "PT"]            → 3 tokens
"tokenization" → ["token", "ization"]            → 2 tokens
```

One thing jumps out immediately: **non-English languages consume significantly more tokens than English.** Most large language models were trained predominantly on English text, so they recognize English words as whole units while splitting other languages into smaller fragments.

This isn't just a technical detail — it shows up directly in your bill.

---

## Tokenization: How Text Gets Split

This process is called **tokenization**. Each model uses its own tokenizer. OpenAI's GPT models use `tiktoken`; Meta's LLaMA models use their own BPE (Byte Pair Encoding) tokenizer.

The logic behind BPE: character sequences that appear frequently together in training data gradually merge into a single token. English suffixes like "ing", "tion", and "er" become single tokens. Turkish suffixes are typically split apart.

You can test this yourself:

```python
import tiktoken

enc = tiktoken.encoding_for_model("gpt-4")

texts = [
    "Hello, how are you?",
    "Merhaba, nasılsın?",
    "Tokenization is important",
    "Tokenizasyon önemlidir",
]

for text in texts:
    tokens = enc.encode(text)
    print(f"{len(tokens):2d} tokens | {text}")
```

Output will look roughly like:
```
 5 tokens | Hello, how are you?
 7 tokens | Merhaba, nasılsın?
 4 tokens | Tokenization is important
 6 tokens | Tokenizasyon önemlidir
```

The Turkish sentences consume 30–50% more tokens than their English equivalents. That affects both cost and how much fits in the context window.

---

## Context Window: The Token Budget

Every model has a **context window** — the maximum number of tokens it can hold in view at once.

| Model | Context Window |
|---|---|
| GPT-3.5 Turbo | 16,000 tokens |
| GPT-4o | 128,000 tokens |
| Claude Sonnet 4.5 | 200,000 tokens |
| Llama 3.1 70B | 128,000 tokens |

This limit doesn't apply only to your message. The **entire conversation** draws from this pool:

```
Context Window = system prompt
               + all previous messages (yours + model's)
               + your current message
               + the model's upcoming reply
```

As a conversation grows, or when you paste a large document, the context window fills up. Once the limit is hit, the model loses access to the oldest tokens — it can no longer see them.

The model's "memory loss" that people talk about isn't a personality quirk. It's this: those tokens fell outside the window.

This is also why [RAG](/what-is-rag-giving-ai-a-memory) exists. Instead of stuffing an entire document into the context, you retrieve only the relevant chunks — spending your token budget on signal, not noise.

---

## Pricing: Every Token Has a Cost

AI APIs are billed per token. There are two separate prices:

- **Input tokens**: the text you send (prompt + context)
- **Output tokens**: the text the model generates

Output tokens cost more because generating each one requires active computation — reading input is passive, generating output is not.

Example prices as of April 2026 (per million tokens, USD):

| Model | Input | Output |
|---|---|---|
| GPT-4o | $2.50 | $10.00 |
| Claude Sonnet 4.5 | $3.00 | $15.00 |
| GPT-4o mini | $0.15 | $0.60 |
| Claude Haiku 4.5 | $0.80 | $4.00 |

One million tokens is roughly 750,000 words — several novels. Hard to hit in a single call, but easy to accumulate across thousands of users in a production application.

### Prompt Caching

Anthropic and OpenAI both offer **prompt caching** for repeated long prompts. If your system prompt stays the same across requests (and it usually does), cached tokens are billed at a fraction of the standard price:

- Anthropic: cached input tokens cost **10% of the standard rate**
- For applications with lengthy system prompts, this cuts costs dramatically

---

## Embedding Models Are Much Cheaper

When [building a RAG pipeline](/what-is-rag-giving-ai-a-memory), you use an embedding model to convert text into vectors. These are also token-priced, but far cheaper than large language models:

| Model | Price (per 1M tokens) |
|---|---|
| text-embedding-3-small | $0.02 |
| text-embedding-3-large | $0.13 |
| Claude Sonnet 4.5 (input) | $3.00 |

Indexing thousands of documents with embeddings can cost less than a single GPT-4 conversation.

---

## What Changes When You Understand Tokens

Before learning about tokens, a lot of AI behavior seemed mysterious:

- Why does the model forget things mid-conversation? → Context window filled up
- Why is writing in Turkish more expensive? → More tokens per idea
- Why does asking for a shorter answer reduce cost? → Fewer output tokens
- Why does RAG work? → It spends the token budget on relevant content only
- Why should you keep system prompts short? → They count as input tokens on every request

Token is the base unit of the AI economy. Once you see it, the pricing, the limits, and the quirks all make sense — and you write better applications because of it.
