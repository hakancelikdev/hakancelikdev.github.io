---
publishDate: 2026-04-26T10:00:00Z
author: Hakan Çelik
title: "Prompt Engineering: How to Actually Talk to AI Models"
excerpt: "The same model, the same question, worded differently — completely different results. That's not luck. How you frame your prompt directly determines the output you get."
category: AI
series: "AI Foundations"
seriesIndex: 3
image: ~/assets/images/blog/prompt-engineering.jpg
tags:
  - artificial-intelligence
  - prompt-engineering
  - llm
  - prompt
---

## Same Model, Different Results

Try these two prompts:

**Prompt A:**
```
Fix my resume.
[resume text]
```

**Prompt B:**
```
You're a senior HR professional specializing in tech hiring.
Strengthen the resume below for a software engineering role.
Use strong action verbs, surface measurable achievements,
replace vague phrases with specific ones. Keep the original structure.

[resume text]
```

Both go to the same model with the same resume. Prompt B produces a usable result almost every time. Prompt A is a coin flip.

Prompt engineering is the practice of making that difference deliberate.

---

## What Does a Model Actually Respond To?

In the [token post](/what-is-a-token-how-ai-models-read-text-and-charge-you-for-it) we saw how models process text token by token. But understanding what shapes the model's response requires one more step.

A language model generates the most probable continuation given the context it sees. Which means: **the better the context you provide, the better the continuation it produces.**

Prompt engineering is the deliberate, systematic shaping of that context.

---

## The Anatomy of a Prompt

A prompt typically has three layers:

```
┌─────────────────────────────────┐
│  System Prompt                  │  ← Role, rules, tone
├─────────────────────────────────┤
│  Context / Examples             │  ← History, documents, few-shot examples
├─────────────────────────────────┤
│  User Request                   │  ← The actual task
└─────────────────────────────────┘
```

Every layer consumes [tokens](/what-is-a-token-how-ai-models-read-text-and-charge-you-for-it). Good prompts make the most of the token budget by maximizing signal and cutting filler.

---

## Core Techniques

### 1. Role Prompting

Give the model an identity. This steers which "knowledge domain" the model draws from.

```
❌ "Review this code."
✅ "You're a senior Python engineer focused on production reliability.
    Review this code for security vulnerabilities, performance issues,
    and readability. Prioritize in that order."
```

### 2. Few-Shot Prompting

Instead of describing what you want, show it.

```
Classify the following customer complaints:

Complaint: "My order arrived 3 days late"
Category: Delivery

Complaint: "The product didn't match the description"
Category: Product quality

Complaint: "Nobody responded to my refund request"
Category: Customer service

Complaint: "The packaging was damaged"
Category:
```

Once the model sees the pattern, it follows it reliably.

### 3. Chain-of-Thought

For complex tasks, ask the model to think before answering.

```
❌ "Solve this math problem: ..."
✅ "Solve this step by step. Show your work for each step,
    then give the final answer."
```

Research consistently shows this technique significantly improves accuracy on reasoning tasks.

### 4. Specify Output Format

Tell the model not just what you want, but how you want it.

```
Structure your analysis as:
- Summary (1–2 sentences)
- Strengths (bullet points)
- Risks (bullet points)
- Recommendation (1 paragraph)
```

### 5. Define Constraints

Tell the model what not to do, too.

```
Respond in English only.
Avoid technical jargon — the audience is non-technical executives.
Keep the response to 3 paragraphs.
Don't speculate on things you don't know.
```

---

## System Prompt: Persistent Steering

When building an application, the system prompt is the baseline that applies throughout the conversation. It's prepended automatically to every user message.

```python
from anthropic import Anthropic

client = Anthropic()

system_prompt = """You are a software documentation assistant.
- Always respond in clear, plain English
- Always put code examples inside code blocks
- Make explanations accessible to both beginners and experienced devs
- If a question is outside the documentation domain, politely redirect"""

message = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    system=system_prompt,
    messages=[
        {"role": "user", "content": "How does list.append() work?"}
    ]
)

print(message.content[0].text)
```

The system prompt consumes [tokens](/what-is-a-token-how-ai-models-read-text-and-charge-you-for-it) on every API call. Prompt caching makes this much cheaper for applications with long, stable system prompts.

---

## Common Mistakes

**1. Too vague, too broad**
```
❌ "Tell me about business ideas"
✅ "Suggest 5 e-commerce business ideas that a single person
    can launch with a $5,000 budget. For each idea, include
    estimated startup costs and the three most important
    actions for the first 90 days."
```

**2. Not breaking the task down**
Instead of solving everything in one shot, decompose complex tasks into steps. The model works more precisely when focused.

**3. Not verifying the output**
Models produce confident-sounding wrong answers — especially for recent events or very specific data. Always verify important outputs.

---

## Combining Prompt Engineering with RAG

[RAG](/what-is-rag-giving-ai-a-memory) retrieves relevant information and adds it to the context. Prompt engineering determines how to present that context to the model. Together they multiply:

```python
# Retrieved chunks from RAG
relevant_docs = vector_db.search(user_query, k=5)

# Prompt engineering wraps the retrieval
prompt = f"""You are a customer support specialist.
Answer the question using only the product documentation below.
If the answer isn't in the docs, say you don't know.

Documentation:
{relevant_docs}

Question: {user_query}

Format your response as:
- Direct answer (1–2 sentences)
- Detailed explanation
- Relevant doc section (if applicable)"""
```

---

## Conclusion

Prompt engineering is not magic, and it's not luck. It's understanding how models work and using that understanding deliberately.

> **A good prompt tells the model what to do. A great prompt puts the model in a position where it wants to do the right thing.**

Once you understand [what an AI model is](/what-you-actually-download-when-you-pull-an-ai-model), [how tokens work](/what-is-a-token-how-ai-models-read-text-and-charge-you-for-it), and [how RAG feeds information](/what-is-rag-giving-ai-a-memory), prompt engineering is the practical skill that ties all three together.
