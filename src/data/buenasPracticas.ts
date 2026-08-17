import { ALL_FAQS } from './faq-content/faq'; // Updated import path

// Contenido específico para la página de Buenas Prácticas
export const modeDetailBuenasPracticasContent = {
  hero: {
    title: "Buenas Prácticas",
    subtitle: "Análisis de calidad SonarQube. Escribe código profesional que pasaría un code review real.",
    buttonText: "Analizar Calidad",
  },
  features: {
    title: "Qué Revisaremos",
    items: [
      { title: "Bugs Potenciales", description: "Errores que pasarían testing casual pero rompen en producción" },
      { title: "Vulnerabilidades", description: "Issues de seguridad, null pointers, race conditions" },
      { title: "Code Smells", description: "Métodos muy largos, duplicación, complejidad ciclomática" },
      { title: "Mantenibilidad", description: "¿Podría otro desarrollador entender tu código?" },
    ],
  },
  howItWorks: {
    title: "Cómo Funciona",
    steps: [
      { title: "Carga tu Código", description: "Sube todos tus archivos Java. Java Studio prepara un análisis SonarQube automático." },
      { title: "IA Ejecuta Métricas", description: "Escanea contra reglas SonarQube standard + configuración universitaria." },
      { title: "Recibe Reporte Visual", description: "Gráfico de calidad global + lista priorizada de cada issue (crítico → menor)." },
      { title: "Refactoriza y Mejora", description: "Implementa recomendaciones. Vuelve a analizar para ver el progreso en tu score." },
    ],
  },
  faq: {
    title: "Preguntas Frecuentes - Buenas Prácticas",
    faqs: ALL_FAQS.buenasPracticas, // Corregido para usar las FAQs correctas
  },
  cta: {
    title: "Escribe Código Profesional",
    subtitle: "Aprende los estándares que usa la industria real. Tu código será más mantenible y confiable.",
    primaryButtonText: "Ir al Análisis SonarQube",
    secondaryButtonText: "Volver a Modos",
  },
};