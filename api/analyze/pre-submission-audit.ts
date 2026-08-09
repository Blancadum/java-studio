import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Type } from '@google/genai';
import { executeWithAiFallback } from '../_lib/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { files, teacherRubricText, rubricDoc, apiOptions } = req.body;
  if (!files?.length) return res.status(400).json({ error: 'Debes proporcionar archivos Java.' });
  try {
    const { result, usedKeyType } = await executeWithAiFallback(apiOptions || {}, async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Eres un auditor de entregas académicas Java. Detecta rastros de IA, archivos temporales e incumplimientos.
ARCHIVOS: ${JSON.stringify(files)}
RÚBRICA: ${teacherRubricText || rubricDoc || 'Estándar: código compilable, sin artefactos temporales.'}
Responde ÚNICAMENTE en JSON en español.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cleanScore: { type: Type.INTEGER },
              readyToSubmit: { type: Type.BOOLEAN },
              summary: { type: Type.STRING },
              detectedIssues: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, type: { type: Type.STRING }, severity: { type: Type.STRING }, title: { type: Type.STRING }, location: { type: Type.STRING }, snippet: { type: Type.STRING }, suggestedFix: { type: Type.STRING } }, required: ['id','type','severity','title','location','suggestedFix'] } },
              rubricChecks: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { item: { type: Type.STRING }, passed: { type: Type.BOOLEAN }, note: { type: Type.STRING } }, required: ['item','passed','note'] } }
            },
            required: ['cleanScore','readyToSubmit','summary','detectedIssues','rubricChecks']
          }
        }
      });
      return JSON.parse(response.text!);
    });
    res.json({ ...result, metaUsedKey: usedKeyType });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
