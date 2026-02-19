export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = process.env.NEWSDATA_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'NewsData key not configured' });
  }

  const { q, language = 'en' } = req.query;

  try {
    const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=${encodeURIComponent(q || 'artificial intelligence')}&language=${language}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });

    if (response.status === 429) {
      return res.status(429).json({ error: 'Rate limited by NewsData. Try again shortly.' });
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    if (err.name === 'TimeoutError') {
      return res.status(504).json({ error: 'NewsData request timed out' });
    }
    res.status(500).json({ error: err.message });
  }
}
