---
publishDate: 2026-04-26T12:00:00Z
author: Hakan Çelik
title: "Fine-Tuning: When and How to Customize an AI Model"
excerpt: "Fine-tuning isn't always the answer — most of the time it isn't. But when it is, nothing else comes close. Here's when to use it, when RAG is the better call, and why LoRA changed everything."
category: AI
image: ~/assets/images/blog/fine-tuning.jpg
tags:
  - artificial-intelligence
  - fine-tuning
  - lora
  - llm
  - machine-learning
---

## "Let's Fine-Tune It" — When Is That the Right Call?

When a new AI project starts, fine-tuning is often the first answer that comes to mind: "We'll train the model on our own data and get perfect results."

Reality is usually more complicated.

Fine-tuning is expensive, time-consuming, and not the right tool for most problems. But when it genuinely is the right tool, it delivers results nothing else can.

---

## What Is Fine-Tuning?

When you [download an AI model](/what-you-actually-download-when-you-pull-an-ai-model), you're getting billions of parameters trained for general-purpose use. The model can do many things — but it does all of them at a general level.

Fine-tuning takes that general model and **runs additional training on your own dataset**. The model's weights are updated — just like during original training, but at a much smaller scale and with far less data.

```
General Model (billions of params, broad knowledge)
          ↓
  Fine-Tuning (your dataset + gradient descent)
          ↓
Specialized Model (same architecture, updated weights)
```

Using the compilation analogy from the [AI model post](/what-you-actually-download-when-you-pull-an-ai-model): fine-tuning is like taking an existing binary and applying an additional compilation pass with new optimization targets.

---

## Fine-Tuning vs RAG: Which Should You Choose?

Getting this decision right saves significant time and money.

| Question | Fine-Tuning | RAG |
|---|---|---|
| Want to add new **knowledge** to the model? | ✗ Weak | ✓ Strong |
| Want to change the model's **behavior or tone**? | ✓ Strong | ✗ Weak |
| Does data update frequently? | ✗ Retrain each time | ✓ Just update the index |
| Should responses cite sources? | ✗ Hard | ✓ Natural |
| Working with a limited budget? | ✗ Expensive | ✓ Cheap |

**In practice:**
- Q&A over internal company documents → **RAG**
- Every response must follow a specific brand voice → **Fine-tuning**
- Model should naturally use domain-specific terminology → **Fine-tuning**
- Daily-updated product catalog queries → **RAG**

As covered in the [RAG post](/what-is-rag-giving-ai-a-memory): most "bad AI answers" come from the model not having access to the right information — not from the model being insufficiently smart. Try RAG before reaching for fine-tuning.

---

## Full Fine-Tuning: Powerful but Costly

In classic fine-tuning, **all weights** in the model are updated. Most powerful approach — with serious downsides:

- Fine-tuning a 7B parameter model requires ~14GB VRAM
- 70B models need industrial GPU clusters
- Training takes hours and costs real money
- Every update requires repeating the process

This is why most teams now use **parameter-efficient fine-tuning** methods instead.

---

## LoRA: What Made Fine-Tuning Accessible

**LoRA** (Low-Rank Adaptation) is a 2021 technique that fundamentally changed what fine-tuning looks like in practice.

The core idea: instead of updating all model weights, add **small adapter matrices** to the original weights. Only those adapters are trained.

```
Original Weight Matrix (W) — frozen, unchanged
          +
LoRA Adapter (A × B) — small matrices being trained
          =
Effective Weight (W + AB)
```

The results:

| | Full Fine-Tuning | LoRA |
|---|---|---|
| Parameters trained | ~100% | ~0.1–1% |
| VRAM required | Very high | Low |
| Training time | Long | Short |
| Quality gap | Reference | Typically 90–95% of full |
| Multiple tasks | Separate model per task | One model + multiple adapters |

**QLoRA** combines LoRA with quantization — adding LoRA adapters to a 4-bit quantized model. This makes it possible to fine-tune 7B–13B models on consumer GPUs with 16–24GB VRAM.

---

## Practical: Fine-Tuning a Model

The most common toolchain today is Hugging Face + PEFT:

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import get_peft_model, LoraConfig, TaskType

# Load the base model
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.2-3B")
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-3B")

# LoRA configuration
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,           # rank — lower = fewer parameters
    lora_alpha=32,  # scaling factor
    lora_dropout=0.1,
    target_modules=["q_proj", "v_proj"]  # which layers to adapt
)

# Add LoRA adapters
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# Trainable params: ~4M / 3B (0.1%)
```

**Data format** for instruction fine-tuning:

```json
[
  {
    "instruction": "Rewrite the following in formal English.",
    "input": "Hey, wanna grab lunch? You free?",
    "output": "I wanted to reach out and inquire whether you might be available to join me for lunch."
  }
]
```

A few hundred to a few thousand high-quality examples is usually enough. Data quality matters far more than quantity.

---

## When Fine-Tuning Is Actually the Right Answer

Consider fine-tuning when:

1. **Consistent tone and style:** All responses need to reflect a specific brand voice, and prompt engineering isn't holding it reliably.

2. **Domain-specific tasks:** In medicine, law, or finance, the model uses the right general terms but misses nuances only fine-tuning on domain data can capture.

3. **Low latency + high volume:** A small but well-tuned model can be both cheaper and faster than prompt-engineering a large one.

4. **Privacy constraints:** You can't send data to a third-party API — you need to run a fine-tuned model on your own infrastructure.

---

## Conclusion

Fine-tuning is one of the most powerful tools in the AI toolbox — just not the most frequently needed one.

> **The sequence: first try a good [prompt](/prompt-engineering-how-to-talk-to-ai-models). If it's a knowledge access problem, add [RAG](/what-is-rag-giving-ai-a-memory). If you need to change root model behavior, reach for fine-tuning.**

Thanks to LoRA, fine-tuning is no longer exclusive to organizations with massive GPU budgets. With the right dataset and a single consumer GPU, meaningful specialization is within reach.
