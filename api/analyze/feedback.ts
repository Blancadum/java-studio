import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Type } from '@google/genai';
import { executeWithAiFallback } from '../_lib/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { noFiles, fixedFiles, teacherDoc, apiOptions } = req.body;
  if (!noFiles || !fixedFiles) return res.status(400).json({ error: 'Faltan archivos.' });
  try {
    const { result, usedKeyType } = await executeWithAiFallback(apiOptions || {}, async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Eres un profesor senior experto en Java II y POO universitaria.
Analiza la revisión del alumno comparando JAVAII_NO (suspendido) con JAVAII-FIXED (correcciones).
INDICACIONES DE LA PROFESORA: ${teacherDoc || 'Extrae requerimientos implícitos de Java II.'}
ARCHIVOS SUSPENDIDOS: ${JSON.stringify(noFiles)}
ARCHIVOS REVISADOS: ${JSON.stringify(fixedFiles)}
Responde ÚNICAMENTE en JSON estructurado en español.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.INTEGER },
              passLikelihood: { type: Type.STRING, enum: ['ALTA','MEDIA','BAJA','REQUIERE_CAMBIOS'] },
              teacherComplianceScore: { type: Type.INTEGER },
              summary: { type: Type.STRING },
              keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              criticalGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, category: { type: Type.STRING }, description: { type: Type.STRING }, priority: { type: Type.STRING }, status: { type: Type.STRING }, teacherNote: { type: Type.STRING }, location: { type: Type.STRING } }, required: ['id','title','category','description','priority','status'] } },
              proposals: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, fileTarget: { type: Type.STRING }, issueTitle: { type: Type.STRING }, category: { type: Type.STRING }, description: { type: Type.STRING }, originalCode: { type: Type.STRING }, proposedCode: { type: Type.STRING }, explanation: { type: Type.STRING }, fulfillsTeacherPoint: { type: Type.STRING }, impact: { type: Type.STRING } }, required: ['id','fileTarget','issueTitle','category','description','originalCode','proposedCode','explanation','impact'] } },
              generalAdvice: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['overallScore','passLikelihood','teacherComplianceScore','summary','keyStrengths','criticalGaps','recommendations','proposals','generalAdvice']
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
