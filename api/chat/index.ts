import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeWithAiFallback } from '../_lib/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { message, context, apiOptions } = req.body;
  try {
    const { result } = await executeWithAiFallback(apiOptions || {}, async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Eres un tutor universitario experto en Java II. Responde siempre en español, de forma didáctica y constructiva.
Contexto: ${JSON.stringify(context || {})}
Pregunta: ${message}`
      });
      return response.text || 'Sin respuesta';
    });
    res.json({ text: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
