import { setCorsHeaders } from './_lib/gemini.ts';

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    if (res.status) res.status(200);
    else if (res.writeHead) res.writeHead(200);
    res.end();
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const hasApiKey = Boolean(apiKey && apiKey.trim().length > 0);

  const payload = {
    status: 'ok',
    timestamp: Date.now(),
    geminiConfigured: hasApiKey,
    environment: process.env.NODE_ENV || 'production',
  };

  res.setHeader('Content-Type', 'application/json');
  if (res.status) {
    res.status(200).json(payload);
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
  }
}
