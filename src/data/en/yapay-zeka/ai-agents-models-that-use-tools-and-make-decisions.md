---
publishDate: 2026-04-26T14:00:00Z
author: Hakan Çelik
title: "AI Agents: Models That Use Tools and Make Their Own Decisions"
excerpt: "A language model takes a question and returns an answer. An AI agent takes a goal, makes a plan, uses tools, and produces a result. That difference turns AI from a chatbot into a collaborator."
category: AI
series: "AI Foundations"
seriesIndex: 7
image: ~/assets/images/blog/ai-agents.jpg
tags:
  - artificial-intelligence
  - ai-agents
  - tool-use
  - llm
  - automation
---

## The Difference Between a Chatbot and an Agent

A standard conversation with a language model looks like this:

```
User → Question → Model → Answer
```

You ask, it answers. One turn, one direction.

An AI agent works differently:

```
User → Goal
           ↓
       Model (reasons about what to do)
           ↓
       Uses a tool (web search, run code, call API...)
           ↓
       Evaluates the result
           ↓
       Reasons again / uses another tool
           ↓
       Final output → User
```

The agent makes its own decisions about how to reach the goal. It decides which tools to use, in what order, and updates its plan based on what it finds.

---

## Three Components of an Agent

Every AI agent has three core parts:

### 1. The Brain (LLM)

[An AI model](/what-you-actually-download-when-you-pull-an-ai-model) — all reasoning, planning, and decision-making comes from here. The agent uses the model's thinking capacity repeatedly inside a loop.

### 2. Tools

Functions that do what the model alone can't:
- Web search
- Code execution
- File read/write
- API calls
- Database queries
- Sending emails

The model decides when and how to use each tool.

### 3. Memory

Previous step results, tool outputs, and conversation history — all of it lives in the [context window](/what-is-a-token-how-ai-models-read-text-and-charge-you-for-it). The agent draws on this accumulated context at every step.

---

## ReAct: Reason → Act → Observe

The most widely used agent architecture is **ReAct** (Reason + Act):

```
Thought:     "The user wants the current EUR/USD rate.
              I need to search for live data."
    ↓
Action:      web_search("EUR USD exchange rate 2026")
    ↓
Observation: "1 EUR = 1.082 USD (April 26, 2026)"
    ↓
Thought:     "Got the rate. I can answer now."
    ↓
Final Answer: "Current EUR/USD rate: 1.082"
```

The model thinks and acts at each step. The loop continues until the goal is reached.

---

## Tool Use: Function Calling

In modern APIs, tools are defined as JSON schemas. When the model decides to use a tool, the API returns a structured object — your code runs the tool and sends the result back.

```python
from anthropic import Anthropic

client = Anthropic()

tools = [
    {
        "name": "web_search",
        "description": "Searches the internet for current information",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "calculator",
        "description": "Performs mathematical calculations",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {"type": "string", "description": "Expression to evaluate"}
            },
            "required": ["expression"]
        }
    }
]

messages = [{"role": "user", "content": "What's the EUR/USD rate? Convert 500 EUR."}]

# Agent loop
while True:
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        tools=tools,
        messages=messages
    )

    if response.stop_reason == "end_turn":
        print(response.content[0].text)
        break

    if response.stop_reason == "tool_use":
        for block in response.content:
            if block.type == "tool_use":
                # Run the tool
                if block.name == "web_search":
                    result = web_search(block.input["query"])
                elif block.name == "calculator":
                    result = eval(block.input["expression"])

                # Send result back to model
                messages.append({"role": "assistant", "content": response.content})
                messages.append({
                    "role": "user",
                    "content": [{"type": "tool_result", "tool_use_id": block.id, "content": str(result)}]
                })
```

---

## Why Coding Assistants Behave Like Agents

Modern coding assistants work with tools such as file reading, code editing, terminal execution, file discovery, and content search. Given a goal, they decide which tool to use first, evaluate intermediate results, and update their plan as they go.

This also aligns with the "dynamic exploration" idea from the [RAG post](/what-is-rag-giving-ai-a-memory): instead of a single fixed step, the system iteratively retrieves the right context when needed.

---

## Multi-Agent: Agents Working Together

A single agent can't do everything — the context window has [token limits](/what-is-a-token-how-ai-models-read-text-and-charge-you-for-it), attention drifts across long sessions, and complex tasks overwhelm a single loop.

Multi-agent systems have multiple agents collaborate:

```
Orchestrator Agent
    ├── Research Agent  (web search, information gathering)
    ├── Code Agent      (writing and testing code)
    └── Writing Agent   (summarizing, reporting)
```

The orchestrator breaks down the goal, delegates to subagents, and combines results. Each agent works in its own context window — parallel and efficient.

---

## The Hard Parts of Agents

**1. Token cost compounds.**
Every reasoning step, tool call, and observation consumes [tokens](/what-is-a-token-how-ai-models-read-text-and-charge-you-for-it). A long agent loop can spend ten times the tokens of a single API call.

**2. Errors propagate.**
A wrong decision early in the loop affects all subsequent steps. A good agent knows how to handle uncertainty or when to ask the user for clarification.

**3. The control problem.**
How autonomous should the agent be? Should it ask for confirmation before irreversible actions (sending an email, deleting a file)? These decisions directly affect system safety.

---

## Conclusion

An AI agent turns a language model from a one-shot answer machine into a goal-directed collaborator.

> **A model tells you what it knows. An agent shows you what it can do.**

This series started by asking [what a model is](/what-you-actually-download-when-you-pull-an-ai-model). We saw that [tokens](/what-is-a-token-how-ai-models-read-text-and-charge-you-for-it) are its fundamental unit. [RAG](/what-is-rag-giving-ai-a-memory) taught it to reach for external knowledge. [Prompt engineering](/prompt-engineering-how-to-talk-to-ai-models) taught us to speak to it well. [Fine-tuning](/fine-tuning-when-and-how-to-customize-an-ai-model) let us specialize it. Agents put all of it into action.
