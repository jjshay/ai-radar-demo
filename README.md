# AI Radar Demo

> Swipe through AI news like a deck of cards, score it with multiple AI models, listen to voice summaries, and export any story as a LinkedIn-ready Gamma presentation.

**Live:** [ai-radar-demo.vercel.app](https://ai-radar-demo.vercel.app)

## Overview

Keeping up with AI news means scanning dozens of sources and still missing what matters. AI Radar Demo turns discovery into a mobile, Tinder-style swipe experience: articles are aggregated from NewsAPI, Newsdata.io, and Perplexity, analyzed and scored by Grok, narrated as TTS audio summaries via a companion backend, and — for keepers — converted into multi-card LinkedIn presentations through the Gamma generation API. The whole app ships as a single HTML page plus a thin layer of Vercel serverless proxies that keep every API key server-side.

Part of the **Global Gauntlet AI** portfolio pillar (AI strategy, content, and market intelligence).

## Key Features

- **Swipe-based discovery** — card-deck UX for triaging AI news articles on a phone
- **Multi-source aggregation** — NewsAPI and Newsdata.io feeds plus Perplexity chat-completions for research-grade context
- **Grok scoring and analysis** — xAI chat completions produce per-article scores, rationales, sentiment, and tags
- **Voice audio summaries** — article summaries are narrated via a TTS endpoint on the companion Railway backend, fired in parallel with deck generation
- **Gamma presentation export** — one tap builds a structured 9-section prompt (headline card, key stats, market impact, outlook, CTA) and polls the Gamma API until the deck is ready
- **Serverless key isolation** — every third-party API is called through a `/api/*` Vercel function; no keys ever reach the browser
- **Defensive networking** — per-provider request timeouts (`AbortSignal.timeout`), explicit 429 rate-limit responses, and 504 timeout mapping in every proxy
- **XSS-safe rendering** — all article strings pass through an HTML-escaping helper before insertion into the DOM

## How It Works

| Stage | Component | What happens |
|-------|-----------|--------------|
| 1. Fetch | `/api/newsapi`, `/api/newsdata` | Topic query fans out to news providers with 8–10s timeouts |
| 2. Enrich | `/api/perplexity`, `/api/grok` | AI analysis, scoring, and summarization of each article |
| 3. Swipe | `index.html` | Single-page app renders the card deck; saves/skips per swipe |
| 4. Narrate | Railway backend (`/audio-summary`) | TTS audio generated for the selected article, non-blocking |
| 5. Export | `/api/gamma` → `/api/gamma-status` | Gamma generation kicked off, then polled by generation ID until `gammaUrl` is ready |

The Gamma flow is deliberately async: the create call returns a `generationId` immediately and the client polls the status proxy, mirroring Gamma's pending-generation API model.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Single-file HTML/CSS/JS (no framework, no build step) |
| Serverless | Vercel functions (Node.js ES modules) |
| AI / APIs | Grok (xAI), Perplexity, Gamma Generations API, NewsAPI, Newsdata.io |
| Voice | Companion Railway backend TTS endpoint |
| Deployment | Vercel (static + serverless) |

## Getting Started

### Prerequisites

- Node.js and the Vercel CLI (`npm i -g vercel`)
- API keys for the providers you want live (the UI degrades gracefully when a proxy returns "not configured")

### Installation

```bash
git clone https://github.com/jjshay/ai-radar-demo.git
cd ai-radar-demo
vercel dev   # run locally with serverless functions
```

### Configuration

Set these in the Vercel dashboard (Project → Settings → Environment Variables):

| Variable | Description |
|----------|-------------|
| `NEWSAPI_KEY` | NewsAPI.org key for headline aggregation |
| `NEWSDATA_KEY` | Newsdata.io key for the second news feed |
| `PERPLEXITY_API_KEY` (or `PERPLEXITY_KEY`) | Perplexity chat-completions key |
| `GROK_API_KEY` (or `GROK_KEY`) | xAI Grok key for scoring/analysis |
| `GAMMA_API_KEY` | Gamma public API key for presentation generation |

Never commit keys; all secrets live in Vercel env vars and are read only inside `/api/*` functions.

## Usage

```bash
vercel --prod   # deploy
```

Serverless endpoints:

- `GET /api/newsapi?q=<topic>&pageSize=25` — NewsAPI proxy
- `GET /api/newsdata?q=<topic>&language=en` — Newsdata.io proxy
- `POST /api/perplexity` — Perplexity chat-completions passthrough
- `POST /api/grok` — Grok chat-completions passthrough
- `POST /api/gamma` — start a Gamma presentation generation (returns `generationId`)
- `GET /api/gamma-status?id=<generationId>` — poll until `gammaUrl` is ready

## Project Structure

```
ai-radar-demo/
├── index.html          # Entire single-page app (swipe deck, scoring UI, Gamma flow)
├── api/
│   ├── newsapi.js      # NewsAPI proxy (timeout + 429 handling)
│   ├── newsdata.js     # Newsdata.io proxy
│   ├── perplexity.js   # Perplexity proxy
│   ├── grok.js         # Grok (xAI) proxy
│   ├── gamma.js        # Gamma generation kickoff with structured prompt
│   └── gamma-status.js # Gamma generation polling
├── logos/              # AI provider logos used in the UI
├── assets/             # App branding and source logos
└── vercel.json         # Vercel config
```

## Related Projects

- [ai-radar-mobile](https://github.com/jjshay/ai-radar-mobile) — mobile-first AI content discovery app with swipe UX and carousel export
- [intelligence-engine](https://github.com/jjshay/intelligence-engine) — multi-AI news scoring using ChatGPT, Claude, Gemini, Grok, and Perplexity
- [TradeWatch](https://github.com/jjshay/TradeWatch) — AI-powered market intelligence dashboard
