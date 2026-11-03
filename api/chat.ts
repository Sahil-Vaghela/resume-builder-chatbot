import {
  getGeminiClient,
  RESUME_SYSTEM_INSTRUCTION,
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
    if (res.status) {
      res.status(405).json({ error: 'Method not allowed. Use POST.' });
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
    }
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    console.error('GEMINI_API_KEY is missing in server environment');
    res.setHeader('Content-Type', 'application/json');
    const errBody = JSON.stringify({
      error:
        'GEMINI_API_KEY is not defined in server environment variables. Please add GEMINI_API_KEY in Vercel Project Settings > Environment Variables.',
    });
    if (res.status) {
      res.status(500).json(JSON.parse(errBody));
    } else {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(errBody);
    }
    return;
  }

  let body: any = {};
  try {
    body = await parseRequestBody(req);
  } catch (err) {
    console.error('Failed to parse request body:', err);
  }

  const { messages, tone, careerField } = body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    res.setHeader('Content-Type', 'application/json');
    if (res.status) {
      res.status(400).json({ error: 'Messages array is required' });
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Messages array is required' }));
    }
    return;
  }

  const contents = messages
    .filter((m: any) => m && typeof m.content === 'string' && m.content.trim().length > 0)
    .map((m: any) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content.trim() }],
    }));

  if (contents.length === 0) {
    res.setHeader('Content-Type', 'application/json');
    if (res.status) {
      res.status(400).json({ error: 'At least one message with text content is required' });
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'At least one message with text content is required' }));
    }
    return;
  }

  let customizedInstruction = RESUME_SYSTEM_INSTRUCTION;
  if (tone) {
    customizedInstruction += `\n\nTone preference: Please maintain a ${tone} tone in your recommendations and wording.`;
  }
  if (careerField) {
    customizedInstruction += `\nTarget Career Field / Role: ${careerField}. Ensure industry-standard keywords and terminology tailored for this domain.`;
  }

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  if (typeof res.flushHeaders === 'function') {
    res.flushHeaders();
  }

  try {
    const ai = getGeminiClient();

    const createStreamWithTimeout = async (model: string, timeoutMs: number = 25000) => {
      const callPromise = ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction: customizedInstruction,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms with model ${model}`)), timeoutMs)
      );

      return (await Promise.race([callPromise, timeoutPromise])) as any;
    };

    let stream;
    try {
      stream = await createStreamWithTimeout('gemini-3.8-flash', 25000);
    } catch (primaryErr: any) {
      console.warn('Primary model (gemini-3.8-flash) error, trying gemini-3.1-flash-lite fallback:', primaryErr?.message);
      stream = await createStreamWithTimeout('gemini-3.1-flash-lite', 20000);
    }

    let emittedCount = 0;
    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        emittedCount++;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
        if (typeof res.flush === 'function') {
          res.flush();
        }
      }
    }

    if (emittedCount === 0) {
      res.write(`data: ${JSON.stringify({ error: 'AI model produced an empty response. Please try again.' })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Error generating chat response:', error);
    const errorMessage = error?.message || 'Failed to generate response. Please try again.';
    res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
}
