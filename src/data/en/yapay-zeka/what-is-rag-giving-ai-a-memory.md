---
publishDate: 2026-04-26T00:00:00Z
author: Hakan Çelik
title: "What Is RAG? Giving AI a Memory It Can Actually Use"
excerpt: "Before I learned about RAG, I was dumping raw context into AI prompts and getting flooded with false positives. RAG changed everything. And it turns out Cursor and Claude Code use it too — that indexing progress bar isn't just for show."
category: AI
image: ~/assets/images/blog/rag.jpg
tags:
  - artificial-intelligence
  - rag
  - machine-learning
  - llm
  - embedding
---

## The Problem: Blindly Dumping Context Into AI

When I was building an AI project, I was feeding my documents, notes, and codebase to the model like this:

```
[Paste entire document here] + [My question]
```

The result? A flood of **hallucinations**. The AI mixed in irrelevant information, invented references that didn't exist, and sometimes just gave flat-out wrong answers.

The problem wasn't the model. The problem was **how I was giving it context.**

That's exactly where RAG comes in.

---

## What Is RAG?

**RAG** — Retrieval-Augmented Generation.

The name says it all: first **retrieve** the relevant information, then **generate** an answer using it.

In plain terms:

> Instead of blindly dumping everything into the prompt, find the **most relevant** pieces and send only those.

But to do that, your data first needs to be made **searchable**. That's where **embeddings** and **indexing** enter the picture.

---

## What Is an Embedding? Turning Meaning Into Numbers

Consider this sentence:

> "How do I do web scraping with Python?"

A computer doesn't understand it — it just sees characters. But an **embedding model** converts that sentence into a vector of numbers:

```
[0.23, -0.87, 0.14, 0.55, ..., -0.31]  → a 768 or 1536-dimensional vector
```

Here's the magic: **sentences that are similar in meaning produce vectors that are close together in space.**

```
"Python web scraping"          → [0.23, -0.87, 0.14, ...]
"fetching data with requests"  → [0.21, -0.85, 0.16, ...]  ← close!
"reading files with Java"      → [-0.61, 0.42, -0.33, ...] ← far away
```

This means you can answer "what's closest to this topic?" by computing distances between vectors. This is called **semantic search** — far more powerful than keyword matching.

---

## How RAG Works, Step by Step

RAG has two separate phases: **indexing** (done once) and **querying** (done on every question).

### Phase 1: Indexing (Setup)

```
Documents / Code / Notes
         ↓
   Split into chunks
         ↓
   Embed each chunk
         ↓
   Store in a vector database
```

You split your documents into small chunks. Chunk size is a critical decision:

- **Too large** (1000+ tokens): irrelevant content bleeds in, the LLM's focus scatters
- **Too small** (under 50 tokens): sentence context breaks apart, meaning is lost
- **Practical starting point**: 300–500 tokens with 10–20% overlap

**Why overlap?** If a sentence gets cut exactly at a chunk boundary, you want both neighboring chunks to contain it. Overlap ensures no information falls through the cracks at the edges.

You run each chunk through an embedding model to get its vector. Then you store those vectors in a **vector database** (Chroma, Pinecone, Weaviate, pgvector...).

This step runs **once** and doesn't need to be repeated unless your data changes.

### Phase 2: Querying (Every Question)

```
User's question
      ↓
  Embed the question
      ↓
  Fetch the top-K closest chunks from the vector DB
      ↓
  Question + retrieved chunks = Prompt
      ↓
  Send to LLM → Answer
```

When a user asks a question, you embed that question too. Then you search the vector database for the chunks that are semantically closest to it. You combine those chunks with the question and send the whole thing to the LLM.

Result: the LLM now sees not the entire document, but **only the parts that are actually relevant to the question**.

---

## Why It Makes Such a Difference

My approach before RAG:

```
PROMPT = system_prompt + entire_document_text + question
```

**Problems:**
- Fills up the context window (even GPT-4 has limits)
- AI hallucinates from irrelevant text passages
- Cost goes up (more tokens = more money)
- Answer quality drops

My approach after RAG:

```
relevant_chunks = vector_db.search(question, k=5)
PROMPT = system_prompt + relevant_chunks + question
```

**Results:**
- Context window used efficiently
- AI sees only what's relevant to the question
- Hallucinations drop dramatically
- Answer quality goes up

---

## The "Aha!" Moment: Cursor Uses RAG — Claude Code Works Differently

One day I was poking around Cursor's settings. There's a section called "Codebase indexing" — it shows a progress bar while scanning your project. I remember thinking: _"What's this actually doing?"_

