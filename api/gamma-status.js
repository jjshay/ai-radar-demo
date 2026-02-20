export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = (process.env.GAMMA_API_KEY || '').split('\n')[0].trim();
  if (!API_KEY) {
    return res.status(500).json({ error: 'Gamma API key not configured' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing generation ID' });
  }

  try {
    const response = await fetch(`https://public-api.gamma.app/v1.0/generations/${id}`, {
      headers: {
        'X-API-KEY': API_KEY
      },
      signal: AbortSignal.timeout(10000)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Gamma status error', details: data });
    }

    res.status(200).json({
      status: data.status,
      gammaUrl: data.gammaUrl || null,
      credits: data.credits || null
    });
  } catch (err) {
    if (err.name === 'TimeoutError') {
      return res.status(504).json({ error: 'Gamma status request timed out' });
    }
    res.status(500).json({ error: err.message });
  }
}
