export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = process.env.NEWSAPI_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'NewsAPI key not configured' });
  }

  const { q, pageSize = '10' } = req.query;

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q || 'artificial intelligence')}&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${API_KEY}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });

    if (response.status === 429) {
      return res.status(429).json({ error: 'Rate limited by NewsAPI. Try again shortly.' });
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    if (err.name === 'TimeoutError') {
      return res.status(504).json({ error: 'NewsAPI request timed out' });
    }
    res.status(500).json({ error: err.message });
  }
}
