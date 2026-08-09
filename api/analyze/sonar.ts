import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Type } from '@google/genai';
import { runAIJson } from '../../lib/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { files } = req.body;
  if (!files?.length) return res.status(400).json({ error: 'Debes proporcionar archivos Java.' });
  try {
    const prompt = `Eres un ingeniero de calidad especializado en SonarQube y principios SOLID para Java.
Evalúa estos archivos: ${JSON.stringify(files)}
Responde ÚNICAMENTE en JSON en español.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        qualityGate: { type: Type.STRING, enum: ['PASSED','FAILED','WARNING'] },
        codeSmellsCount: { type: Type.INTEGER },
        cyclomaticComplexityRating: { type: Type.STRING, enum: ['A','B','C','D','F'] },
        solidComplianceScore: { type: Type.INTEGER },
        issues: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { ruleId: { type: Type.STRING }, ruleName: { type: Type.STRING }, severity: { type: Type.STRING }, fileTarget: { type: Type.STRING }, lineNumber: { type: Type.INTEGER }, description: { type: Type.STRING }, refactoringHint: { type: Type.STRING } }, required: ['ruleId','ruleName','severity','fileTarget','description','refactoringHint'] } },
        junitRecommendations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { targetClass: { type: Type.STRING }, suggestedTests: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['targetClass','suggestedTests'] } }
      },
      required: ['qualityGate','codeSmellsCount','cyclomaticComplexityRating','solidComplianceScore','issues','junitRecommendations']
    };

    const result = await runAIJson(prompt, schema);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
