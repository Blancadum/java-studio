import { ALL_FAQS } from './faq-content/faq'; // Updated import path


// Contenido específico para la página de Antes de Entregar
export const modeDetailAntesDeEntregarContent = {
  hero: {
    title: "Antes de Entregar",
    subtitle: "Auditoría completa de limpieza y presentación. Asegúrate de que tu proyecto está listo antes de entregar.",
    buttonText: "Empezar Auditoría",
  },
  features: {
    title: "Qué Revisaremos",
    items: [
      { title: "Estructura de Carpetas", description: "Organización clara y profesional de packages" },
      { title: "Código Muerto", description: "Clases, métodos y variables sin usar" },
      { title: "Comentarios y Limpieza", description: "Código comentado, TODO pendientes, debugging" },
      { title: "Nombrado Consistente", description: "Convenciones Java: camelCase, PascalCase, CONSTANTS" },
    ],
  },
  howItWorks: {
    title: "Cómo Funciona",
    steps: [
      { title: "Carga tu Proyecto", description: "Sube todos tus archivos .java. Java Studio los escanea automáticamente." },
      { title: "IA Realiza Auditoría", description: "Analiza cada archivo en busca de problemas de presentación y limpieza." },
      { title: "Recibe Reporte Detallado", description: "Lista priorizada de problemas encontrados con explicación de cada uno." },
      { title: "Arregla y Vuelve a Auditar", description: "Haz los cambios sugeridos y vuelve a ejecutar la auditoría para verificar." },
    ],
  },
  faq: {
    title: "Preguntas Frecuentes - Antes de Entregar",
    faqs: ALL_FAQS.antesDeEntregar,
  },
  cta: {
    title: "Audita tu Proyecto Ahora",
    subtitle: "Descubre qué necesita limpieza antes de entregar. Mejor ahora que en la defensa.",
    primaryButtonText: "Ir a la Auditoría",
    secondaryButtonText: "Volver a Modos",
  },
};