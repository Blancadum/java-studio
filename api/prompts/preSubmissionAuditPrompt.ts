import { Type } from '@google/genai';
import { JavaFile } from '../../src/data/types';

export const preSubmissionAuditSchema = {
  type: Type.OBJECT,
  properties: {
    cleanScore: { type: Type.INTEGER, description: '0-100 score' },
    readyToSubmit: { type: Type.BOOLEAN },
    summary: { type: Type.STRING },
    detectedIssues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['AI_ARTIFACT', 'HIDDEN_FILE', 'NAMING_CONVENTION', 'MISSING_PACKAGE', 'DELIVERY_FORMAT'] },
          severity: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] },
          title: { type: Type.STRING },
          location: { type: Type.STRING },
          snippet: { type: Type.STRING },
          suggestedFix: { type: Type.STRING }
        },
        required: ['id', 'type', 'severity', 'title', 'location', 'suggestedFix']
      }
    },
    rubricChecks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          passed: { type: Type.BOOLEAN },
          note: { type: Type.STRING }
        },
        required: ['item', 'passed', 'note']
      }
    }
  },
  required: ['cleanScore', 'readyToSubmit', 'summary', 'detectedIssues', 'rubricChecks']
};

export const getPreSubmissionAuditPrompt = (files: JavaFile[], rubricDoc: string): string => `
Eres un auditor de entregas académicas de software en Java.
Tu tarea es revisar un proyecto ANTES de ser entregado en la plataforma de la universidad.

Debes detectar:
1. Rastros de generación por Inteligencia Artificial (comentarios sintéticos típicos como "Here is the implementation", "Note: this method handles...", comentarios genéricos innecesarios).
2. Archivos temporales o de sistema que no deben subirse (.DS_Store, .class, .idea, archivos de log).
3. Inconsistencias de paquetes Java, nombres de archivos .java que no coinciden con la declaración de clase pública.
4. Cumplimiento de las instrucciones de la rúbrica/profesor proporcionadas.

ARCHIVOS A AUDITAR:
${JSON.stringify(files, null, 2)}

INSTRUCCIONES DE LA RÚBRICA / ENTREGA:
${rubricDoc || 'Instrucciones estándar: código en español/inglés uniforme, compilable, sin artefactos temporales ni respuestas de bots en comentarios.'}

Devuelve la respuesta ÚNICAMENTE en JSON en español.
`;