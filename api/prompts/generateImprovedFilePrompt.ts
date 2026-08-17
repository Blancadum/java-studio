import { ImprovementProposal } from '../../src/data/types';

export function getGenerateImprovedFilePrompt(
  fileTarget: string,
  currentCode: string,
  proposalsToApply: ImprovementProposal[],
  teacherDoc: string
): string {
  const proposalsText = proposalsToApply
    .map(p => `- ${p.issueTitle}: ${p.description}. Propuesta: ${p.proposedCode}`)
    .join('\n');

  return `
Eres un experto en refactorización de código Java.
Tu tarea es aplicar una o más propuestas de mejora a un archivo de código existente.

Archivo a modificar: ${fileTarget}

Código actual del archivo:
\`\`\`java
${currentCode}
\`\`\`

Propuestas de mejora a aplicar:
${proposalsText}

${teacherDoc ? `Contexto adicional (feedback del profesor):\n${teacherDoc}` : ''}

Devuelve ÚNICAMENTE el código Java completo del archivo ${fileTarget} con las mejoras aplicadas. No incluyas explicaciones ni la sintaxis de markdown \`\`\`java.
`;
}