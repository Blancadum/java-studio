import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { StudentPersonaMode, PageType } from '../data/types'; // Import PageType
import { ArrowLeft } from 'lucide-react'; // Import ArrowLeft icon

interface ExploreModesPageProps {
  navigateToApp: (mode: StudentPersonaMode) => void;
  goBack: () => void;
}

interface ModeCard {
  mode: StudentPersonaMode;
  title: string;
  emoji: string;
  description: string;
  highlights: string[];
  color: string;
}

const MODES: ModeCard[] = [
  {
    mode: 'ARCHITECTURE_NOOB',
    title: 'Desde Cero',
    emoji: '🏗️',
    description: 'Aprende a diseñar la arquitectura de tu proyecto desde el enunciado. Recibe una guía paso a paso para estructurar clases, paquetes e interfaces.',
    highlights: [
      'Análisis del enunciado',
      'Diseño de arquitectura',
      'Propuesta de estructura de carpetas',
      'Diagrama de clases',
    ],
    color: 'from-blue-50 to-blue-100',
  },
  {
    mode: 'PRE_SUBMISSION_AUDIT',
    title: 'Antes de Entregar',
    emoji: '✅',
    description: 'Revisa tu proyecto antes de presentar. Detecta problemas de formato, nomenclatura y compliance con rúbrica.',
    highlights: [
      'Validación de formato',
      'Chequeo de convenciones',
      'Anti-IA detection',
      'Cumplimiento de rúbrica',
    ],
    color: 'from-green-50 to-green-100',
  },
  {
    mode: 'FEEDBACK_REVISION',
    title: 'Corregir con Feedback',
    emoji: '📝',
    description: 'Recibe retroalimentación detallada de tu código. Obtén propuestas concretas de mejora basadas en los comentarios del profesor.',
    highlights: [
      'Análisis de feedback',
      'Propuestas de refactoring',
      'Explicaciones pedagógicas',
      'Cumplimiento de requisitos',
    ],
    color: 'from-yellow-50 to-yellow-100',
  },
  {
    mode: 'SONAR_QUALITY',
    title: 'Buenas Prácticas',
    emoji: '⭐',
    description: 'Mejora la calidad de tu código. Análisis SonarQube, SOLID principles y testing recommendations.',
    highlights: [
      'Análisis SonarQube',
      'SOLID principles',
      'Code smells',
      'Testing strategies',
    ],
    color: 'from-purple-50 to-purple-100',
  },
];

export const ExploreModesPage: React.FC<ExploreModesPageProps> = ({ navigateToApp, goBack }) => {

  const modesWithRoutes = MODES.map(m => ({
    ...m,
    id: m.mode,
    icon: m.emoji,
    shortTitle: m.title,
    colorClass: m.color.split('-')[1]
  }));

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <button
            type="button"
            onClick={goBack}
            className="text-sm text-gray-600 hover:text-black mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <h1 className="text-4xl font-bold mb-4">Explora los Modos</h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            Java Studio ofrece 4 modos educativos especializados. Elige uno para comenzar a mejorar tu código.
          </p>
        </div>

        {/* Mode Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {modesWithRoutes.map((mode) => ( // Use modesWithRoutes
            <div
              key={mode.id}
              className={`bg-gradient-to-br from-${mode.colorClass}-50 to-${mode.colorClass}-100 rounded-lg p-8 border border-gray-200 hover:border-gray-400 transition-all`}
            >
              {/* Emoji & Title */}
              <div className="mb-4">
                <span className="text-4xl mb-2 block">{mode.icon}</span> {/* Use mode.icon */}
                <h2 className="text-2xl font-bold text-gray-900">{mode.shortTitle}</h2> {/* Use mode.shortTitle */}
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6">{mode.description}</p>

              {/* Highlights */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">Qué incluye:</p>
                <ul className="space-y-2">
                  {mode.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                onClick={() => navigateToApp(mode.mode)}
                className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors"
              >
                Comenzar con {mode.title}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
          <h3 className="text-xl font-bold mb-4">¿Cuál debo elegir?</h3>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Estoy comenzando el proyecto:</strong> Usa <span className="font-semibold">"Desde Cero"</span> para diseñar la arquitectura desde el enunciado.
            </p>
            <p>
              <strong>Ya tengo avances:</strong> Usa <span className="font-semibold">"Corregir con Feedback"</span> si el profesor dejó comentarios, o <span className="font-semibold">"Buenas Prácticas"</span> para mejorar la calidad general.
            </p>
            <p>
              <strong>Estoy listo para entregar:</strong> Usa <span className="font-semibold">"Antes de Entregar"</span> para hacer una revisión final y detectar problemas.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
