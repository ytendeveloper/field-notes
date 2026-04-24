---
title: "Agents, quietly: why the next wave of AI will feel less like a chatbot"
deck: "Most 'agentic' demos are still framed as a conversation that happens to call tools. But the interesting work is invisible — models that plan, retry, and narrate progress as a first-class citizen of the UI."
date: 2026-04-22
edited: 2026-04-24
tags: [AI, Agents, Essay]
pull: "The best agents are the ones you stop noticing — they disappear into the work."
---

The most persistent assumption in agent demos — the one that keeps showing up even in otherwise careful work — is that the interface to the agent is *the conversation*. You type, it types. You watch a progress indicator and a stream of messages. The model's reasoning, such as it is, is laid bare as a scrollable log. It's a strange bit of skeuomorphism: we've taken the one novel capability of language models — that they can genuinely operate on the world rather than just describe it — and stapled it into the UI pattern we invented for IRC.

The interesting agents, the ones I actually want to live with, feel much closer to a good colleague than a good chatbot. They disappear. They produce a result. When something is wrong you can page through what they did, but you don't have to read the play-by-play.

::: pull
"The best agents are the ones you stop noticing — they disappear into the work."
:::

## The conversation is not the product

I've been running a small, dumb experiment on myself for about six months. Every time I reach for a chat-style AI tool, I ask: is the conversation actually the thing I need? Or is it a ladder I'm using to get to a document, a piece of code, a schedule, a decision? More often than not, the conversation is the ladder — and the ladder is in the way.

The easiest way to see this is to watch a non-technical person use any current agentic tool. They open the chat. They ask a question. The model replies with a wall of text that includes the answer and four paragraphs of caveats and three unrequested next steps. The person either scrolls past it or closes the tab. Almost nobody reads the whole reply. The reply is not the product. It was never the product. It was just the only interface we knew how to build.

::: callout Aside
This isn't a criticism of chat as a *primitive* — it's a criticism of chat as a *default*. A chat is a fine way to specify intent. It's a terrible way to deliver a result.
:::

## What ambient agents look like

An "ambient" agent, the way I'm using the term, is one that is doing work *adjacent to* my normal tools — not inside a separate chat surface. Three patterns I've been trying in my own projects:

- **Margin annotations.** The agent's output appears *near* the thing it's acting on, not in a separate conversation. In an editor: a suggested rename hovers over the symbol, not in a sidebar.
- **Latent progress.** The agent narrates what it's doing in a single line of status — not a stream of reasoning tokens. If I want the play-by-play I open a drawer; I never have to.
- **Reversible outputs.** Whatever the agent produces is easy to undo, easy to compare against what was there before, and easy to nudge. The UI for *editing the agent's work* is the main UI. The UI for *asking the agent to work* is tiny.

<figure>
<div class="ph">fig 1 · margin-annotation sketch</div>
<figcaption>A rough sketch of the "suggestion floats next to the thing" pattern.</figcaption>
</figure>

## A small concrete example

I've been rebuilding a personal CRM around this principle. The old version was a chat interface to my contacts: "Hey, what's going on with Rita?" The new version is a timeline, and the agent's output appears as inline little cards in the timeline — a "suggested follow-up" that I either tap to accept or swipe to dismiss.

The functionality is identical. I can still ask "what's going on with Rita?" — there's a command palette. But I almost never do, because by the time I've thought of the question, the answer is already sitting in her row, waiting for me.

```ts
// a suggestion is just a row in the timeline
type Suggestion = {
  subjectId: string;
  kind: 'follow_up' | 'note' | 'reminder';
  body: string;           // < 80 chars
  rationale?: string;     // shown on long-press
  createdAt: Date;
};
```

The `rationale` field is the whole bit. The agent has reasons; it will happily show them to you; you never have to look at them unless something feels wrong. This is, I think, the minimum viable contract for ambient agents: **the reasoning is available, but not mandatory**.

## Where chat still wins

None of this is to say chat is dead — it isn't, obviously. Chat is unmatched for *open-ended specification*: when I don't yet know what I want, when the shape of the answer is itself up for grabs, when I'm going to iterate by rephrasing. Design conversations, brainstorming, therapy-style reflections, debugging — all of these live happily in chat because the thing I'm producing *is* the conversation.

The failure mode is treating every task as if it were that task. Most of the things we ask agents to do — send this email, update this row, summarize this meeting, route this ticket — have a *crisp result shape*. When the result is crisp, the UI should be crisp too. A chat is an indulgence.

## What I'm watching for next

The tell, I think, will be when a major product ships an agent without a conversational surface at all — just the results and a one-line status bar. It'll feel thin at first. Then it'll feel obvious. Then every chatbox will look like a mistake.

In the meantime, I'm trying to catch myself every time I reach for a chat interface and ask: is the conversation what I need, or am I using the conversation as a lever to get somewhere else? More often than I'd like to admit, I'm pulling the lever.
