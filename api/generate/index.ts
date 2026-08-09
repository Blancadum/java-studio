import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runAI } from '../../lib/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { fileTarget, currentCode, proposalsToApply, teacherDoc } = req.body;
  try {
    const updatedCode = await runAI(`Aplica estas propuestas al archivo Java "${fileTarget}".
CÓDIGO ACTUAL:
\`\`\`java
${currentCode}
\`\`\`
PROPUESTAS: ${JSON.stringify(proposalsToApply)}
INDICACIONES PROFESORA: ${teacherDoc}
Devuelve SOLO el código Java final limpio sin bloques markdown.`);
    res.json({ updatedCode: updatedCode.replace(/^```java\n?/, '').replace(/\n?```$/, '').trim() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
