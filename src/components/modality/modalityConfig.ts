import { StudentPersonaMode } from '../../data/types';

export interface ModalityConfig {
  id: StudentPersonaMode;
  title: string;
  subtitle: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  fileRequirements: FileRequirement[];
  refinementOptions: RefinementOption[];
}

export interface FileRequirement {
  id: string;
  label: string;
  hint: string;
  type: 'zip' | 'text';
  required: boolean;
}

export interface RefinementOption {
  id: string;
  label: string;
  description?: string;
  type: 'checkbox' | 'select' | 'radio';
  defaultValue?: boolean | string;
  options?: { value: string; label: string }[];
}

export const MODALITY_CONFIGS: Record<StudentPersonaMode, ModalityConfig> = {
  ARCHITECTURE_NOOB: {
    id: 'ARCHITECTURE_NOOB',
    title: 'Desde cero',
    subtitle: 'Estructura de la lógica',
    description:
      'Obtén un análisis completo sobre cómo estructurar tu proyecto desde cero. Perfecto si aún no sabes por dónde empezar.',
    difficulty: 'beginner',
    fileRequirements: [
      {
        id: 'project_zip',
        label: 'Proyecto (ZIP)',
        hint: 'Tu proyecto comprimido tal como está ahora',
        type: 'zip',
        required: true,
      },
      {
        id: 'statement_text',
        label: 'Enunciado o Rúbrica',
        hint: 'El enunciado del ejercicio o criterios de evaluación',
        type: 'text',
        required: true,
      },
    ],
    refinementOptions: [
      {
        id: 'includeInterfaces',
        label: 'Sugerir uso de interfaces',
        description: 'Incluye recomendaciones sobre patrones de diseño',
        type: 'checkbox',
        defaultValue: true,
      },
      {
        id: 'useLombok',
        label: 'Usar Lombok',
        description: 'Sugerir simplificación de código con anotaciones',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        id: 'generateTodoComments',
        label: 'Generar comentarios TODO',
        description: 'Incluir puntos de mejora como comentarios',
        type: 'checkbox',
        defaultValue: true,
      },
      {
        id: 'javaVersion',
        label: 'Versión de Java',
        description: 'Idiomas y sintaxis a considerar',
        type: 'select',
        defaultValue: 'java17',
        options: [
          { value: 'java8', label: 'Java 8' },
          { value: 'java11', label: 'Java 11' },
          { value: 'java17', label: 'Java 17' },
          { value: 'java21', label: 'Java 21' },
        ],
      },
    ],
  },

  PRE_SUBMISSION_AUDIT: {
    id: 'PRE_SUBMISSION_AUDIT',
    title: 'Antes de entregar',
    subtitle: 'Corrección y limpieza',
    description:
      'Revisa tu código antes de enviarlo. Detecta errores, limpia código muerto y mejora la calidad general.',
    difficulty: 'intermediate',
    fileRequirements: [
      {
        id: 'project_zip',
        label: 'Proyecto (ZIP)',
        hint: 'Tu proyecto listo para entregar',
        type: 'zip',
        required: true,
      },
      {
        id: 'statement_text',
        label: 'Enunciado o Rúbrica',
        hint: 'El enunciado del ejercicio para validar cumplimiento',
        type: 'text',
        required: true,
      },
    ],
    refinementOptions: [
      {
        id: 'purgeFolders',
        label: 'Limpiar carpetas innecesarias',
        description: 'Eliminar .git, node_modules, build, etc.',
        type: 'checkbox',
        defaultValue: true,
      },
      {
        id: 'sanitizeAiComments',
        label: 'Remover comentarios de IA',
        description: 'Detectar y limpiar comentarios generados por herramientas',
        type: 'checkbox',
        defaultValue: true,
      },
      {
        id: 'checkRubric',
        label: 'Validar contra rúbrica',
        description: 'Verificar que cumples todos los criterios',
        type: 'checkbox',
        defaultValue: true,
      },
    ],
  },

  FEEDBACK_REVISION: {
    id: 'FEEDBACK_REVISION',
    title: 'Corregir con feedback',
    subtitle: 'La 2nda oportunidad',
    description:
      'Tu profe ya te dio feedback. Carga el original y tu intento de corrección para comparar mejoras.',
    difficulty: 'intermediate',
    fileRequirements: [
      {
        id: 'original_zip',
        label: 'Proyecto original (ZIP)',
        hint: 'El que recibió feedback de tu profesor',
        type: 'zip',
        required: true,
      },
      {
        id: 'revised_zip',
        label: 'Proyecto corregido (ZIP)',
        hint: 'Tu versión después de aplicar feedback',
        type: 'zip',
        required: true,
      },
      {
        id: 'feedback_text',
        label: 'Feedback de tu profesor',
        hint: 'El feedback que recibiste (copia-pega o archivo)',
        type: 'text',
        required: true,
      },
    ],
    refinementOptions: [
      {
        id: 'focusOnCritical',
        label: 'Enfoque en problemas críticos',
        description: 'Priorizar feedback que afecta la funcionalidad',
        type: 'checkbox',
        defaultValue: true,
      },
      {
        id: 'showDetailedExplanations',
        label: 'Explicaciones detalladas',
        description: 'Incluir por qué cambiar cada cosa',
        type: 'checkbox',
        defaultValue: true,
      },
    ],
  },

  SONAR_QUALITY: {
    id: 'SONAR_QUALITY',
    title: 'Buenas prácticas',
    subtitle: 'Código profesional',
    description:
      'Optimiza tu código con estándares de la industria. Detecta code smells, metricas de complejidad y seguridad.',
    difficulty: 'advanced',
    fileRequirements: [
      {
        id: 'project_zip',
        label: 'Proyecto (ZIP)',
        hint: 'Tu proyecto para análisis profundo',
        type: 'zip',
        required: true,
      },
      {
        id: 'statement_text',
        label: 'Enunciado o Rúbrica',
        hint: 'Para contexto de lo que el código debe hacer',
        type: 'text',
        required: true,
      },
    ],
    refinementOptions: [
      {
        id: 'evalS3776',
        label: 'Evaluar complejidad ciclomática',
        description: 'Detectar métodos demasiado complejos',
        type: 'checkbox',
        defaultValue: true,
      },
      {
        id: 'evalStringConcat',
        label: 'Optimizar concatenación de strings',
        description: 'Sugerir StringBuilder en bucles',
        type: 'checkbox',
        defaultValue: true,
      },
      {
        id: 'generateJunit5',
        label: 'Generar tests (JUnit 5)',
        description: 'Sugerir casos de prueba',
        type: 'checkbox',
        defaultValue: false,
      },
    ],
  },
};

export const SLUG_TO_MODE: Record<string, StudentPersonaMode> = {
  'desde-cero': 'ARCHITECTURE_NOOB',
  'antes-de-entregar': 'PRE_SUBMISSION_AUDIT',
  'corregir-con-feedback': 'FEEDBACK_REVISION',
  'buenas-practicas': 'SONAR_QUALITY',
};

export const MODE_TO_SLUG: Record<StudentPersonaMode, string> = {
  ARCHITECTURE_NOOB: 'desde-cero',
  PRE_SUBMISSION_AUDIT: 'antes-de-entregar',
  FEEDBACK_REVISION: 'corregir-con-feedback',
  SONAR_QUALITY: 'buenas-practicas',
};
