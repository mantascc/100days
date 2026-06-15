---
id: veins/language-and-nlp-interpretability
type: vein
title: Language and NLP interpretability
state: active
charge: medium
spawned: [36-spinning-globe, 37-sentiment-analyzer]
feeds: [veins/design-system-and-reference-sheets, veins/generative-typography-and-text]
sources: []
date: 2026-06-14
tags: [nlp, sentiment, interpretability, attribution, language]
---

# What
Treating a language model not as an oracle but as something to interrogate. The recurring move is to take a prediction — a sentiment score — and make its *reasoning* legible: which tokens pushed the verdict which way, what happens if you swap a word, where the model is confident and where it guesses. Sentiment is the surface; the real subject is attribution and counterfactual exploration — running local inference (transformers.js) and ablating spans to render a heatmap over the text. It turns "the model says 4 stars" into "here is *why*, and here is what would change it," and in doing so exposes the model's limits (sarcasm, mixed sentiment) as features rather than bugs.

# Trace
- [36-spinning-globe](../../36-spinning-globe/) — the sentiment examiner: attribution heatmap plus an "expressive" mood view.
- [37-sentiment-analyzer](../../37-sentiment-analyzer/) — the same engine framed as twin "industrial" (data-dense) and "expressive" (emotional) views.

# Charge
A fresh, distinct direction — the first sustained move into language and model interpretability rather than purely visual generation. Mid-charge because it is new and a little un-anchored to the rest of the practice; the bridge to the visual veins (heatmaps, density ramps, typography-as-data) is the obvious place it could catch fire.

# Prompts
- Attribution as an ASCII/glyph density field — token weight mapped to character ink, not colour.
- A counterfactual editor for *any* classifier, not just sentiment — generalise the ablation loop.
- Show two models disagreeing on the same sentence, side by side, with their attributions overlaid.
