import { ALL_FAQS } from './faq-content/faq'; // Updated import path

// Contenido específico para la página de Corregir con Feedback
export const modeDetailCorregirFeedbackContent = {
  hero: {
    title: "Corregir con Feedback del Profe",
    subtitle: "Mejora iterativa basada en retroalimentación real. Entiende qué te pedía el profesor y cómo tu código responde.",
    buttonText: "Empezar Análisis",
  },
  features: {
    title: "Qué Lograrás",
    items: [
      { title: "Entiende el Feedback", description: "Decodificación clara de cada crítica del profesor" },
      { title: "Comparación de Versiones", description: "Visualiza exactamente qué cambiaste entre intentos" },
      { title: "Mejoras Sugeridas", description: "Propuestas específicas para cada punto de feedback" },
      { title: "Seguimiento de Progreso", description: "Mide cuánto has mejorado en cada iteración" },
    ],
  },
  howItWorks: {
    title: "Cómo Funciona",
    steps: [
      { title: "Sube Tres Cosas", description: "Tu código original, tu código corregido, y el documento de feedback del profesor (Word, PDF o texto)." },
      { title: "IA Analiza y Compara", description: "Extrae los puntos clave del feedback y compara cómo tu código los aborda." },
      { title: "Recibe Análisis Detallado", description: "Reporte mostrando punto por punto: qué pedía el profesor, qué hiciste, qué te falta." },
      { title: "Implementa Mejoras", description: "Usa las sugerencias para refinar tu código. Vuelve a subir cuando tengas nueva versión." },
    ],
  },
  faq: {
    title: "Preguntas Frecuentes - Corregir Feedback",
    faqs: ALL_FAQS.corregirFeedback,
  },
  cta: {
    title: "Tu Segunda Oportunidad",
    subtitle: "Hiciste cambios tras el feedback? Vamos a verificar si respondiste bien a cada crítica.",
    primaryButtonText: "Ir al Análisis",
    secondaryButtonText: "Volver a Modos",
  },
};