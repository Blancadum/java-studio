import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runAI } from '../../lib/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { message, context } = req.body;
  try {
    const text = await runAI(`Eres un tutor universitario experto en Java II. Responde siempre en español, de forma didáctica y constructiva.
Contexto: ${JSON.stringify(context || {})}
Pregunta: ${message}`);
    res.json({ text });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
