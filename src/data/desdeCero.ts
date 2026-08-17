import { ALL_FAQS } from './faq-content/faq'; // Updated import path

// Contenido específico para la página de Desde Cero
export const modeDetailDesdeCeroContent = {
  hero: {
    title: "Desde Cero",
    subtitle: "Genera la arquitectura completa de tu proyecto Java basada en mejores prácticas universitarias.",
    buttonText: "Empezar Ahora",
  },
  features: {
    title: "Qué Aprenderás",
    items: [
      { title: "Diseño de Clases", description: "Estructura jerárquica de clases con herencia y composición" },
      { title: "Interfaces y Contratos", description: "Definir interfaces claras entre componentes" },
      { title: "Patrones de Diseño", description: "MVC, DAO, Factory, Singleton y más" },
      { title: "Capas de Aplicación", description: "Separación clara: presentación, lógica, persistencia" },
    ],
  },
  howItWorks: {
    title: "Cómo Funciona",
    steps: [
      { title: "Describe el Proyecto", description: "Sube o describe el enunciado de tu práctica Java II. Incluye requisitos, tipos de datos, y cualquier restricción." },
      { title: "IA Analiza y Propone", description: "Google Gemini analiza el enunciado y sugiere una arquitectura completa respetando patrones universitarios." },
      { title: "Recibe Código Generado", description: "Descarga todas las clases generadas, listas para editarlas e integrar tu lógica de negocio específica." },
      { title: "Mejora Iterativa", description: "No te gusta algo? Refina el enunciado y regenera. Así aprenderás qué cambios generan mejores diseños." },
    ],
  },
  faq: {
    title: "Preguntas Frecuentes - Desde Cero",
    faqs: ALL_FAQS.desdeCero,
  },
  cta: {
    title: "Listo para Empezar?",
    subtitle: "Genera la arquitectura perfecta para tu próximo proyecto Java II en minutos.",
    primaryButtonText: "Ir a la Aplicación",
    secondaryButtonText: "Volver a Modos",
  },
};