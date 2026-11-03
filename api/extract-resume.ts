import {
  getGeminiClient,
  setCorsHeaders,
  parseRequestBody,
} from './_lib/gemini.ts';

export const config = {
  maxDuration: 60,
};

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    if (res.status) res.status(200);
    else if (res.writeHead) res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    if (res.status) res.status(405).json({ error: 'Method not allowed. Use POST.' });
    else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
    }
    return;
  }

  let body: any = {};
  try {
    body = await parseRequestBody(req);
  } catch {
    body = {};
  }

  const { messages } = body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    res.setHeader('Content-Type', 'application/json');
    if (res.status) res.status(400).json({ error: 'Messages required' });
    else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Messages required' }));
    }
    return;
  }

  try {
    const ai = getGeminiClient();
    const conversationDigest = messages
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`)
      .join('\n\n');

    const prompt = `Review the following conversation between a user and a resume consultant:

---
${conversationDigest.slice(-8000)}
---

Extract all concrete resume information that has been gathered or finalized so far into structured markdown text formatted as a clean, ready-to-use resume draft. Include whichever sections have content (e.g., Contact Info, Professional Summary, Technical & Soft Skills, Work Experience, Projects, Education, Certifications).
If a section has not been discussed yet, omit it or write a clean empty placeholder. Output clean markdown directly, starting with the candidate's name or title.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });
    } catch {
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
      });
    }

    const payload = JSON.stringify({ markdown: response.text || '' });
    res.setHeader('Content-Type', 'application/json');
    if (res.status) res.status(200).json({ markdown: response.text || '' });
    else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(payload);
    }
  } catch (error: any) {
    console.error('Error extracting resume draft:', error);
    res.setHeader('Content-Type', 'application/json');
    if (res.status) res.status(500).json({ error: 'Could not extract resume content' });
    else {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Could not extract resume content' }));
    }
  }
}
