export default async function handler(req, res) {
  const { q } = req.query;
  const ACCESS_TOKEN = process.env.FEEDLY_TOKEN || 'eyJraWQiOiJhdXQiLCJ2IjoiMSIsImFsZyI6ImRpciIsImVuYyI6IkEyNTZHQ00ifQ..z_nqxyx1CGx5ky0l.jQBK15LrP4HiZdRR3CuWO596KLbEM2haAlqqqJtXrBJ1LblQLAiPGNMadQjZ8Or8TYQlao_MRXmLZLfCyuE4Go_jDx94MmpwpIwY_ILnZksfbowC60-KZSkaoQe-yAIbcd7WNg1K60WmLHNwtd8r9tl02m_C_xY3TsK-ysMykjL_1eZj6cwsy35MfVh6J80CBImQ_2j4PvUTh1l7rcL4cPH7ev4M5MlhyZc1lNouLuJ9YPFhibNUswtZyg6Vh_cQoPg715KmINR56HJ8DrVa7Elfjukh6g.QjMuBf1VOsN4J0l7MlBswQ';

  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // Search for articles matching the query
    const searchUrl = `https://cloud.feedly.com/v3/search/feeds?query=${encodeURIComponent(q || 'artificial intelligence')}&count=10`;
    const searchResp = await fetch(searchUrl, {
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });

    if (!searchResp.ok) {
      const errText = await searchResp.text();
      return res.status(searchResp.status).json({ error: errText });
    }

    const searchData = await searchResp.json();

    // Get stream contents from top feed results
    if (searchData.results && searchData.results.length > 0) {
      const feedId = searchData.results[0].id;
      const streamUrl = `https://cloud.feedly.com/v3/streams/contents?streamId=${encodeURIComponent(feedId)}&count=10`;
      const streamResp = await fetch(streamUrl, {
        headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
      });

      if (streamResp.ok) {
        const streamData = await streamResp.json();
        return res.status(200).json(streamData);
      }
    }

    // Fallback: return search results as-is
    res.status(200).json(searchData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
