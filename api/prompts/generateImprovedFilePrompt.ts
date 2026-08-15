// generateImprovedFilePrompt.ts

export function getGenerateImprovedFilePrompt(
  fileTarget: string,
  currentCode: string,
  proposalsToApply: any[],
  teacherDoc?: string
): string {
  const proposalsText = proposalsToApply
    .map(p => `- ${p.issueTitle}: ${p.explanation}\nCambio: ${p.originalCode} → ${p.proposedCode}`)
    .join('\n\n');

  return `Eres un experto en Java II y refactorización de código universitario.

Tienes el siguiente archivo Java que necesita mejoras:

ARCHIVO: ${fileTarget}
CÓDIGO ACTUAL:
\`\`\`java
${currentCode}
\`\`\`

${teacherDoc ? `NOTAS DEL PROFESOR:\n${teacherDoc}\n\n` : ''}

MEJORAS A APLICAR:
${proposalsText}

Genera el archivo Java completo con TODAS las mejoras aplicadas correctamente.
El código debe:
- Compilar sin errores
- Mantener la lógica original
- Aplicar las mejoras indicadas
- Seguir buenas prácticas POO

Devuelve ÚNICAMENTE el código Java limpio, sin explicaciones ni markdown.`;
}
