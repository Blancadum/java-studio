import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Type } from '@google/genai';
import { runAIJson } from '../../lib/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { statementText, assignmentText, targetLevel } = req.body;
  const text = statementText || assignmentText;
  if (!text?.trim()) return res.status(400).json({ error: 'Debes proporcionar el enunciado.' });
  try {
    const prompt = `Eres un tutor de Java experto en POO para nivel ${targetLevel || 'Principiante'}.
ENUNCIADO: "${text}"
Crea una guía de arquitectura Java sin resolver el código completo. Responde ÚNICAMENTE en JSON en español.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        projectName: { type: Type.STRING }, summary: { type: Type.STRING }, architectureType: { type: Type.STRING },
        recommendedClasses: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { className: { type: Type.STRING }, packagePath: { type: Type.STRING }, type: { type: Type.STRING }, purpose: { type: Type.STRING }, keyMethods: { type: Type.ARRAY, items: { type: Type.STRING } }, suggestedAttributes: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['className','packagePath','type','purpose','keyMethods','suggestedAttributes'] } },
        roadmapSteps: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { stepNumber: { type: Type.INTEGER }, title: { type: Type.STRING }, description: { type: Type.STRING }, targetClass: { type: Type.STRING }, tips: { type: Type.STRING } }, required: ['stepNumber','title','description','targetClass','tips'] } },
        conceptChecklist: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['projectName','summary','architectureType','recommendedClasses','roadmapSteps','conceptChecklist']
    };

    const result = await runAIJson(prompt, schema);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
