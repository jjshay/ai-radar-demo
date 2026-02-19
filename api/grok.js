export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = (process.env.GROK_KEY || process.env.GROK_API_KEY || '').trim();
  if (!API_KEY) {
    return res.status(500).json({ error: 'Grok API key not configured' });
  }

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(15000)
    });

    if (response.status === 429) {
      return res.status(429).json({ error: 'Rate limited by xAI. Try again shortly.' });
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    if (err.name === 'TimeoutError') {
      return res.status(504).json({ error: 'Grok API request timed out' });
    }
    res.status(500).json({ error: err.message });
  }
}