Turns out it was **exactly the RAG indexing step**.

**Cursor** applies classic RAG when it opens your project:
1. Splits all your source files into small chunks
2. Runs each chunk through an embedding model
3. Stores the vectors in a local database

When you type `@codebase` and ask a question, it embeds your question, finds the most semantically similar chunks, and sends those to GPT-4 / Claude.

**Claude Code** takes a different approach — it doesn't pre-index anything. Instead it works like a developer exploring an unfamiliar codebase: it uses `Glob` to find files by pattern, `Grep` to search content, and `Read` to open specific files. It decides what's relevant fresh on every query.

These are two different strategies, but they share the same core principle: **don't give the LLM everything — give it the right things**. One uses pre-built vector index, the other uses dynamic exploration. Both beat blindly dumping the entire codebase into the prompt.

This realization changed everything for me. These tools don't "magically understand" your code. They carefully select and filter context before the LLM ever sees it.

---

## A Minimal RAG Implementation

You can build your own RAG pipeline in a handful of lines:

```python
from sentence_transformers import SentenceTransformer
from anthropic import Anthropic
import chromadb

# Embedding model — a small AI model that converts text to vectors
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# Vector database
client = chromadb.Client()
collection = client.create_collection("documents")

# --- INDEXING (run once) ---
documents = [
    "Web scraping in Python is done with the requests library.",
    "Django is a Python web framework.",
    "RAG is a way to give LLMs access to external knowledge.",
]

for i, doc in enumerate(documents):
    embedding = embed_model.encode(doc).tolist()
    collection.add(documents=[doc], embeddings=[embedding], ids=[str(i)])

# --- QUERYING (run on every question) ---
question = "How do I scrape the web?"
question_embedding = embed_model.encode(question).tolist()

results = collection.query(query_embeddings=[question_embedding], n_results=2)
relevant_chunks = results["documents"][0]

# Build the augmented prompt
prompt = f"""Answer the question based only on the information below.
If the answer isn't there, say "I don't know."

Context:
{chr(10).join(f"- {c}" for c in relevant_chunks)}

Question: {question}"""

# Send to LLM and get the answer
llm = Anthropic()
message = llm.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": prompt}]
)

print(message.content[0].text)
```

Notice we're using two different AI models here: one for embedding (`all-MiniLM-L6-v2`) and one for generation (`claude-opus-4-6`). Both are "compiled binaries" — each specialized for a different job.

---

## Two Ways to Make RAG Better

Basic RAG is a solid starting point, but real-world pipelines usually add two more steps.

### Hybrid Search: Semantic + Keyword

Pure semantic search doesn't always win. For a query like "Django 4.2 release notes," exact keyword matching will outperform meaning-based similarity.

**Hybrid search** combines both:
- **BM25** (keyword search) — strong for exact terms, names, and code identifiers
- **Semantic search** — strong for paraphrases and conceptual queries
- Scores are merged and ranked together

Most production RAG systems blend the two (e.g. 60% semantic + 40% keyword).

### Reranking: A Second Pass

The initial retrieval is fast but coarse. A **reranker** takes those results and re-scores them with a more accurate (but slower) model:

```
Vector DB → Top 20 chunks → Reranker → Best 5 chunks → LLM
```

Reranker models (Cohere Rerank, `cross-encoder/ms-marco-MiniLM-L-6-v2`) evaluate the question and each chunk *together*, making them far more precise than vector similarity alone. The pattern is: retrieve → rerank → generate.

---

## RAG vs. Fine-tuning: Which One When?

These two are frequently confused:

| | RAG | Fine-tuning |
|---|---|---|
| **What it does** | Injects relevant data at query time | Updates the model's weights |
| **Can data be updated?** | Yes, easily | No, requires retraining |
| **Cost** | Low (just indexing) | High (GPU time, engineering) |
| **Use when** | External knowledge base, document search | Custom tone/behavior, domain specialization |

In most applications, RAG should be tried **before** fine-tuning. The root cause of most "bad AI answers" isn't that the model isn't smart enough — it's that the model doesn't have access to the right information.

---

## Conclusion

Before I learned about RAG, I was misusing AI: blindly stuffing all my data into the prompt and not understanding why I kept getting wrong answers.

The core insight of RAG:

> **It's not about how much you give the AI. It's about how precisely you give it the right thing.**

And the day I watched Cursor's "Codebase indexing" progress bar fill up, I realized: the world's most advanced coding tools are built on the same idea. Different scale, same logic.

Once you understand this, working with AI stops feeling like guesswork.
