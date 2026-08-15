import { Type } from '@google/genai';
import { JavaFile } from '../../src/data/types';

export function getJavaProjectAnalysisPrompt(
  noFiles: JavaFile[],
  fixedFiles: JavaFile[],
  teacherDoc?: string
): string {
  const noFilesText = noFiles.map(f => `// FILE: ${f.name}\n${f.content}`).join('\n\n---\n\n');
  const fixedFilesText = fixedFiles.map(f => `// FILE: ${f.name}\n${f.content}`).join('\n\n---\n\n');

  return `Eres un profesor experto en Java II y Programación Orientada a Objetos universitaria.

Analiza la EVOLUCIÓN del código de un estudiante:
- ZIP_ORIGINAL: versión suspendida/original del estudiante
- ZIP_FIXED: versión mejorada/corregida

${teacherDoc ? `NOTAS DEL PROFESOR / RÚBRICA:\n${teacherDoc}\n\n` : ''}

ZIP_ORIGINAL (versión original):
\`\`\`java
${noFilesText}
\`\`\`

ZIP_FIXED (versión mejorada):
\`\`\`java
${fixedFilesText}
\`\`\`

Evalúa y genera un análisis completo en JSON con:
- Puntuación global (0-100)
- Probabilidad de aprobar
- Puntuación de cumplimiento con las notas del profesor
- Resumen ejecutivo
- Puntos fuertes clave
- Gaps críticos
- Recomendaciones específicas
- Propuestas de mejora de código
- Consejos generales

Responde ÚNICAMENTE en JSON válido.`;
}

export const javaProjectAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER },
    passLikelihood: { type: Type.STRING },
    teacherComplianceScore: { type: Type.NUMBER },
    summary: { type: Type.STRING },
    keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    criticalGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          category: { type: Type.STRING },
          description: { type: Type.STRING },
          priority: { type: Type.STRING },
          status: { type: Type.STRING },
        }
      }
    },
    proposals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          fileTarget: { type: Type.STRING },
          issueTitle: { type: Type.STRING },
          category: { type: Type.STRING },
          description: { type: Type.STRING },
          originalCode: { type: Type.STRING },
          proposedCode: { type: Type.STRING },
          explanation: { type: Type.STRING },
          impact: { type: Type.STRING },
        }
      }
    },
    generalAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
  }
};
