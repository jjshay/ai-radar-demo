# AI Radar Demo

**Live:** [ai-radar-demo.vercel.app](https://ai-radar-demo.vercel.app)

AI-powered news discovery platform with a swipe interface, multi-source aggregation, and LinkedIn carousel generation.

## Features

- **Swipe-based discovery** — Tinder-style UX for browsing AI news articles
- **Multi-source aggregation** — Pulls from NewsAPI, Newsdata.io, and Perplexity
- **Grok integration** — AI-powered article analysis and summarization
- **LinkedIn carousel export** — Turn saved articles into shareable carousel images
- **Mobile-first** — Designed for phone-in-hand content consumption

## Architecture

```
index.html          # Single-page app (HTML/JS/CSS)
api/
  newsapi.js        # NewsAPI serverless function
  newsdata.js       # Newsdata.io serverless function
  perplexity.js     # Perplexity AI serverless function
  grok.js           # Grok AI serverless function
vercel.json         # Serverless routing config
```

Deployed as a static frontend + Vercel serverless API functions. No build step required.

## Deployment

```bash
npm i -g vercel
vercel --prod
```

Set environment variables in Vercel dashboard:
- `NEWSAPI_KEY`
- `NEWSDATA_KEY`
- `PERPLEXITY_API_KEY`
- `GROK_API_KEY`
