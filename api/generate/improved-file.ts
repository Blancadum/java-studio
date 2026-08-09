import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeWithAiFallback } from '../_lib/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { fileTarget, currentCode, proposalsToApply, teacherDoc, apiOptions } = req.body;
  try {
    const { result } = await executeWithAiFallback(apiOptions || {}, async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Aplica estas propuestas al archivo Java "${fileTarget}".

CÓDIGO ACTUAL:
\`\`\`java
${currentCode}
\`\`\`

PROPUESTAS:
${JSON.stringify(proposalsToApply, null, 2)}

INDICACIONES PROFESORA:
${teacherDoc}

Devuelve SOLO el código Java final limpio sin bloques markdown.`
      });
      return (response.text || '').replace(/^```java\n?/, '').replace(/\n?```$/, '').trim();
    });
    res.json({ updatedCode: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
