import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Google Places の API キーは .env に GOOGLE_PLACES_KEY=xxxxx として保存
const GOOGLE_KEY = process.env.GOOGLE_PLACES_KEY;

app.get('/proxy', async (req, res) => {
  try {
    const target = req.query.url;
    if (!target) return res.status(400).send('missing url');

    // Googleキーを自動付与（キーをフロントに渡さない）
    const sep = target.includes('?') ? '&' : '?';
    const finalUrl = `${target}${sep}key=${GOOGLE_KEY}`;

    const r = await fetch(finalUrl);
    const text = await r.text();
    res.set('Content-Type', r.headers.get('content-type') || 'application/json');
    res.send(text);
  } catch (e) {
    console.error(e);
    res.status(500).send('proxy error');
  }
});

app.listen(3000, () => console.log('Proxy server on http://localhost:3000'));
