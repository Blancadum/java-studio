import { Type } from '@google/genai';
import { JavaFile } from '../../src/data/types';

export const sonarQualitySchema = {
  type: Type.OBJECT,
  properties: {
    qualityGate: { type: Type.STRING, enum: ['PASSED', 'FAILED', 'WARNING'] },
    codeSmellsCount: { type: Type.INTEGER },
    cyclomaticComplexityRating: { type: Type.STRING, enum: ['A', 'B', 'C', 'D', 'F'] },
    solidComplianceScore: { type: Type.INTEGER },
    issues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          ruleId: { type: Type.STRING },
          ruleName: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR'] },
          fileTarget: { type: Type.STRING },
          lineNumber: { type: Type.INTEGER },
          description: { type: Type.STRING },
          refactoringHint: { type: Type.STRING }
        },
        required: ['ruleId', 'ruleName', 'severity', 'fileTarget', 'description', 'refactoringHint']
      }
    },
    junitRecommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          targetClass: { type: Type.STRING },
          suggestedTests: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['targetClass', 'suggestedTests']
      }
    }
  },
  required: ['qualityGate', 'codeSmellsCount', 'cyclomaticComplexityRating', 'solidComplianceScore', 'issues', 'junitRecommendations']
};

export const getSonarQualityPrompt = (files: JavaFile[]): string => `
Eres un ingeniero de calidad de software especializado en SonarQube, métricas de código Java y principios SOLID.

Evalúa los siguientes archivos de código Java:
${JSON.stringify(files, null, 2)}

Informa sobre:
1. Quality Gate (PASSED, WARNING, FAILED).
2. Conteo de Code Smells (métodos muy largos, System.out en lugar de logger/excepciones, captura genérica Exception, magic numbers).
3. Rating de Complejidad Ciclomática (A a F).
4. Puntuación de adherencia a principios SOLID (0-100).
5. Violaciones detalladas con regla (ej: java:S106, java:S112, java:S1186) e instrucción para refactorizar.
6. Propuestas de casos de prueba JUnit 5 recomendados para maximizar la cobertura.

Devuelve la respuesta ÚNICAMENTE como JSON estructurado en español.
`;