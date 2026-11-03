import {
  getGeminiClient,
  setCorsHeaders,
  parseRequestBody,
} from './_lib/gemini.ts';

export const config = {
  maxDuration: 30,
};

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    if (res.status) res.status(200);
    else if (res.writeHead) res.writeHead(200);
    res.end();
    return;
  }

  let body: any = {};
  try {
    body = await parseRequestBody(req);
  } catch {
    body = {};
  }

  const { firstMessage } = body || {};

  if (!firstMessage || typeof firstMessage !== 'string' || !firstMessage.trim()) {
    const payload = JSON.stringify({ title: 'New Conversation' });
    res.setHeader('Content-Type', 'application/json');
    if (res.status) res.status(200).json({ title: 'New Conversation' });
    else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(payload);
    }
    return;
  }

  const words = firstMessage
    .trim()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .slice(0, 4)
    .join(' ');
  const fallbackTitle = words.length > 2
    ? words.charAt(0).toUpperCase() + words.slice(1) + ' Resume'
    : 'Resume Discussion';

  try {
    const ai = getGeminiClient();
    const prompt = `Based on this initial user message to a resume builder: "${firstMessage.slice(0, 250)}", generate a concise, professional title for the conversation in 3 to 5 words. Do not use quotation marks, punctuation, or generic filler like "Resume AI Conversation". Examples: "Software Engineer Resume", "Marketing Manager Summary", "Career Change to Product", "Entry Level Data Analyst". Output only the 3-5 words title.`;

    const aiCall = (async () => {
      try {
        return await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
        });
      } catch {
        return await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
      }
    })();

    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('Title generation timeout')), 8000)
    );

    const response = (await Promise.race([aiCall, timeoutPromise])) as any;
    const title = (response?.text ?? fallbackTitle)
      .trim()
      .replace(/^["'#*`]+|["'#*`]+$/g, '')
      .slice(0, 40);

    const finalTitle = title || fallbackTitle;
    res.setHeader('Content-Type', 'application/json');
    if (res.status) res.status(200).json({ title: finalTitle });
    else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ title: finalTitle }));
    }
  } catch (error) {
    console.warn('Fallback title used due to error:', (error as any)?.message || error);
    res.setHeader('Content-Type', 'application/json');
    if (res.status) res.status(200).json({ title: fallbackTitle });
    else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ title: fallbackTitle }));
    }
  }
}
