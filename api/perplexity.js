export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = (process.env.PERPLEXITY_KEY || process.env.PERPLEXITY_API_KEY || '').split('\n')[0].trim();
  if (!API_KEY) {
    return res.status(500).json({ error: 'Perplexity API key not configured' });
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(15000)
    });

    if (response.status === 429) {
      return res.status(429).json({ error: 'Rate limited by Perplexity. Try again shortly.' });
    }

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      res.status(response.status).json(data);
    } catch (parseErr) {
      res.status(response.status).json({
        error: `Perplexity returned status ${response.status}`,
        keyPrefix: API_KEY.substring(0, 8) + '...',
        keyLength: API_KEY.length,
        bodyPreview: text.substring(0, 200)
      });
    }
  } catch (err) {
    if (err.name === 'TimeoutError') {
      return res.status(504).json({ error: 'Perplexity API request timed out' });
    }
    res.status(500).json({ error: err.message });
  }
}
