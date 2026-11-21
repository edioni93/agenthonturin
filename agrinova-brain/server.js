import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION || 'global',
});

app.post('/api/phrase', async (req, res) => {
  try {
    const r = await ai.models.generateContent({
      model: process.env.MODEL || 'gemini-3.5-flash-lite',
      contents: String(req.body.prompt || ''),
      config: { responseMimeType: 'application/json', temperature: 0.2 },
    });
    res.json(JSON.parse(r.text));
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: 'model_error' });
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log('AgriNova Brain running on port ' + (process.env.PORT || 8080));
});
