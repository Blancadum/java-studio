
export interface FaqItem {
  question: string;
  answer: string;
}

const HOME_FAQ_DATA: FaqItem[] = [
  {
    question: '¿Qué es Java Studio?',
    answer: 'Es un copiloto académico de IA especializado en auditoría de código Java II (POO). Analiza tus entregas, detecta violaciones de arquitectura, limpia comentarios sospechosos de IA y genera refactorizaciones guiadas para que aprendas mientras mejoras tu nota.'
  },
  {
    question: '¿Es seguro usar Java Studio?',
    answer: 'Totalmente. No compartimos tus archivos con terceros. Solo accedemos a Google Drive cuando tú lo autorizas, y los datos se procesan exclusivamente durante tu sesión activa. Ver Política de Privacidad en el footer.'
  },
  {
    question: '¿Es totalmente gratis?',
    answer: 'Sí, 100% gratuito para estudiantes universitarios. Java Studio es impulsado por la comunidad Fullstack Web Dev Lovers sin ánimo de lucro.'
  },
  {
    question: '¿Puedo usar Java Studio sin conexión a internet?',
    answer: 'No. El motor de IA requiere conexión a internet para analizar tu código. Sin embargo, puedes descargar los resultados y trabajar offline después del análisis.'
  },
  {
    question: '¿Verá mi profesor que uso Java Studio?',
    answer: 'No. Java Studio es una herramienta privada de aprendizaje. Solo tú ves los resultados. El código que entregas es tuyo y tus mejoras deben ser implementadas por ti para aprender genuinamente.'
  },
  {
    question: '¿Funciona con archivos .ZIP y proyectos grandes?',
    answer: 'Sí. Puedes subir archivos .java individuales o un .ZIP completo de tu proyecto. El sistema detecta automáticamente la estructura de paquetes.'
  },
  {
    question: '¿Cuánto tarda el análisis?',
    answer: 'Entre 5-30 segundos según la complejidad del proyecto y el modo seleccionado. Los análisis se guardan en tu perfil para no reprocesar innecesariamente.'
  },
  {
    question: '¿Cómo me paso a mí mismo los comentarios de feedback de mi profe?',
    answer: 'Puedes pegar directamente el texto del PDF de correcciones en el cuadro "Notas de tu profe" (modo Subsanación). El motor interpretará las sugerencias de refactorización.'
  },
  {
    question: '¿Necesito credenciales especiales o una cuenta universitaria?',
    answer: 'No. Solo necesitas una cuenta de Google (personal o universitaria) para conectar Google Drive y guardar tus análisis en tu perfil.'
  },
  {
    question: '¿Qué pasa si mi código es muy pequeño o muy grande?',
    answer: 'El sistema se adapta. Código pequeño: genera esqueletos con TODOs. Código grande: procesa por módulos y da prioridades en refactorización.'
  },
  {
    question: '¿Puedo usar Java Studio en exámenes en línea supervisados?',
    answer: 'Técnicamente sí (es una web), pero violaría la integridad académica si lo usas durante el examen. Úsalo ANTES para practicar o DESPUÉS para revisar tu entrega.'
  },
  {
    question: '¿Cómo garantiza Java Studio que respeta mi trabajo original?',
    answer: 'El motor respeta la estructura y nombres de variables originales aplicando cambios quirúrgicos únicamente en las firmas y patrones requeridos por la rúbrica del profesor.'
  },
  {
    question: '¿Puedo descargar las clases corregidas y los tests JUnit 5 en un archivo .ZIP?',
    answer: 'Sí, una vez finalizado el análisis podrás descargar todos los parches y archivos .java listos para empaquetar y entregar.'
  }
];

