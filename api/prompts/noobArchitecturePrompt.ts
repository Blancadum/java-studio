import { Type } from '@google/genai';

export const noobArchitectureSchema = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING },
    summary: { type: Type.STRING },
    architectureType: { type: Type.STRING },
    recommendedClasses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          className: { type: Type.STRING },
          packagePath: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['class', 'interface', 'enum', 'exception'] },
          purpose: { type: Type.STRING },
          keyMethods: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedAttributes: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['className', 'packagePath', 'type', 'purpose', 'keyMethods', 'suggestedAttributes']
      }
    },
    roadmapSteps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          targetClass: { type: Type.STRING },
          tips: { type: Type.STRING }
        },
        required: ['stepNumber', 'title', 'description', 'targetClass', 'tips']
      }
    },
    conceptChecklist: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ['projectName', 'summary', 'architectureType', 'recommendedClasses', 'roadmapSteps', 'conceptChecklist']
};

export const getNoobArchitecturePrompt = (assignmentText: string, targetLevel: string): string => `
Eres un tutor de programación Java experto en desglosar enunciados complejos en arquitecturas sencillas, limpias y escalables para estudiantes de nivel ${targetLevel || 'Principiante/Intermedio'}.

ENUNCIADO / PRACTICA SUBIDA POR EL ALUMNO:
"${assignmentText}"

Analiza el enunciado y crea una guía completa de arquitectura Java orientada a objetos (POO) sin escribir todo el código terminado (para que el alumno aprenda y programe por sí mismo), estructurado así:
1. Nombre del proyecto sugerido.
2. Tipo de arquitectura recomendada (ej: Capas MVC, POO Tradicional, Servicios + Repositorio en memoria).
3. Clases, interfaces y excepciones recomendadas con su propósito, métodos clave y atributos sugeridos.
4. Pasos estructurados (Roadmap paso a paso) para empezar a programar sin agobiarse.
5. Lista de conceptos Java clave a revisar (ej: ArrayList, HashMap, Try-Catch, Override, implements Comparable).

Devuelve la respuesta ÚNICAMENTE como JSON válido en español.
`;