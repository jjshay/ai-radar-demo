export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = (process.env.GAMMA_API_KEY || '').split('\n')[0].trim();
  if (!API_KEY) {
    return res.status(500).json({ error: 'Gamma API key not configured' });
  }

  try {
    const { title, summary, source, topic, scores, rationales, sentiment, tags, numCards } = req.body;

    // Build rich input text from article data
    const scoreText = scores ? Object.entries(scores).map(([k, v]) => `${k}: ${v}/100`).join(', ') : '';
    const rationaleText = rationales ? Object.entries(rationales).map(([k, v]) => `${k}: ${v}`).join('\n') : '';
    const tagText = tags && tags.length ? tags.join(', ') : '';

    const inputText = `Create a professional LinkedIn-style presentation about this article.

ARTICLE TITLE: ${title}

SUMMARY: ${summary}

SOURCE: ${source}
TOPIC: ${topic}
SENTIMENT: ${sentiment || 'neutral'}
${tagText ? `TAGS: ${tagText}` : ''}

AI SCORES: ${scoreText}

AI ANALYSIS:
${rationaleText}

Structure the presentation as:
1. Bold title card with the headline
2. Key statistics and data points
3. Main insight and why it matters
4. Deep analysis with industry context
5. Market impact and implications
6. Expert perspectives and AI analysis
7. Future outlook and predictions
8. Action items for professionals
9. Call to action with source attribution

End with: "Created with AI Radar by JJ Shay | jjshay.com"
Include source: ${source}`;

    const response = await fetch('https://public-api.gamma.app/v1.0/generations', {
      method: 'POST',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputText,
        textMode: 'generate',
        format: 'presentation',
        numCards: numCards || 10,
        textOptions: {
          amount: 'medium',
          tone: 'professional, authoritative, LinkedIn-ready',
          audience: 'business executives, tech leaders, and professionals',
          language: 'en'
        },
        imageOptions: {
          source: 'webFreeToUse'
        },
        cardOptions: {
          dimensions: '16x9'
        },
        sharingOptions: {
          externalAccess: 'view'
        }
      }),
      signal: AbortSignal.timeout(30000)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gamma API error:', response.status, JSON.stringify(data));
      return res.status(response.status).json({ error: data.message || 'Gamma API error', details: data });
    }

    // Return generationId for polling
    res.status(200).json({
      generationId: data.generationId,
      status: data.status || 'pending'
    });
  } catch (err) {
    if (err.name === 'TimeoutError') {
      return res.status(504).json({ error: 'Gamma API request timed out' });
    }
    console.error('Gamma handler error:', err);
    res.status(500).json({ error: err.message });
  }
}