const DESDE_CERO_FAQS: FaqItem[] = [
  {
    question: '¿De dónde vienen las clases?',
    answer: 'Subes el enunciado de la práctica, y Java Studio genera la estructura de clases recomendada basada en patrones de diseño Java II.'
  },
  {
    question: '¿Puedo descargar el código generado?',
    answer: 'Sí, puedes copiar/descargar el código generado y usarlo como punto de partida para tu solución.'
  },
  {
    question: '¿Qué patrones de diseño cubre?',
    answer: 'MVC, DAO, Factory, Singleton, y otros patrones comunes en proyectos Java empresariales.'
  },
  {
    question: '¿Y si el enunciado es muy vago?',
    answer: 'Puedes refinar el enunciado varias veces. Java Studio aprende y mejora sus recomendaciones iterativamente.'
  }
];

const ANTES_DE_ENTREGAR_FAQS: FaqItem[] = [
  {
    question: '¿Qué se revisa en esta auditoría?',
    answer: 'Estructura de carpetas, clases sin usar, código comentado, nomenclatura inconsistente, archivos temporales y todo lo que podría entorpecer la entrega.'
  },
  {
    question: '¿Me dice si hay bugs?',
    answer: 'No, esta auditoría se enfoca en limpieza y presentación. Para análisis de lógica, usa el modo "Corregir con Feedback del Profe".'
  },
  {
    question: '¿Cuánto tarda el análisis?',
    answer: 'Típicamente 30-60 segundos. Depende del tamaño de tu proyecto.'
  },
  {
    question: '¿Puedo ignorar sus recomendaciones?',
    answer: 'Claro. Pero recuerda que la presentación cuenta en la evaluación. Mejor revisar ahora que después.'
  }
];

const CORREGIR_FEEDBACK_FAQS: FaqItem[] = [
  {
    question: '¿Qué necesito subir?',
    answer: 'Tu código original (sin corregir), el código que ya has arreglado, y el documento de feedback del profesor. Java Studio comparará versiones y te mostrará qué mejoraste y qué aún falta.'
  },
  {
    question: '¿Me muestra la solución correcta?',
    answer: 'No. Te muestra análisis del feedback y cómo tu código aborda cada crítica del profesor. Es sobre aprendizaje, no sobre copiar la solución.'
  },
  {
    question: '¿Qué pasa si no tengo feedback del profe?',
    answer: 'Puedes usar una rúbrica estándar de Java II. Java Studio la aplicará automáticamente para identificar áreas de mejora.'
  },
  {
    question: '¿Puedo hacer esto varias veces?',
    answer: 'Sí. Cada vez que corriges, puedes volver a analizar. Así ves tu progreso iterativo.'
  }
];

const BUENAS_PRACTICAS_FAQS: FaqItem[] = [
  {
    question: '¿Qué se revisa en este análisis?',
    answer: 'Bugs potenciales, vulnerabilidades, code smells (métodos largos, duplicación), y mantenibilidad general del código según estándares SonarQube.'
  },
  {
    question: '¿Es lo mismo que la auditoría "Antes de Entregar"?',
    answer: 'No. "Antes de Entregar" se enfoca en la presentación y limpieza superficial. Este modo se centra en la calidad intrínseca del código y la aplicación de buenas prácticas de programación.'
  },
  {
    question: '¿Cómo se calculan las métricas?',
    answer: 'Se utilizan reglas de SonarQube estándar y una configuración personalizada para Java II, adaptada a los requisitos universitarios.'
  },
  {
    question: '¿Puedo ver el historial de mis mejoras?',
    answer: 'Sí, cada análisis se guarda en tu perfil, permitiéndote comparar versiones y ver cómo tu código evoluciona en calidad.'
  }
];

export const ALL_FAQS = {
  home: HOME_FAQ_DATA,
  desdeCero: DESDE_CERO_FAQS,
  antesDeEntregar: ANTES_DE_ENTREGAR_FAQS,
  corregirFeedback: CORREGIR_FEEDBACK_FAQS,
  buenasPracticas: BUENAS_PRACTICAS_FAQS,
};