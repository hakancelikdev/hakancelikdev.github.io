---
publishDate: 2026-04-28T14:00:00Z
author: Hakan Çelik
title: "Building Multi-Agent Systems: Orchestration and Parallelism"
excerpt: "A single agent hits three walls: context limits, attention drift, and sequential bottlenecks. Multi-agent systems solve all three — the orchestrator decomposes, subagents run in parallel, each with its own clean context."
category: AI
series: "AI Foundations"
seriesIndex: 8
image: ~/assets/images/blog/multi-agent.jpg
tags:
  - artificial-intelligence
  - multi-agent
  - orchestration
  - llm
  - automation
---

## Why One Agent Isn't Enough

[AI agents](/ai-agents-models-that-use-tools-and-make-decisions) take a goal, use tools, and produce results. For small tasks, that's enough. As tasks scale, three problems emerge:

**1. Context window fills up.**
Analyzing a large codebase means reading hundreds of files. A single [context window](/what-is-a-token-how-ai-models-read-text-and-charge-you-for-it) can't hold all of it.

**2. Attention drifts.**
Tell a single agent to "find security vulnerabilities, analyze performance, and list documentation gaps" and it does all three at a mediocre level. Each deserves focused attention.

**3. Everything runs sequentially.**
A single agent finishes one task before starting the next — even when tasks are independent and could run in parallel.

Multi-agent systems solve all three at once.

---

## The Orchestrator / Subagent Pattern

```
Orchestrator Agent
    │
    ├──► Security Subagent     → vulnerability analysis
    │         (own context window)
    │
    ├──► Performance Subagent  → bottleneck analysis
    │         (own context window)
    │
    └──► Documentation Subagent → missing doc detection
              (own context window)
              │
              ▼
    Orchestrator collects and combines results
```

**Orchestrator** — decomposes the goal, delegates each part to the right subagent, collects results, and synthesizes.

**Subagent** — an agent focused on a single task, running in its own isolated context window. It doesn't know what the orchestrator is doing — it only knows its own task.

Every subagent **starts with a clean context window**. This keeps [token costs](/what-is-a-token-how-ai-models-read-text-and-charge-you-for-it) low and attention sharp.

---

## Parallel vs Sequential: Which and When?

The most important design decision in multi-agent systems:

| Task structure | Approach | Why |
|---|---|---|
| Tasks are independent | **Parallel** | They run simultaneously; total time = slowest task |
| Task B needs Task A's output | **Sequential** | B can't start until A finishes |
| Mix of independent and dependent | **Hybrid** | Parallelize the independent, sequence the dependent |

Examples:

```
Parallel:   security analysis + performance analysis + doc analysis
            (all independent → run simultaneously)

Sequential: research → write code → write tests
            (code depends on research; tests depend on code → in order)
```

---

## Practical: Parallel Orchestration with the Anthropic API

```python
import anthropic
from concurrent.futures import ThreadPoolExecutor, as_completed

client = anthropic.Anthropic()

def run_subagent(role: str, task: str, context: str) -> tuple[str, str]:
    """Run a single subagent"""
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=2048,
        system=f"You are a {role} specialist. Focus only on this role.",
        messages=[
            {"role": "user", "content": f"Code:\n{context}\n\nTask:\n{task}"}
        ]
    )
    return role, response.content[0].text

def orchestrate(codebase: str) -> str:
    """Orchestrator: decomposes, runs in parallel, aggregates"""

    subagents = [
        ("security",     "List security vulnerabilities in this code."),
        ("performance",  "List performance bottlenecks in this code."),
        ("technical writer", "List functions missing documentation."),
    ]

    results = {}

    # Run all subagents in parallel
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = {
            executor.submit(run_subagent, role, task, codebase): role
            for role, task in subagents
        }
        for future in as_completed(futures):
            role, result = future.result()
            results[role] = result

    # Orchestrator synthesizes
    aggregation_prompt = f"""
Three separate analyses have been completed:

Security: {results['security']}

Performance: {results['performance']}

Documentation: {results['technical writer']}

Write a summary report, prioritized by impact.
    """

    final = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=2048,
        messages=[{"role": "user", "content": aggregation_prompt}]
    )

    return final.content[0].text
```

Three subagents run in parallel. Total time equals the slowest subagent — not the sum of all three.

---

## Sequential Pipeline: Dependent Tasks

```python
def sequential_pipeline(goal: str) -> str:
    """Sequential orchestration for dependent tasks"""

    # Step 1: Research
    _, research = run_subagent(
        "researcher",
        f"Research this topic thoroughly: {goal}",
        ""
    )

    # Step 2: Code (takes research as input)
    _, code = run_subagent(
        "software engineer",
        "Write an implementation based on the research.",
        f"Research findings:\n{research}"
    )

    # Step 3: Tests (takes code as input)
    _, tests = run_subagent(
        "test engineer",
        "Write comprehensive tests for this implementation.",
        f"Code to test:\n{code}"
    )

    return tests
```

Each step takes the previous step's output as context. Subagents never see each other — only the orchestrator makes the connection.

---

## Context Isolation: Why It Matters

Every subagent starts fresh. This is a feature, not a limitation.

**Advantages:**
- Each subagent focuses on its domain without carrying noise from other tasks
- Token costs drop — you don't send the full conversation history to every subagent
- Different subagents can have different system prompts tailored to their specialty

**Watch out for:**
- Subagents can't see each other's work — the orchestrator must explicitly pass information
- In sequential pipelines, previous outputs must be clearly handed over

---

## Claude Code's Agent Tool

Claude Code's `Agent` tool implements exactly this pattern. When a task is delegated to another agent:

- A new subagent is spawned
- It runs with its own isolated context window
- Optionally, the filesystem is also isolated with a `worktree`
- When the subagent finishes, only the result returns to the orchestrator

```
Orchestrator (main Claude Code session)
    └── Agent tool call
            └── Subagent (separate context, optionally separate worktree)
                    └── Result → returned to orchestrator
```

Delegating independent research tasks to parallel subagents is the most effective way to prevent context window exhaustion in long sessions.

---

## When to Use Multi-Agent

| Use it | Skip it |
|--------|---------|
| Codebase doesn't fit in a single context | Task is simple and single-step |
| Independent tasks can run in parallel | Coordination overhead exceeds parallelism benefit |
| Sub-tasks require different "expertise" | Too much data needs to pass between subagents |
| Preventing context overflow in long sessions | Error tolerance is critical (cascading failure risk) |

---

## Conclusion

Multi-agent systems break through single-agent limits with parallel, isolated execution.

> **The orchestrator decides what to do. Subagents know how to do it.**

If you understand the [basic agent loop](/ai-agents-models-that-use-tools-and-make-decisions), multi-agent is just one step further: the same loop, running in independent contexts, in parallel.
